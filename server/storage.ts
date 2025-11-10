import { db } from "./db";
import {
  type Student,
  type InsertStudent,
  type Appointment,
  type InsertAppointment,
  type Course,
  type InsertCourse,
  type Article,
  type InsertArticle,
  type User,
  type InsertUser,
  type Enrollment,
  type InsertEnrollment,
  students,
  appointments,
  courses,
  articles,
  users,
  enrollments,
} from "@shared/schema";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUserRole(userId: string, role: "student" | "admin" | "therapist"): Promise<void>;
  deleteUser(userId: string): Promise<void>;

  // Students
  getStudent(id: string): Promise<Student | undefined>;
  getStudentByEmail(email: string): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  getAllStudents(): Promise<Student[]>;

  // Appointments
  getAppointment(id: string): Promise<Appointment | undefined>;
  getAppointmentsByDate(date: string): Promise<Appointment[]>;
  getAllAppointments(): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointmentStatus(appointmentId: string, status: "pending" | "confirmed" | "cancelled" | "completed"): Promise<void>;
  updateAppointmentVideoLink(appointmentId: string, videoCallLink: string): Promise<void>;

  // Courses
  getAllCourses(): Promise<Course[]>;
  getAllCoursesAdmin(): Promise<Course[]>;
  getCourse(id: string): Promise<Course | undefined>;
  getCourseBySlug(slug: string): Promise<Course | undefined>;
  getFeaturedCourses(): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(courseId: string, course: Partial<InsertCourse>): Promise<void>;
  updateCoursePublishStatus(courseId: string, isPublished: boolean): Promise<void>;
  updateCourseFeaturedStatus(courseId: string, isFeatured: boolean): Promise<void>;
  deleteCourse(courseId: string): Promise<void>;

  // Articles
  getAllArticles(): Promise<Article[]>;
  getAllArticlesAdmin(): Promise<Article[]>;
  getArticle(id: string): Promise<Article | undefined>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(articleId: string, article: Partial<InsertArticle>): Promise<void>;
  updateArticlePublishStatus(articleId: string, isPublished: boolean): Promise<void>;
  deleteArticle(articleId: string): Promise<void>;

  // Enrollments
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  getUserEnrollments(userId: string): Promise<Enrollment[]>;
  getAllEnrollments(): Promise<Enrollment[]>;
  getEnrollmentByCourseAndUser(userId: string, courseId: string): Promise<Enrollment | undefined>;
  getEnrollmentById(id: string): Promise<Enrollment | undefined>;
  updateEnrollmentPaymentStatus(enrollmentId: string, paymentStatus: "pending" | "completed" | "refunded", stripePaymentId?: string): Promise<void>;
}

