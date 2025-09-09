import { db } from "../../lib/firebase";
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
} from "firebase/firestore";

export type Note = {
  profId: string;
  studentId: string;
  classeId: string;
  anneeScolaireId: string;
  courId: string;
  cote: number;
  isWithExam: boolean;
  periode: string;
};

const NOTES_COLLECTION = "notes";

export const NoteService = {
  async add(note: Note): Promise<string | null> {
    try {
      // Vérifier si une note identique existe déjà
      const q = query(
        collection(db, NOTES_COLLECTION),
        where("profId", "==", note.profId),
        where("studentId", "==", note.studentId),
        where("classeId", "==", note.classeId),
        where("anneeScolaireId", "==", note.anneeScolaireId),
        where("courId", "==", note.courId),
        where("periode", "==", note.periode)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        
        return null; // ou querySnapshot.docs[0].id si tu veux renvoyer l’ID existant
      }

      // Ajouter si pas de duplication
      const docRef = await addDoc(collection(db, NOTES_COLLECTION), note);
      return docRef.id;
    } catch (err) {
      console.error("Erreur lors de l'ajout:", err);
      return null;
    }
  },

  async update(id: string, note: Note): Promise<boolean> {
    try {
      await updateDoc(doc(db, NOTES_COLLECTION, id), note);
      return true;
    } catch (err) {
      console.error("Erreur lors de la mise à jour:", err);
      return false;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, NOTES_COLLECTION, id));
      return true;
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      return false;
    }
  },

  async getById(id: string): Promise<(Note & { id: string }) | null> {
    try {
      const snap = await getDoc(doc(db, NOTES_COLLECTION, id));
      if (!snap.exists()) return null;
      return { id: snap.id, ...(snap.data() as Note) };
    } catch (err) {
      console.error("Erreur getById:", err);
      return null;
    }
  },

  async getAll(): Promise<(Note & { id: string })[]> {
    try {
      const snap = await getDocs(collection(db, NOTES_COLLECTION));
      return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Note) }));
    } catch (err) {
      console.error("Erreur getAll:", err);
      return [];
    }
  },

  async getByClasse(classeId: string): Promise<(Note & { id: string })[]> {
    try {
      const q = query(
        collection(db, NOTES_COLLECTION),
        where("classeId", "==", classeId)
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Note) }));
    } catch (err) {
      console.error("Erreur getByClasse:", err);
      return [];
    }
  },
  async getNoteByProfId(profId: string): Promise<(Note & { id: string })[]> {
    try {
      const q = query(
        collection(db, NOTES_COLLECTION),
        where("profId", "==", profId)
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Note) }));
    } catch (err) {
      console.error("Erreur get node by profId:", err);
      return [];
    }
  },
  async getNoteByStudent(
  studentId: string,
  classeId: string,
  anneeScolaireId: string,
  courId: string,
  periode: string
): Promise<(Note & { id: string })[]> {
  try {
    const q = query(
      collection(db, NOTES_COLLECTION),
      where("studentId", "==", studentId),
      where("classeId", "==", classeId),
      where("anneeScolaireId", "==", anneeScolaireId),
      where("courId", "==", courId),
      where("periode", "==", periode)
    );

    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Note) }));
  } catch (err) {
    console.error("Erreur get note by student:", err);
    return [];
  }
},

};
