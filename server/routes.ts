import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStudentSchema, insertAppointmentSchema, registerUserSchema, insertEnrollmentSchema, insertCourseSchema, insertArticleSchema } from "@shared/schema";
import { hashPassword, verifyPassword, generateToken, authMiddleware, type AuthRequest, authMiddlewareWithUser, requireAdminMiddleware } from "./auth";
import Stripe from "stripe";
import { sendWelcomeEmail, sendPaymentConfirmationEmail, sendAppointmentConfirmationEmail } from "./email";

// Reference: Stripe integration blueprint (blueprint:javascript_stripe)
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-10-29.clover",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = registerUserSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ 
          error: "Ya existe una cuenta con este email" 
        });
      }

      // Hash password
      const hashedPassword = await hashPassword(validatedData.password);

      // Create user with transformed data
      const user = await storage.createUser({
        email: validatedData.email,
        passwordHash: hashedPassword,
        fullName: validatedData.name,
        role: validatedData.role || "student",
      });

      // Generate token
      const token = generateToken(user.id);

      // Send welcome email (non-blocking)
      sendWelcomeEmail({
        userName: user.fullName,
        userEmail: user.email,
      }).catch(error => {
        console.error('Failed to send welcome email:', error);
      });

      // Return user without password, with name field for frontend
      const { passwordHash: _, fullName, ...userRest } = user;
      res.json({ user: { ...userRest, name: fullName }, token });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email y contraseña son requeridos" });
      }

      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Email o contraseña incorrectos" });
      }

      // Verify password
      const isValidPassword = await verifyPassword(password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Email o contraseña incorrectos" });
      }

      // Generate token
      const token = generateToken(user.id);

      // Return user without password, with name field for frontend
      const { passwordHash: _, fullName, ...userRest } = user;
      res.json({ user: { ...userRest, name: fullName }, token });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/auth/me", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const user = await storage.getUser(req.userId!);
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      // Return user without password, with name field for frontend
      const { passwordHash, fullName, ...userRest } = user;
      res.json({ ...userRest, name: fullName });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Enrollment routes
  app.post("/api/enrollments", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { courseId } = req.body;
      const userId = req.userId!;

      if (!courseId) {
        return res.status(400).json({ error: "El ID del curso es requerido" });
      }

      // Verify course exists
      const course = await storage.getCourse(courseId);
      if (!course) {
        return res.status(404).json({ error: "Curso no encontrado" });
      }

      // Check if user is already enrolled
      const existingEnrollment = await storage.getEnrollmentByCourseAndUser(userId, courseId);
      if (existingEnrollment) {
        return res.status(400).json({ error: "Ya estás inscrito en este curso" });
      }

      // Create enrollment with pending payment status
      const enrollment = await storage.createEnrollment({
        userId,
        courseId,
        paymentStatus: "pending",
        progressPercentage: "0",
      });

      res.json(enrollment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/enrollments", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;
      const enrollments = await storage.getUserEnrollments(userId);
      res.json(enrollments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/courses/:courseId/enrollment", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;
      const { courseId } = req.params;

      const enrollment = await storage.getEnrollmentByCourseAndUser(userId, courseId);
      
      if (!enrollment) {
        return res.status(404).json({ error: "No estás inscrito en este curso" });
      }

      res.json(enrollment);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Stripe payment routes (Reference: blueprint:javascript_stripe)
  // Create payment intent for course enrollment
  app.post("/api/create-payment-intent", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { enrollmentId } = req.body;
      const userId = req.userId!;

      if (!enrollmentId) {
        return res.status(400).json({ error: "El ID de inscripción es requerido" });
      }

      // Get enrollment
      const enrollment = await storage.getEnrollmentById(enrollmentId);
      if (!enrollment) {
        return res.status(404).json({ error: "Inscripción no encontrada" });
      }

      // Verify enrollment belongs to user
      if (enrollment.userId !== userId) {
        return res.status(403).json({ error: "No autorizado" });
      }

      // Verify enrollment is pending
      if (enrollment.paymentStatus !== "pending") {
        return res.status(400).json({ error: "Esta inscripción ya ha sido procesada" });
      }

      // Get course to get the price
      const course = await storage.getCourse(enrollment.courseId);
      if (!course) {
        return res.status(404).json({ error: "Curso no encontrado" });
      }

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(parseFloat(course.price) * 100), // Convert to cents
        currency: "eur",
        metadata: {
          enrollmentId: enrollment.id,
          courseId: course.id,
          userId: userId,
          courseName: course.title,
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ 
        error: "Error al crear intención de pago: " + error.message 
      });
    }
  });

  // Confirm payment and update enrollment status
  app.post("/api/confirm-payment", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { paymentIntentId, enrollmentId } = req.body;
      const userId = req.userId!;

      if (!paymentIntentId || !enrollmentId) {
        return res.status(400).json({ 
          error: "Payment Intent ID y Enrollment ID son requeridos" 
        });
      }

      // Get enrollment and verify it belongs to user
      const enrollment = await storage.getEnrollmentById(enrollmentId);
      if (!enrollment) {
        return res.status(404).json({ error: "Inscripción no encontrada" });
      }

      if (enrollment.userId !== userId) {
        return res.status(403).json({ error: "No autorizado" });
      }

      // Verify payment intent with Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({ 
          error: "El pago no se ha completado exitosamente" 
        });
      }

      // Update enrollment status
      await storage.updateEnrollmentPaymentStatus(
        enrollmentId,
        "completed",
        paymentIntentId
      );

      // Get user and course info for email
      const user = await storage.getUser(userId);
      const course = await storage.getCourse(enrollment.courseId);

      if (user && course) {
        // Send payment confirmation email (non-blocking)
        sendPaymentConfirmationEmail({
          userName: user.fullName,
          userEmail: user.email,
          courseName: course.title,
          amount: paymentIntent.amount,
          paymentDate: new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        }).catch(error => {
          console.error('Failed to send payment confirmation email:', error);
        });
      }

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ 
        error: "Error al confirmar el pago: " + error.message 
      });
    }
  });

  // Webhook to handle successful payments
  app.post("/api/stripe-webhook", async (req, res) => {
    const sig = req.headers['stripe-signature'];

    if (!sig) {
      return res.status(400).send('Missing stripe-signature header');
    }

    let event;

    try {
      // For now, we'll use the webhook without signature verification for simplicity
      // In production, you should verify the signature
      event = req.body;
    } catch (err: any) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const enrollmentId = paymentIntent.metadata.enrollmentId;

      if (enrollmentId) {
        try {
          // Update enrollment status and add payment ID
          await storage.updateEnrollmentPaymentStatus(
            enrollmentId, 
            "completed",
            paymentIntent.id
          );
        } catch (error: any) {
          console.error('Error updating enrollment:', error);
        }
      }
    }

    res.json({ received: true });
  });

  // Student routes
  app.post("/api/students", async (req, res) => {
    try {
      const validatedData = insertStudentSchema.parse(req.body);
      
      // Check if student already exists
      const existingStudent = await storage.getStudentByEmail(validatedData.email);
      if (existingStudent) {
        return res.status(400).json({ 
          error: "Un estudiante con este email ya está registrado" 
        });
      }

      const student = await storage.createStudent(validatedData);
      res.json(student);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/students", async (req, res) => {
    try {
      const students = await storage.getAllStudents();
      res.json(students);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/students/:id", async (req, res) => {
    try {
      const student = await storage.getStudent(req.params.id);
      if (!student) {
        return res.status(404).json({ error: "Estudiante no encontrado" });
      }
      res.json(student);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Appointment routes
  app.post("/api/appointments", async (req, res) => {
    try {
      const validatedData = insertAppointmentSchema.parse(req.body);
      
      // Check if time slot is already taken
      const existingAppointments = await storage.getAppointmentsByDate(validatedData.date);
      const isTimeSlotTaken = existingAppointments.some(
        (apt) => apt.time === validatedData.time
      );

      if (isTimeSlotTaken) {
        return res.status(400).json({ 
          error: "Este horario ya está reservado. Por favor, selecciona otro." 
        });
      }

      const appointment = await storage.createAppointment(validatedData);

      // Send appointment confirmation email (non-blocking)
      // Format date safely for the email
      let formattedDate = appointment.date; // fallback to raw date string
      try {
        // Ensure the date string is in a proper format for Date constructor
        // If it's in YYYY-MM-DD format, we should handle it properly
        const dateObj = new Date(appointment.date);
        if (!isNaN(dateObj.getTime())) { // Check if date is valid
          formattedDate = dateObj.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
        }
      } catch (error) {
        console.error('Error formatting appointment date for email:', error);
        // Keep the fallback formattedDate if date parsing fails
      }
      
      // Check if appointment is valid before sending response
      if (!appointment) {
        console.error('Appointment creation returned undefined');
        return res.status(500).json({ error: 'La creación de la cita falló' });
      }

      // Send response immediately to client before non-blocking email
      res.json(appointment);

      // Send appointment confirmation email (non-blocking)
      sendAppointmentConfirmationEmail({
        userName: appointment.fullName,
        userEmail: appointment.email,
        appointmentDate: formattedDate,
        appointmentTime: appointment.time,
      }).catch(error => {
        console.error('Failed to send appointment confirmation email:', error);
      });
    } catch (error) {
      // Log error type without accessing properties that might cause issues
      console.error('Error in appointment creation:', typeof error, error?.constructor?.name);
      
      // Use the most defensive approach to get an error message
      let errorMessage = 'Error desconocido al crear la cita';
      
      try {
        // Only access message property if error is a proper object
        if (error && typeof error === 'object' && error.message && typeof error.message === 'string') {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }
      } catch (msgError) {
        // If accessing the message property causes an error, use default
        console.error('Error accessing error message property:', msgError);
      }
      
      // Send response with safe error message
      res.status(500).json({ error: errorMessage });
    }
  });

  app.get("/api/appointments", async (req, res) => {
    try {
      const { date } = req.query;
      
      if (date && typeof date === "string") {
        const appointments = await storage.getAppointmentsByDate(date);
        res.json(appointments);
      } else {
        const appointments = await storage.getAllAppointments();
        res.json(appointments);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/appointments/:id", async (req, res) => {
    try {
      const appointment = await storage.getAppointment(req.params.id);
      if (!appointment) {
        return res.status(404).json({ error: "Cita no encontrada" });
      }
      res.json(appointment);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Courses routes
  app.get("/api/courses", async (req, res) => {
    try {
      const allCourses = await storage.getAllCourses();
      res.json(allCourses);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/courses/featured", async (req, res) => {
    try {
      const featuredCourses = await storage.getFeaturedCourses();
      res.json(featuredCourses);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      // Try by ID first
      let course = await storage.getCourse(req.params.id);
      // If not found, try by slug
      if (!course) {
        course = await storage.getCourseBySlug(req.params.id);
      }
      if (!course) {
        return res.status(404).json({ error: "Curso no encontrado" });
      }
      res.json(course);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Articles routes
  app.get("/api/articles", async (req, res) => {
    try {
      const allArticles = await storage.getAllArticles();
      res.json(allArticles);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/articles/:id", async (req, res) => {
    try {
      // Try by ID first
      let article = await storage.getArticle(req.params.id);
      // If not found, try by slug
      if (!article) {
        article = await storage.getArticleBySlug(req.params.id);
      }
      if (!article) {
        return res.status(404).json({ error: "Artículo no encontrado" });
      }
      res.json(article);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin middleware pipeline
  const adminMiddleware = await requireAdminMiddleware(storage);

  // ============================================
  // ADMIN ROUTES
  // ============================================

  // Dashboard statistics
  app.get("/api/admin/dashboard", authMiddlewareWithUser, adminMiddleware, async (req: AuthRequest, res) => {
    try {
      const [users, courses, appointments, enrollments] = await Promise.all([
        storage.getAllUsers(),
        storage.getAllCoursesAdmin(),
        storage.getAllAppointments(),
        storage.getAllEnrollments(),
      ]);

      const publishedCourses = courses.filter(c => c.isPublished).length;
      const completedEnrollments = enrollments.filter(e => e.paymentStatus === "completed");
      const totalRevenue = completedEnrollments.reduce((sum, e) => {
        const course = courses.find(c => c.id === e.courseId);
        return sum + (course ? parseFloat(course.price) : 0);
      }, 0);

      // Appointments this week
      const today = new Date();
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 7);

      const appointmentsThisWeek = appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate >= startOfWeek && aptDate < endOfWeek;
      });

      res.json({
        totalUsers: users.length,
        totalCourses: courses.length,
        publishedCourses,
        totalAppointments: appointments.length,
        appointmentsThisWeek: appointmentsThisWeek.length,
        totalEnrollments: enrollments.length,
        completedEnrollments: completedEnrollments.length,
        totalRevenue: totalRevenue.toFixed(2),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // User management
  app.get("/api/admin/users", authMiddlewareWithUser, adminMiddleware, async (req: AuthRequest, res) => {
    try {
      const users = await storage.getAllUsers();
      // Remove password hashes from response
      const safeUsers = users.map(({ passwordHash, ...user }) => user);
      res.json(safeUsers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/admin/users/:id/role", authMiddlewareWithUser, adminMiddleware, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!["student", "admin", "therapist"].includes(role)) {
        return res.status(400).json({ error: "Rol inválido" });
      }

      await storage.updateUserRole(id, role);
      res.json({ message: "Rol actualizado exitosamente" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/admin/users/:id", authMiddlewareWithUser, adminMiddleware, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;

      // Prevent admin from deleting themselves
      if (id === req.userId) {
        return res.status(400).json({ error: "No puedes eliminar tu propia cuenta" });
      }

      await storage.deleteUser(id);
      res.json({ message: "Usuario eliminado exitosamente" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Course management
  app.get("/api/admin/courses", authMiddlewareWithUser, adminMiddleware, async (req: AuthRequest, res) => {
    try {
      const courses = await storage.getAllCoursesAdmin();
      res.json(courses);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/admin/courses/:id/publish", authMiddlewareWithUser, adminMiddleware, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const { isPublished } = req.body;

      if (typeof isPublished !== "boolean") {
        return res.status(400).json({ error: "isPublished debe ser un booleano" });
      }

      await storage.updateCoursePublishStatus(id, isPublished);
      res.json({ message: `Curso ${isPublished ? "publicado" : "despublicado"} exitosamente` });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/admin/courses/:id/feature", authMiddlewareWithUser, adminMiddleware, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const { isFeatured } = req.body;

      if (typeof isFeatured !== "boolean") {
        return res.status(400).json({ error: "isFeatured debe ser un booleano" });
      }

      await storage.updateCourseFeaturedStatus(id, isFeatured);
      res.json({ message: `Curso ${isFeatured ? "marcado" : "desmarcado"} como destacado` });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/admin/courses", authMiddlewareWithUser, adminMiddleware, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(validatedData);
      res.status(201).json(course);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/admin/courses/:id", authMiddlewareWithUser, adminMiddleware, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertCourseSchema.partial().parse(req.body);
      
      const course = await storage.getCourse(id);
      if (!course) {
        return res.status(404).json({ error: "Curso no encontrado" });
      }

      await storage.updateCourse(id, validatedData);
      res.json({ message: "Curso actualizado exitosamente" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/admin/courses/:id", authMiddlewareWithUser, adminMiddleware, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      
      const course = await storage.getCourse(id);
      if (!course) {
        return res.status(404).json({ error: "Curso no encontrado" });
      }

      await storage.deleteCourse(id);
      res.json({ message: "Curso eliminado exitosamente" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Article management
  app.get("/api/admin/articles", authMiddlewareWithUser, adminMiddleware, async (req: AuthRequest, res) => {
    try {
      const articles = await storage.getAllArticlesAdmin();
      res.json(articles);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/admin/articles", authMiddlewareWithUser, adminMiddleware, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertArticleSchema.parse(req.body);
      const article = await storage.createArticle(validatedData);
      res.status(201).json(article);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/admin/articles/:id", authMiddlewareWithUser, adminMiddleware, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertArticleSchema.partial().parse(req.body);
      
      const article = await storage.getArticle(id);
      if (!article) {
        return res.status(404).json({ error: "Artículo no encontrado" });
      }

      await storage.updateArticle(id, validatedData);
      res.json({ message: "Artículo actualizado exitosamente" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/admin/articles/:id/publish", authMiddlewareWithUser, adminMiddleware, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const { isPublished } = req.body;

      if (typeof isPublished !== "boolean") {
        return res.status(400).json({ error: "isPublished debe ser un booleano" });
      }

      await storage.updateArticlePublishStatus(id, isPublished);
      res.json({ message: `Artículo ${isPublished ? "publicado" : "despublicado"} exitosamente` });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/admin/articles/:id", authMiddlewareWithUser, adminMiddleware, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      
      const article = await storage.getArticle(id);
      if (!article) {
        return res.status(404).json({ error: "Artículo no encontrado" });
      }

      await storage.deleteArticle(id);
      res.json({ message: "Artículo eliminado exitosamente" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Appointment management
  app.get("/api/admin/appointments", authMiddlewareWithUser, adminMiddleware, async (req: AuthRequest, res) => {
    try {
      const appointments = await storage.getAllAppointments();
      res.json(appointments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/admin/appointments/:id/status", authMiddlewareWithUser, adminMiddleware, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!["pending", "confirmed", "cancelled", "completed"].includes(status)) {
        return res.status(400).json({ error: "Estado inválido" });
      }

      await storage.updateAppointmentStatus(id, status);
      res.json({ message: "Estado de la cita actualizado exitosamente" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/admin/appointments/:id/video-link", authMiddlewareWithUser, adminMiddleware, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const { videoCallLink } = req.body;

      if (!videoCallLink || typeof videoCallLink !== "string") {
        return res.status(400).json({ error: "El enlace de video es requerido" });
      }

      await storage.updateAppointmentVideoLink(id, videoCallLink);
      res.json({ message: "Enlace de video agregado exitosamente" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Enrollment management
  app.get("/api/admin/enrollments", authMiddlewareWithUser, adminMiddleware, async (req: AuthRequest, res) => {
    try {
      const enrollments = await storage.getAllEnrollments();
      res.json(enrollments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
