import { create } from "zustand";
import {
  insertStudent,
  fetchStudents,
  deleteStudent,
  updateStudent,
  type Student,
} from "@/database/db";

interface StudentStoreState {
  students: Student[]; // Liste des étudiants
  shouldRefresh: boolean; // Indicateur de rafraîchissement
  loadStudents: () => Promise<void>; // Charger tous les étudiants
  addStudent: (name: string, phone: string, level: string) => Promise<void>; // Ajouter un étudiant
  removeStudent: (id: number) => Promise<void>; // Supprimer un étudiant
  editStudent: (
    id: number,
    name: string,
    phone: string,
    level: string
  ) => Promise<void>; // Modifier un étudiant
  resetRefreshFlag: () => void; // Réinitialiser le flag de rafraîchissement
}

export const useStudentStore = create<StudentStoreState>((set, get) => ({
  students: [],
  shouldRefresh: false,

  // Charger tous les étudiants
  loadStudents: async () => {
    try {
      const students = await fetchStudents();
      set({ students });
    } catch (error) {
      console.error("Erreur lors du chargement des étudiants :", error);
    }
  },

  // Ajouter un étudiant
  addStudent: async (name, phone, level) => {
    try {
      await insertStudent(name, phone, level);
      set({ shouldRefresh: true }); // Déclenche un rafraîchissement
      await get().loadStudents(); // Recharge les étudiants
    } catch (error) {
      console.error("Erreur lors de l'ajout d'un étudiant :", error);
    }
  },

  // Supprimer un étudiant
  removeStudent: async (id) => {
    try {
      await deleteStudent(id);
      set({ shouldRefresh: true }); // Déclenche un rafraîchissement
      await get().loadStudents(); // Recharge les étudiants
    } catch (error) {
      console.error("Erreur lors de la suppression d'un étudiant :", error);
    }
  },

  // Modifier un étudiant
  editStudent: async (id, name, phone, level) => {
    try {
      await updateStudent(id, name, phone, level);
      set({ shouldRefresh: true }); // Déclenche un rafraîchissement
      await get().loadStudents(); // Recharge les étudiants
    } catch (error) {
      console.error("Erreur lors de la modification d'un étudiant :", error);
    }
  },

  // Réinitialiser le flag de rafraîchissement
  resetRefreshFlag: () => set({ shouldRefresh: false }),
}));