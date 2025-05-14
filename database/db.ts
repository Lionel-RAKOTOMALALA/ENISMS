import { openDatabaseSync } from 'expo-sqlite';

// Ouvre la base de données en mode synchrone
const db = openDatabaseSync('students.db');

// --- TYPES ---
export interface Student {
  id: number;
  name: string;
  phone: string;
  level: string;
  created_at?: string;
}

export interface Message {
  id: number;
  content: string;
  recipient_count: number;
  sent_at: string;
}

// --- INITIALISATION DE LA BASE ---
export async function initDB(): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      level TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      recipient_count INTEGER NOT NULL,
      sent_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('✅ Tables créées avec succès');
}

// === CRUD ÉTUDIANTS ===

// Insère un étudiant
export async function insertStudent(name: string, phone: string, level: string): Promise<void> {
  await db.runAsync(
    `INSERT INTO students (name, phone, level) VALUES (?, ?, ?);`,
    [name, phone, level]
  );
}

// Récupère tous les étudiants
export async function fetchStudents(): Promise<Student[]> {
  const result = await db.getAllAsync(`SELECT * FROM students ORDER BY name;`);
  return result as Student[];
}

// Récupère les étudiants par niveau
export async function fetchStudentsByLevel(level: string): Promise<Student[]> {
  const result = await db.getAllAsync(`SELECT * FROM students WHERE level = ? ORDER BY name;`, [level]);
  return result as Student[];
}

// Supprime un étudiant par ID
export async function deleteStudent(id: number): Promise<void> {
  await db.runAsync(`DELETE FROM students WHERE id = ?;`, [id]);
}

// Met à jour un étudiant
export async function updateStudent(id: number, name: string, phone: string, level: string): Promise<void> {
  await db.runAsync(
    `UPDATE students SET name = ?, phone = ?, level = ? WHERE id = ?;`,
    [name, phone, level, id]
  );
}

// Récupère tous les niveaux
export async function fetchLevels(): Promise<string[]> {
  const result = await db.getAllAsync(`SELECT DISTINCT level FROM students ORDER BY level;`);
  return (result as { level: string }[]).map((row) => row.level);
}

// === GESTION DES MESSAGES ===

// Sauvegarde un message
export async function saveMessage(content: string, recipientCount: number): Promise<void> {
  await db.runAsync(
    `INSERT INTO messages (content, recipient_count) VALUES (?, ?);`,
    [content, recipientCount]
  );
}

// Récupère tous les messages
export async function fetchMessages(): Promise<Message[]> {
  const result = await db.getAllAsync(`SELECT * FROM messages ORDER BY sent_at DESC;`);
  return result as Message[];
}