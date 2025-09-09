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

// Définition du type AnneeScolaire
export type AnneeScolaire = {
  annee: string;        // Année scolaire (ex: "2024-2025")
  id_admin: string;   // Référence de l’admin
};

const COLLECTION_NAME = 'annees_scolaires';

export const AnneeScolaireService = {
  // ➕ Ajouter une année scolaire
  add: async (data: AnneeScolaire): Promise<string | null> => {
    try {
      // Vérifier si l’année existe déjà
      const q = query(
        collection(db, COLLECTION_NAME),
        where("annee", "==", data.annee)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        console.warn("⚠️ Cette année scolaire existe déjà.");
        return null; // ou querySnapshot.docs[0].id si tu veux renvoyer l’existant
      }

      // Ajouter si pas de duplication
      const docRef = await addDoc(collection(db, COLLECTION_NAME), data);
      return docRef.id;
    } catch (error) {
      console.error("Erreur lors de l’ajout de l’année scolaire :", error);
      return null;
    }
  },

  // 🔍 Récupérer une année scolaire par ID
  getById: async (id: string): Promise<AnneeScolaire | null> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as AnneeScolaire;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l’année scolaire :', error);
      return null;
    }
  },

  
    // 📋 Récupérer toutes les AnneeScolaire d’un admin
    getAllByAdmin: async (
      id_admin: string
    ): Promise<(AnneeScolaire & { id: string })[]> => {
      try {
        const q = query(
          collection(db, COLLECTION_NAME),
          where('id_admin', '==', id_admin)
        );
  
        const querySnapshot = await getDocs(q);
        const anneeScolaire: (AnneeScolaire & { id: string })[] = [];
  
        querySnapshot.forEach((docSnap) => {
          anneeScolaire.push({ ...(docSnap.data() as AnneeScolaire), id: docSnap.id });
        });
  
        return anneeScolaire;
      } catch (error) {
       
        return [];
      }
    },

  // 📋 Récupérer toutes les années scolaires
  getAll: async (): Promise<(AnneeScolaire & { id: string })[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      const annees: (AnneeScolaire & { id: string })[] = [];
      querySnapshot.forEach((docSnap) => {
        annees.push({ ...(docSnap.data() as AnneeScolaire), id: docSnap.id });
      });
      return annees;
    } catch (error) {
      console.error('Erreur lors de la récupération des années scolaires :', error);
      return [];
    }
  },

  // ✏️ Mettre à jour une année scolaire
  update: async (id: string, data: Partial<AnneeScolaire>): Promise<boolean> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, data);
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l’année scolaire :', error);
      return false;
    }
  },

  // 🗑️ Supprimer une année scolaire
  delete: async (id: string): Promise<boolean> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de l’année scolaire :', error);
      return false;
    }
  },
};
