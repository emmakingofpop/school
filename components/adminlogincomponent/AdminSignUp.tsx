'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../../lib/firebase';
import styles from './Admin.module.css'
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
 query, where
} from 'firebase/firestore';
import Image from 'next/image';

type Person = {
  id?: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  phone: string;
  password:string
};


function AdminSignUp() {
  const router = useRouter();
  const [people, setPeople] = useState<Person[]>([]);
  const [confirmPassword,setConfirmPassword] = useState('')
  const [isLogin, setisLogin] = useState(false)
  const [loadingImage, setloadingImage] = useState(false)
  const [formData, setFormData] = useState<Omit<Person, 'id'>>({
    firstName: '',
    lastName: '',
    role: '',
    email: '',
    phone: '',
    password: '',
  });

  const peopleRef = collection(db, 'administrators');

  const fetchPeople = async () => {
    const snapshot = await getDocs(peopleRef);
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Person[];
    setPeople(data);
    return data
  };

  
// Function to find user by email and password
const findUserByEmailAndPassword = async(email:string, password:string)=> {
  try {

    // build query: where email == email and password == password
    const q = query(
      peopleRef,
      where('email', '==', email),
      where('password', '==', password)
    );

    // execute the query
    const querySnapshot = await getDocs(q);

    // if a user is found, return it
    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      return { id: querySnapshot.docs[0].id, ...userData };
    } else {
      // no user found
      return null;
    }
  } catch (error) {
    return null
  }
}

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setloadingImage(true)
  // 1️⃣ Check if any field is empty
  if (
    !formData.firstName.trim() ||
    !formData.lastName.trim() ||
    !formData.role.trim() ||
    !formData.email.trim() ||
    !formData.phone.trim() ||
    !formData.password.trim() ||
    !confirmPassword.trim()
  ) {
    setloadingImage(false)
    alert('❌ Please fill in all fields.');
    return;
  }

  // 2️⃣ Check passwords match
  if (formData.password !== confirmPassword) {
    setloadingImage(false)
    alert('❌ Password and Confirm Password do not match.');
    return;
  }

  // 3️⃣ Check if email already exists
  const existingUser = people.find(
    p => p.email.toLowerCase() === formData.email.toLowerCase()
  );

  if (existingUser) {
    setloadingImage(false)
    alert('❌ A user with this email already exists.');
    return;
  }

  // 4️⃣ If all is valid, add user
  await addDoc(peopleRef, formData);

  redirectUrl()
  //alert('✅ User successfully registered.');
};

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setloadingImage(true)
    // 1️⃣ Check if any field is empty
    if (!formData.email.trim() || !formData.password.trim()) {
      setloadingImage(false)
      alert('❌ Please fill in all fields.');
      return;
    }

    redirectUrl()
    setisLogin(true)

  }

  const redirectUrl = async () => {
    const user = await findUserByEmailAndPassword(formData.email,formData.password)
    setloadingImage(true)
      if (user) {
       
        user && localStorage.setItem('masomo_admin',user?.id || '')
        router.push("/admin")
      }else{
        setloadingImage(false)
        alert('❌ The user does not exist.');
        return;
      }
    

      setFormData({
        firstName: '',
        lastName: '',
        role: '',
        email: '',
        phone: '',
        password: '',
      });
      setConfirmPassword('');
  }


  useEffect(() => {
    fetchPeople();
  }, []);

  return (
    <main className="p-8 space-y-8 w-full max-w-4xl mx-auto">
      
      <h1 className="text-4xl font-bold text-center mb-6">ADMINISTRATION MASOMO</h1>
      <div className='flex justify-between'>
        <div className='cursor-pointer' onClick={()=>setisLogin(true)}>Login</div>
        <div className='cursor-pointer'  onClick={()=>setisLogin(false)}>Sign Up</div>
      </div>

      {isLogin && <form onSubmit={login} className="glass-card space-y-4">
        <div>
          <input
            className={"w-full p-3 rounded text-white "+styles.input}
            placeholder="Email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <input
            className={"w-full p-3 rounded text-white "+styles.input}
            type='password'
            placeholder="Password"
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
        <button type="submit" className="glass-btn" style={{display:'flex',alignItems:'center'}}>
          {loadingImage && <Image
            alt="Loading"
            src="/loading.gif"
            width={30}
            height={30}
            style={{marginRight:'5px'}}
          />}
          Login
        </button>

      </form>}

      { !isLogin && <form onSubmit={handleSubmit} className="overflow-scroll h-[50dvh] glass-card space-y-4">
        <div>
          <input
            className={"w-full p-3 rounded text-white "+styles.input}
            placeholder="First Name"
            value={formData.firstName}
            onChange={e => setFormData({ ...formData, firstName: e.target.value })}
          />
        </div>
        <div>
          <input
            className={"w-full p-3 rounded text-white "+styles.input}
            placeholder="Last Name"
            value={formData.lastName}
            onChange={e => setFormData({ ...formData, lastName: e.target.value })}
          />
        </div>
        <div>
          <input
            className={"w-full p-3 rounded text-white "+styles.input}
            placeholder="Role"
            value={formData.role}
            onChange={e => setFormData({ ...formData, role: e.target.value })}
          />
        </div>
        <div>
          <input
            className={"w-full p-3 rounded text-white "+styles.input}
            placeholder="Email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <input
            className={"w-full p-3 rounded text-white "+styles.input}
            placeholder="Phone"
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        <div>
          <input
            className={"w-full p-3 rounded text-white "+styles.input}
            type='password'
            placeholder="Password"
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
        <div>
          <input
            className={"w-full p-3 rounded text-white "+styles.input}
            type='password'
            placeholder="Confirm Password"
            onChange={e => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="glass-btn" style={{display:'flex',alignItems:'center'}}>
          {loadingImage && <Image
            alt="Loading"
            src="/loading.gif"
            width={30}
            height={30}
            style={{marginRight:'5px'}}
          />}
          Sign Up
        </button>
      </form>}
    </main>
  )
}

export default AdminSignUp
