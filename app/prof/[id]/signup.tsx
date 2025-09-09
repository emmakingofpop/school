'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signUpTeacher, loginTeacher, Teacher } from '../../services/profService';
import { SchoolService, School } from '../../services/schoolService';
import Image from 'next/image';
import styles from './Teacher.module.css'; // You’ll create this

type SchoolWithId = School & { id: string };

type Props = {
    id:string
}

export default function TeacherAuth({id}:Props) {
  const router = useRouter();
  const [schools, setSchools] = useState<SchoolWithId[]>([]);
  const [teacher, setTeacher] = useState<Teacher>({
    adminId: id,
    fullName: '',
    tel: '',
    email: '',
    password: '',
    schools: [],
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [schoolInput, setSchoolInput] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const getLocalStorageItem = (key: string): string | null => {
    return localStorage.getItem(key) ?? null;
  }
  const setLocalStorageItem = (key: string, value: string): void => {
    localStorage.setItem(key, value);
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (
      !teacher.fullName.trim() ||
      !teacher.tel.trim() ||
      !teacher.email.trim() ||
      !teacher.password.trim() ||
      !confirmPassword.trim()
    ) {
      setLoading(false);
      return alert('❌ Fill in all fields.');
    }

    if (teacher.password !== confirmPassword) {
      setLoading(false);
      return alert('❌ Passwords do not match.');
    }

    if (teacher.schools.length <= 0) {
        setLoading(false);
        return alert('❌ Select minimun one school.');
    }

    try {
      const user = await signUpTeacher(teacher);
      localStorage.setItem('masomo_teacher', user.uid);
      router.push(`/dashboard/prof/${id}`);
    } catch (err: any) {
      alert('❌ failed to signup , maybe the user is used');
    }

    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await loginTeacher(teacher.email, teacher.password);
      localStorage.setItem('masomo_teacher', user.uid);
      router.push('/dashboard/prof/' + id + '');
    } catch (err: any) {
      alert('❌ Login failed: ' + err.message);
    }

    setLoading(false);
  };

    const loadSchools = async () => {
      const id_admin = id
      const schoolsWithId = (await SchoolService.getAllDocs(id_admin)) as SchoolWithId[];
      setSchools(schoolsWithId);
      
    };

useEffect(() => {
    const fetchData = async () => {
        await loadSchools();
        
    };

  fetchData();
}, []);


  

  return (
    <main className="p-8 space-y-8 w-full max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-6 text-white">TEACHER AUTH</h1>

      <div className="flex justify-between mb-4">
        <div className="cursor-pointer text-white" onClick={() => setIsLogin(true)}>Login</div>
        <div className="cursor-pointer text-white" onClick={() => setIsLogin(false)}>Sign Up</div>
      </div>

      {isLogin ? (
        <form onSubmit={handleLogin} className="glass-card space-y-4">
          <input
            className={`w-full p-3 rounded text-white ${styles.input}`}
            placeholder="Email"
            value={teacher.email}
            onChange={(e) => setTeacher({ ...teacher, email: e.target.value })}
          />
          <input
            className={`w-full p-3 rounded text-white ${styles.input}`}
            type="password"
            placeholder="Password"
            value={teacher.password}
            onChange={(e) => setTeacher({ ...teacher, password: e.target.value })}
          />
          <button type="submit" className="glass-btn">
            {loading && <Image src="/loading.gif" width={30} height={30} alt="Loading" className="inline mr-2" />}
            Login
          </button>
        </form>
      ) : (
        <form onSubmit={handleSignup} className="glass-card space-y-4 overflow-scroll h-[60dvh]">
          <input
            className={`w-full p-3 rounded text-white ${styles.input}`}
            placeholder="Full Name"
            value={teacher.fullName}
            onChange={(e) => setTeacher({ ...teacher, fullName: e.target.value })}
          />
          <input
            className={`w-full p-3 rounded text-white ${styles.input}`}
            placeholder="Phone"
            value={teacher.tel}
            onChange={(e) => setTeacher({ ...teacher, tel: e.target.value })}
          />
          <input
            className={`w-full p-3 rounded text-white ${styles.input}`}
            placeholder="Email"
            value={teacher.email}
            onChange={(e) => setTeacher({ ...teacher, email: e.target.value })}
          />
          <input
            className={`w-full p-3 rounded text-white ${styles.input}`}
            type="password"
            placeholder="Password"
            value={teacher.password}
            onChange={(e) => setTeacher({ ...teacher, password: e.target.value })}
          />
          <input
            className={`w-full p-3 rounded text-white ${styles.input}`}
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div >
          {schools.length <= 0 && <Image src="/loading.gif" width={30} height={30} alt="Loading" className="inline mr-2" />}
              
            {schools.map((school, index) => {
                const isSelected = teacher.schools.includes(school.id);

                return (
                    <div className="flex justify-between py-2 space-x-2" key={index}>
                    <p>{school.name}</p>
                    <button
                        type="button"
                        className="bg-[#FF7E29] text-white px-4 py-2 rounded"
                        onClick={() => {
                        if (isSelected) {
                            // Remove the school
                            setTeacher({
                            ...teacher,
                            schools: teacher.schools.filter(id => id !== school.id),
                            });
                        } else {
                            // Add the school
                            setTeacher({
                            ...teacher,
                            schools: [...teacher.schools, school.id],
                            });
                        }
                        }}
                    >
                        {isSelected ? '➖' : '➕'}
                    </button>
                    </div>
                );
                })}

          </div>
          
          {schools.length > 0 && 
            <button type="submit" className="glass-btn">
              {loading && <Image src="/loading.gif" width={30} height={30} alt="Loading" className="inline mr-2" />}
              Sign Up
            </button>
          }
        </form>
      )}
    </main>
  );
}
