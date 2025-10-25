import {
  type Student,
  type InsertStudent,
  type Appointment,
  type InsertAppointment,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
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
}

export class MemStorage implements IStorage {
  private students: Map<string, Student>;
  private appointments: Map<string, Appointment>;

  constructor() {
    this.students = new Map();
    this.appointments = new Map();
  }

  // Students
  async getStudent(id: string): Promise<Student | undefined> {
    return this.students.get(id);
  }

  async getStudentByEmail(email: string): Promise<Student | undefined> {
    return Array.from(this.students.values()).find(
      (student) => student.email === email
    );
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const id = randomUUID();
    const student: Student = {
      ...insertStudent,
      id,
      createdAt: new Date(),
    };
    this.students.set(id, student);
    return student;
  }

  async getAllStudents(): Promise<Student[]> {
    return Array.from(this.students.values());
  }

  // Appointments
  async getAppointment(id: string): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      (appointment) => appointment.date === date
    );
  }

  async getAllAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values());
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = randomUUID();
    const appointment: Appointment = {
      ...insertAppointment,
      id,
      createdAt: new Date(),
    };
    this.appointments.set(id, appointment);
    return appointment;
  }
}

export const storage = new MemStorage();
