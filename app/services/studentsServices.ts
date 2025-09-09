// lib/etudiant.ts
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, deleteDoc,collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";

const COLLECTION_NAME = "students";

// Interface pour représenter un étudiant
export interface Etudiant {
  matricule: string;       // Numéro d'inscription unique
  nomComplet: string;
  email: string;
  motDePasse: string;
  dateNaissance: string;   // Format AAAA-MM-JJ
  genre: "Masculin" | "Féminin" | "Autre";
  adresse: string;
  telephone: string;       // Téléphone étudiant
  tuteurNom: string;       // Nom du parent/tuteur
  tuteurTel: string;       // Téléphone du tuteur
  classeId: string;        // Référence à la classe
  ecoleId: string;         // Référence à l’école
  dateAdmission: string;   // Date d’admission (AAAA-MM-JJ)
  statut: "actif" | "inactif" | "diplômé" | "suspendu";
}

// ➕ Inscription d’un étudiant

export async function inscrireEtudiant(etudiant: Etudiant) {
  try {
    // Vérifier si un étudiant avec le même nomComplet et classeId existe déjà
    const q = query(
      collection(db, "students"),
      where("nomComplet", "==", etudiant.nomComplet),
      where("classeId", "==", etudiant.classeId)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
     
      return null; // ou retourner querySnapshot.docs[0].id si besoin
    }

    // Création du compte utilisateur (Firebase Auth)
    const userCredential = await createUserWithEmailAndPassword(auth, etudiant.email, etudiant.motDePasse);
    const user = userCredential.user;

    // Sauvegarde des infos dans Firestore
    await setDoc(doc(db, "students", user.uid), {
      uid: user.uid,
      ...etudiant,
      creeLe: new Date().toISOString(),
    });

    return { ...user, uid: user.uid };
  } catch (error) {
    console.error("Erreur lors de l'inscription de l'étudiant :", error);
    return null;
  }
}

export async function deconnecterEtudiant() {
  try {
    await signOut(auth);
    return true; // ✅ Déconnexion réussie
  } catch (error) {
    console.error("Erreur de déconnexion :", error);
    throw error;
  }
}

export function ecouterAuth(callback: (user: any | null) => void) {
  return onAuthStateChanged(auth, (user) => {
    callback(user); // 🔔 déclenche quand login/logout
  });
}

// 🔑 Connexion étudiant
export async function connecterEtudiant(email: string, motDePasse: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, motDePasse);
  return userCredential.user;
}

// 🔎 Récupérer les infos d’un étudiant
export async function obtenirEtudiant(uid: string) {
  const ref = doc(db, "students", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Étudiant introuvable");
  return {...snap.data(), uid: snap.id} as Etudiant & {uid: string};
}

// ✏️ Mise à jour des infos d’un étudiant
export async function mettreAJourEtudiant(uid: string, modifications: Partial<Etudiant>) {
  const ref = doc(db, "students", uid);
  await updateDoc(ref, {
    ...modifications,
    modifieLe: new Date().toISOString(),
  });
}

// ❌ Suppression d’un étudiant
export async function supprimerEtudiant(uid: string) {
  await deleteDoc(doc(db, "students", uid));
}

export const generateUniqueMatricule = async (): Promise<string> => {
  try {
    let unique = false;
    let matricule = '';

    while (!unique) {
      // Génération du matricule
      const now = new Date();
      const year = now.getFullYear().toString().slice(-2);
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const randomNumber = Math.floor(1000 + Math.random() * 9000);
      matricule = `${year}${month}${day}-${randomNumber}`;

      // Vérification si le matricule existe déjà
      const q = query(
        collection(db, COLLECTION_NAME),
        where('matricule', '==', matricule)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        unique = true; // matricule unique trouvé
      }
    }
    
    return matricule;
  } catch (error) {
    console.error('Error generating unique matricule:', error);
    return ''; // retourne une chaîne vide en cas d'erreur
  }
};