export class DbStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async updateUserRole(userId: string, role: "student" | "admin" | "therapist"): Promise<void> {
    await db.update(users).set({ role }).where(eq(users.id, userId));
  }

  async deleteUser(userId: string): Promise<void> {
    await db.delete(users).where(eq(users.id, userId));
  }

  // Students
  async getStudent(id: string): Promise<Student | undefined> {
    const result = await db.select().from(students).where(eq(students.id, id)).limit(1);
    return result[0];
  }

  async getStudentByEmail(email: string): Promise<Student | undefined> {
    const result = await db.select().from(students).where(eq(students.email, email)).limit(1);
    return result[0];
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const result = await db.insert(students).values(insertStudent).returning();
    return result[0];
  }

  async getAllStudents(): Promise<Student[]> {
    return await db.select().from(students);
  }

  // Appointments
  async getAppointment(id: string): Promise<Appointment | undefined> {
    const result = await db.select().from(appointments).where(eq(appointments.id, id)).limit(1);
    return result[0];
  }

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    return await db.select().from(appointments).where(eq(appointments.date, date));
  }

  async getAllAppointments(): Promise<Appointment[]> {
    return await db.select().from(appointments);
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const result = await db.insert(appointments).values(insertAppointment).returning();
    return result[0];
  }

  async updateAppointmentStatus(appointmentId: string, status: "pending" | "confirmed" | "cancelled" | "completed"): Promise<void> {
    await db.update(appointments).set({ status }).where(eq(appointments.id, appointmentId));
  }

  async updateAppointmentVideoLink(appointmentId: string, videoCallLink: string): Promise<void> {
    await db.update(appointments).set({ videoCallLink }).where(eq(appointments.id, appointmentId));
  }

  // Courses
  async getAllCourses(): Promise<Course[]> {
    return await db.select().from(courses).where(eq(courses.isPublished, true));
  }

  async getAllCoursesAdmin(): Promise<Course[]> {
    return await db.select().from(courses);
  }

  async getCourse(id: string): Promise<Course | undefined> {
    const result = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
    return result[0];
  }

  async getCourseBySlug(slug: string): Promise<Course | undefined> {
    const result = await db.select().from(courses).where(eq(courses.slug, slug)).limit(1);
    return result[0];
  }

  async getFeaturedCourses(): Promise<Course[]> {
    return await db.select().from(courses).where(
      and(eq(courses.isPublished, true), eq(courses.isFeatured, true))
    );
  }

  async updateCoursePublishStatus(courseId: string, isPublished: boolean): Promise<void> {
    await db.update(courses).set({ isPublished }).where(eq(courses.id, courseId));
  }

  async updateCourseFeaturedStatus(courseId: string, isFeatured: boolean): Promise<void> {
    await db.update(courses).set({ isFeatured }).where(eq(courses.id, courseId));
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const result = await db.insert(courses).values(insertCourse).returning();
    return result[0];
  }

  async updateCourse(courseId: string, course: Partial<InsertCourse>): Promise<void> {
    await db.update(courses).set({ ...course, updatedAt: new Date() }).where(eq(courses.id, courseId));
  }

  async deleteCourse(courseId: string): Promise<void> {
    await db.delete(courses).where(eq(courses.id, courseId));
  }

  // Articles
  async getAllArticles(): Promise<Article[]> {
    return await db.select().from(articles).where(eq(articles.isPublished, true));
  }

  async getAllArticlesAdmin(): Promise<Article[]> {
    return await db.select().from(articles);
  }

  async getArticle(id: string): Promise<Article | undefined> {
    const result = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
    return result[0];
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    const result = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
    return result[0];
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const result = await db.insert(articles).values(insertArticle).returning();
    return result[0];
  }

  async updateArticle(articleId: string, article: Partial<InsertArticle>): Promise<void> {
    await db.update(articles).set({ ...article, updatedAt: new Date() }).where(eq(articles.id, articleId));
  }

  async updateArticlePublishStatus(articleId: string, isPublished: boolean): Promise<void> {
    await db.update(articles).set({ isPublished }).where(eq(articles.id, articleId));
  }

  async deleteArticle(articleId: string): Promise<void> {
    await db.delete(articles).where(eq(articles.id, articleId));
  }

  // Enrollments
  async createEnrollment(insertEnrollment: InsertEnrollment): Promise<Enrollment> {
    const result = await db.insert(enrollments).values(insertEnrollment).returning();
    return result[0];
  }

  async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    return await db.select().from(enrollments).where(eq(enrollments.userId, userId));
  }

  async getAllEnrollments(): Promise<Enrollment[]> {
    return await db.select().from(enrollments);
  }

  async getEnrollmentByCourseAndUser(userId: string, courseId: string): Promise<Enrollment | undefined> {
    const result = await db.select().from(enrollments).where(
      and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId))
    ).limit(1);
    return result[0];
  }

  async getEnrollmentById(id: string): Promise<Enrollment | undefined> {
    const result = await db.select().from(enrollments).where(eq(enrollments.id, id)).limit(1);
    return result[0];
  }

  async updateEnrollmentPaymentStatus(
    enrollmentId: string, 
    paymentStatus: "pending" | "completed" | "refunded",
    stripePaymentId?: string
  ): Promise<void> {
    await db.update(enrollments)
      .set({ 
        paymentStatus,
        stripePaymentId: stripePaymentId || null,
      })
      .where(eq(enrollments.id, enrollmentId));
  }
}

export const storage = new DbStorage();
