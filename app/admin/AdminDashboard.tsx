'use client';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase'; // your firebase config
import { Users, BookOpen, CalendarDays, ClipboardList, GraduationCap,School } from 'lucide-react';
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>({})

    const getDocumentById = async (collectionName: string, id: string): Promise<object | null> => {
        try {
            const docRef = doc(db, collectionName, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
           
            return docSnap.data();
            } else {
          
            return null;
            }
        } catch (error) {
          
            return null; // return null if there is an error
        }
    };

    // routing 

    const routing = (route : string) => {
        router.push("/"+route)
    }


useEffect(() => {
  const fetchUser = async () => {
    const getId: string = localStorage.getItem('masomo_admin') || '';
    if (getId !== '') {
      const userData = await getDocumentById('administrators', getId);
      if (userData) {
        setUser(userData);
      } else {
        setUser(null);
      }
    }
  };

  fetchUser();
}, []);



  return (
    <div className="min-h-screen text-white p-4 flex flex-col items-center">
      {/* Header */}
      <div className="w-full mb-6 text-center">
        <h1 className="text-2xl font-bold">🏫 School Management</h1>
        <div className="text-gray-400">{user?.email ? (<p>Welcome : {user?.firstName+' '+user?.lastName} </p>):(<p>Admin Dashboard</p>)}</div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-lg">
        
        {/* Students */}
        <div className="hover:shadow-[#FF7E29] hover:cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col items-center space-y-2 shadow-lg">
          <Users size={36} color="#FF7E29" />
          <h2 className="font-semibold text-lg">Students</h2>
          <p className="text-sm text-gray-400">Manage student data</p>
        </div>

        {/* Teachers */}
        <div className="hover:shadow-[#FF7E29] hover:cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col items-center space-y-2 shadow-lg">
          <GraduationCap size={36} color="#FF7E29" />
          <h2 className="font-semibold text-lg">Teachers</h2>
          <p className="text-sm text-gray-400">Manage teacher profiles</p>
        </div>

        {/* Classes */}
        <div className="hover:shadow-[#FF7E29] hover:cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col items-center space-y-2 shadow-lg">
          <BookOpen size={36} color="#FF7E29" />
          <h2 className="font-semibold text-lg">Classes</h2>
          <p className="text-sm text-gray-400">View & schedule classes</p>
        </div>

        {/* Exams */}
        <div className="hover:shadow-[#FF7E29] hover:cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col items-center space-y-2 shadow-lg">
          <ClipboardList size={36} color="#FF7E29" />
          <h2 className="font-semibold text-lg">Exams</h2>
          <p className="text-sm text-gray-400">Manage exams & results</p>
        </div>

         {/* Attendance */}
        <div onClick={()=> routing('schools')} className="hover:shadow-[#FF7E29] hover:cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col items-center space-y-2 shadow-lg col-span-1 sm:col-span-2">
          <School size={36} color="#FF7E29" />
          <h2 className="font-semibold text-lg">Schools</h2>
          <p className="text-sm text-gray-400">List of all schools</p>
        </div>

        {/* Attendance */}
        <div className="hover:shadow-[#FF7E29] hover:cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col items-center space-y-2 shadow-lg col-span-1 sm:col-span-2">
          <CalendarDays size={36} color="#FF7E29" />
          <h2 className="font-semibold text-lg">Attendance</h2>
          <p className="text-sm text-gray-400">Track daily attendance</p>
        </div>
        
      </div>
    </div>
  );
}
