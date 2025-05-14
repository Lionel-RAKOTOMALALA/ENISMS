import { Student, Message } from '../database/db';

declare global {
  type Student = Student;
  type Message = Message;
}

export {};