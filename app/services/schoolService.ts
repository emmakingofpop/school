import { db} from '../../lib/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  doc,
  query,
  where
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export type School = {
  name: string;
  address: string;
  phone: string;
  email: string;
  principal: string;
  url_logo: string;
  academicYear: string[];
  id_admin: string
};

const COLLECTION_NAME = 'schools';

export const SchoolService = {
  add: async (data: School): Promise<string | null> => {
    try {
      // Vérifier si une école avec le même nom existe déjà
      const q = query(
        collection(db, COLLECTION_NAME),
        where("name", "==", data.name)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        
        return null; // ou querySnapshot.docs[0].id si tu veux renvoyer l’ID existant
      }

      // Ajouter si pas de duplication
      const docRef = await addDoc(collection(db, COLLECTION_NAME), data);
      return docRef.id;
    } catch (error) {
      console.error("Error adding school:", error);
      return null;
    }
  },

  getById: async (id: string): Promise<School | null> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as School;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting school:', error);
      return null;
    }
  },

  getAll: async (): Promise<(School & {id:string})[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      const schools: (School & {id:string})[] = [];
      querySnapshot.forEach((doc) => {
        schools.push({...doc.data() as School,id: doc.id});
      });
      console.log(schools)
      return schools;
    } catch (error) {
      console.error('Error getting schools:', error);
      return [];
    }
  },

  // In SchoolService


getAllDocs: async (id_admin: string): Promise<(School & { id: string })[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('id_admin', '==', id_admin)
    );

    const querySnapshot = await getDocs(q);
    const schools: (School & { id: string })[] = [];

    querySnapshot.forEach((docSnap) => {
      schools.push({ ...(docSnap.data() as School), id: docSnap.id });
    });

    return schools;
  } catch (error) {
    console.error('Error getting schools:', error);
    return [];
  }
},


  update: async (id: string, data: Partial<School>): Promise<boolean> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, data);
      return true;
    } catch (error) {
      console.error('Error updating school:', error);
      return false;
    }
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Error deleting school:', error);
      return false;
    }
  },

 
};
