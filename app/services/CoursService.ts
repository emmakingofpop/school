// services/CoursService.ts
import { get } from 'http';
import { db } from '../../lib/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  doc,
  query,
  where,
} from 'firebase/firestore';

export type Cours = {
  profId: string;
  Nomcour: string;
  ponderation: number;
  isWithExam: boolean;
};

const COLLECTION_NAME = 'cours';

export const CoursService = {
  // ➕ Ajouter un cours
  add: async (data: Cours): Promise<string | null> => {
    try {
      // Vérifier si un cours identique existe déjà
      const q = query(
        collection(db, COLLECTION_NAME),
        where("profId", "==", data.profId),
        where("Nomcour", "==", data.Nomcour),
        where("ponderation", "==", data.ponderation)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        
        return null; // ou querySnapshot.docs[0].id si tu veux renvoyer l'existant
      }

      // Ajouter si pas de duplication
      const docRef = await addDoc(collection(db, COLLECTION_NAME), data);
      return docRef.id;
    } catch (error) {
      console.error("Erreur lors de l’ajout du cours :", error);
      return null;
    }
  },

  // 🔍 Récupérer un cours par ID
  getById: async (id: string): Promise<Cours | null> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? (docSnap.data() as Cours) : null;
    } catch (error) {
      console.error("Erreur lors de la récupération du cours :", error);
      return null;
    }
  },
  getCourByProfId: async (profId: string): Promise<(Cours & {id:string})[]> => {
      try {
        const q = query(
          collection(db, COLLECTION_NAME),
          where("profId", "==", profId),
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const cours: (Cours & { id: string })[] = [];
          querySnapshot.forEach((docSnap) => {
            cours.push({ ...(docSnap.data() as Cours), id: docSnap.id });
          });
          return cours;
        }
        return [];
      } catch (error) {
        console.error('Erreur lors de la récupération :', error);
        return [];
      }
    },   

  // 📋 Récupérer tous les cours
  getAll: async (): Promise<(Cours & { id: string })[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      const cours: (Cours & { id: string })[] = [];
      querySnapshot.forEach((docSnap) => {
        cours.push({ ...(docSnap.data() as Cours), id: docSnap.id });
      });
      return cours;
    } catch (error) {
      console.error("Erreur lors de la récupération des cours :", error);
      return [];
    }
  },

  // ✏️ Mettre à jour un cours
  update: async (id: string, data: Partial<Cours>): Promise<boolean> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, data);
      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du cours :", error);
      return false;
    }
  },

  // 🗑️ Supprimer un cours
  delete: async (id: string): Promise<boolean> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression du cours :", error);
      return false;
    }
  },
};
