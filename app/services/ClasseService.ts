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

// Définition du type Classe
export type Classe = {
  nom: string;            // Nom de la classe (ex: "Terminale A")
  niveau: string;         // Niveau scolaire (ex: "Terminale", "1ère", etc.)
  anneeScolaire: string;  // Année scolaire (ex: "2024-2025")
  id_ecole: string;       // Référence de l'école
  id_admin: string;       // Référence de l’admin
};

const COLLECTION_NAME = 'classes';

export const ClasseService = {
  // ➕ Ajouter une classe
  add: async (data: Classe): Promise<string | null> => {
    try {
      // Vérifier si une classe avec le même nom et niveau existe déjà
      const q = query(
        collection(db, COLLECTION_NAME),
        where("nom", "==", data.nom),
        where("niveau", "==", data.niveau)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        return querySnapshot?.docs[0]?.id || null; // ou retourner l'id existant si besoin
      }

      // Ajouter si pas de duplication
      const docRef = await addDoc(collection(db, COLLECTION_NAME), data);
      return docRef.id;
    } catch (error) {
      console.error("Erreur lors de l’ajout de la classe :", error);
      return null;
    }
  },

  // 🔍 Récupérer une classe par son ID
  getById: async (id: string): Promise<Classe | null> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as Classe;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la classe :', error);
      return null;
    }
  },

  // 📋 Récupérer toutes les classes
  getAll: async (): Promise<Classe[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      const classes: Classe[] = [];
      querySnapshot.forEach((doc) => {
        classes.push(doc.data() as Classe);
      });
      return classes;
    } catch (error) {
      console.error('Erreur lors de la récupération des classes :', error);
      return [];
    }
  },

  // 📋 Récupérer toutes les classes d’un admin
  getAllByAdmin: async (
    id_admin: string
  ): Promise<(Classe & { id: string })[]> => {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('id_admin', '==', id_admin)
      );

      const querySnapshot = await getDocs(q);
      const classes: (Classe & { id: string })[] = [];

      querySnapshot.forEach((docSnap) => {
        classes.push({ ...(docSnap.data() as Classe), id: docSnap.id });
      });

      return classes;
    } catch (error) {
     
      return [];
    }
  },

  // ✏️ Mettre à jour une classe
  update: async (id: string, data: Partial<Classe>): Promise<boolean> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, data);
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la classe :', error);
      return false;
    }
  },

  // 🗑️ Supprimer une classe
  delete: async (id: string): Promise<boolean> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de la classe :', error);
      return false;
    }
  },
};
