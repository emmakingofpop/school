// lib/auth.ts
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export interface Teacher{
    adminId: string;
    tel: string,
    email: string;
    password: string;
    fullName: string
    schools : string[]
}

export async function signUpTeacher(teacher : Teacher) {
  const userCredential = await createUserWithEmailAndPassword(auth, teacher.email, teacher.password);
  const user = userCredential.user;

  // Store extra teacher data in Firestore
  await setDoc(doc(db, "teachers", user.uid), {
    uid: user.uid,
    teacher,
    
    createdAt: new Date().toISOString(),
  });

  return user;
}

export async function loginTeacher(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function getProfById(uid: string): Promise<{createdAt:string,teacher:object,uid:string} | null> {
    try {
      const docRef = doc(db, "teachers", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data: any = {...docSnap.data(),uid:docSnap.id} ;
        
        return data
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting school:', error);
      return null;
    }
  }