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

export type ClassesProf = {
  profId: string;
  classeId: string[]; // Multi-sélection
};

type ClassesProfWithId = ClassesProf & { id: string };

const COLLECTION_NAME = 'classesProf';

export const ClassesProfService = {
  // ➕ Ajouter une assignation
  add: async (data: ClassesProf): Promise<string | null> => {
    try {
      // Vérifier si le profId existe déjà
      const q = query(
        collection(db, COLLECTION_NAME),
        where("profId", "==", data.profId),
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
       
        return null; // ou retourner l'id existant si besoin
      }

      // Ajouter si pas de duplication
      const docRef = await addDoc(collection(db, COLLECTION_NAME), data);
      return docRef.id;
    } catch (error) {
      console.error("Erreur lors de l’ajout de l’assignation :", error);
      return null;
    }
  },

  // 🔍 Récupérer par ID
  getById: async (id: string): Promise<ClassesProfWithId | null> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
     
      if (docSnap.exists()) return { ...docSnap.data() , id: docSnap.id } as ClassesProfWithId;
      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération :', error);
      return null;
    }
  },

  getByProfId: async (profId: string): Promise<ClassesProfWithId | null> => {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("profId", "==", profId),
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        return { ...(docSnap.data() as ClassesProf), id: docSnap.id };
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération :', error);
      return null;
    }
  },

  // 📋 Récupérer tout
  getAll: async (): Promise<(ClassesProf & { id: string })[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      const data: (ClassesProf & { id: string })[] = [];
      querySnapshot.forEach((docSnap) => {
        data.push({ ...(docSnap.data() as ClassesProf), id: docSnap.id });
      });
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération :', error);
      return [];
    }
  },

  // ✏️ Mettre à jour
  update: async (id: string, data: Partial<ClassesProf>): Promise<boolean> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, data);
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour :', error);
      return false;
    }
  },

  // 🗑️ Supprimer
  delete: async (id: string): Promise<boolean> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
      return false;
    }
  },
};
