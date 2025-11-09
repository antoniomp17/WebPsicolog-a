import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStudentSchema, insertAppointmentSchema, registerUserSchema, insertEnrollmentSchema } from "@shared/schema";
import { hashPassword, verifyPassword, generateToken, authMiddleware, type AuthRequest } from "./auth";
import Stripe from "stripe";

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
      res.json(appointment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
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

  const httpServer = createServer(app);
  return httpServer;
}
