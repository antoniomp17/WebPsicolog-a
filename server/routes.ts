import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStudentSchema, insertAppointmentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
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
