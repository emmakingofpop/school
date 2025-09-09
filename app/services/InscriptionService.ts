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

// Définition du type Inscription
export type Inscription = {
  idStudent: string;      // ID de l'étudiant
  classId: string;        // ID de la classe
  anneeScolaireId: string; // ID de l'année scolaire
  ecoleId: string;       // ID de l'école
  status: 'active' | 'inactive' | 'graduated'; // Statut de l'inscription
};

const COLLECTION_NAME = 'inscriptions';

export const InscriptionService = {
  // ➕ Ajouter une inscription
  add: async (data: Inscription): Promise<string | null> => {
    try {
      // Vérifier si l’inscription existe déjà
      const q = query(
        collection(db, COLLECTION_NAME),
        where("idStudent", "==", data.idStudent),
        where("classId", "==", data.classId),
        where("anneeScolaireId", "==", data.anneeScolaireId),
        where("ecoleId", "==", data.ecoleId)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        
        return null; // ou querySnapshot.docs[0].id si tu veux renvoyer l’ID existant
      }

      // Ajouter si pas de duplication
      const docRef = await addDoc(collection(db, COLLECTION_NAME), data);
      return docRef.id;
    } catch (error) {
      console.error("Erreur lors de l’ajout de l’inscription :", error);
      return null;
    }
  },

  // 🔍 Récupérer une inscription par ID
  getById: async (id: string): Promise<Inscription | null> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as Inscription;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l’inscription :', error);
      return null;
    }
  },

  getAllStudent: async (data: { 
  classId: string; 
  anneeScolaireId: string; 
  ecoleId: string; 
}): Promise<(Inscription & { id: string })[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("classId", "==", data.classId),
      where("anneeScolaireId", "==", data.anneeScolaireId),
      where("ecoleId", "==", data.ecoleId)
    );

    const querySnapshot = await getDocs(q);
    const inscriptions: (Inscription & { id: string })[] = [];

    querySnapshot.forEach((docSnap) => {
      inscriptions.push({ ...(docSnap.data() as Inscription), id: docSnap.id });
    });

    return inscriptions;
  } catch (error) {
    console.error("Erreur lors de la récupération des inscriptions :", error);
    return [];
  }
},


  // 📋 Récupérer toutes les inscriptions
  getAll: async (): Promise<(Inscription & { id: string })[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      const inscriptions: (Inscription & { id: string })[] = [];
      querySnapshot.forEach((docSnap) => {
        inscriptions.push({ ...(docSnap.data() as Inscription), id: docSnap.id });
      });
      return inscriptions;
    } catch (error) {
      console.error('Erreur lors de la récupération des inscriptions :', error);
      return [];
    }
  },

  // 📋 Récupérer toutes les inscriptions d'un étudiant
  getAllByStudent: async (idStudent: string): Promise<(Inscription & { id: string })[]> => {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('idStudent', '==', idStudent)
      );
      const querySnapshot = await getDocs(q);
      const inscriptions: (Inscription & { id: string })[] = [];
      querySnapshot.forEach((docSnap) => {
        inscriptions.push({ ...(docSnap.data() as Inscription), id: docSnap.id });
      });
      return inscriptions;
    } catch (error) {
      console.error('Erreur lors de la récupération des inscriptions de l’étudiant :', error);
      return [];
    }
  },

  // ✏️ Mettre à jour une inscription
  update: async (id: string, data: Partial<Inscription>): Promise<boolean> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, data);
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l’inscription :', error);
      return false;
    }
  },

  // 🗑️ Supprimer une inscription
  delete: async (id: string): Promise<boolean> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de l’inscription :', error);
      return false;
    }
  },
};
