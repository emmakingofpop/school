'use client';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase'; // your firebase config
import { Users, BookOpen, CalendarDays, ClipboardList, GraduationCap,School,Settings,X } from 'lucide-react';
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Admin.module.css'
import SettingsLayout from './Settings';
import Classes from './Classes';
import AnneeScolaires from './AnneeScolaire';

export default function AdminDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>({})
    const [settings, setSettings] = useState(false)
    const [classes, setClasses] = useState(false)
    const [anneeScolaire, setAnneeScolaire] = useState(false)

    const getDocumentById = async (collectionName: string, id: string): Promise<object | null> => {
        try {
            const docRef = doc(db, collectionName, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
           
            return {...docSnap.data(),id:docSnap.id};
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
    <div>
    {user?.id ? (<div className=" text-white flex flex-col items-center">
      {/* Header */}
      <div className="w-full mb-6 text-center">
        <h1 className="text-2xl font-bold">🏫 School Management</h1>
        <div className="text-gray-400">{user?.email ? (<p>Welcome : {user?.firstName+' '+user?.lastName} </p>):(<p>Admin Dashboard</p>)}</div>
      </div>

      {/* Dashboard Grid */}
      <div className=" overflow-scroll h-[70dvh] grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-lg">
        
        {/* Students */}
        <div className="hover:shadow-[#FF7E29] hover:cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col items-center space-y-2 shadow-lg">
          <Users size={36} color="#FF7E29" />
          <h2 className="font-semibold text-lg">Students</h2>
          <p className="text-sm text-gray-400">Manage student data</p>
        </div>

        {/* Teachers */}
        <div className="hover:shadow-[#FF7E29] hover:cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex flex-col items-center space-y-2 shadow-lg">
          <GraduationCap size={36} color="#FF7E29" />
          <h2 className="font-semibold text-lg">Teachers</h2>
          <p className="text-sm text-gray-400">Manage teacher profiles</p>
        </div>

        {/* Classes */}
        <div onClick={()=>setClasses(true)} className="hover:shadow-[#FF7E29] hover:cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col items-center space-y-2 shadow-lg">
          <BookOpen size={36} color="#FF7E29" />
          <h2 className="font-semibold text-lg">Classes</h2>
          <p className="text-sm text-gray-400">View & schedule classes</p>
        </div>

        {/* AnneeScolaire */}
        <div onClick={()=>setAnneeScolaire(true)} className="hover:shadow-[#FF7E29] hover:cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col items-center space-y-2 shadow-lg">
          <BookOpen size={36} color="#FF7E29" />
          <h2 className="font-semibold text-lg">Annee</h2>
          <p className="text-sm text-gray-400">Annee Scolaire</p>
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

        

        {/* Teachers */}
        <div onClick={()=>setSettings(true)} className="hover:shadow-[#FF7E29] hover:cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col items-center space-y-2 shadow-lg">
          <Settings size={36} color="#FF7E29" />
          <h2 className="font-semibold text-lg">Settings</h2>
          <p className="text-sm text-gray-400">Privacy to manage app permissions.</p>
        </div>

        
        
      </div>

      <div className={'absolute z-[1000] w-screen h-screen bg-[#1d2837]/10 backdrop-blur-md ' + (settings ? styles.show : styles.hide)}>
        <X onClick={()=>setSettings(false)} size={36} color="#FF7E29"  className='p-2 hover:cursor-pointer hover:scale-105 transition-transform duration-300' />
        <SettingsLayout adminId={user.id}  setSettings={setSettings}/>
      </div>
      <div className={'absolute z-[1000] w-screen h-screen bg-[#1d2837]/10 backdrop-blur-md ' + (classes ? styles.show : styles.hide)}>
        <X onClick={()=>setClasses(false)} size={36} color="#FF7E29"  className='p-2 hover:cursor-pointer hover:scale-105 transition-transform duration-300' />
        <Classes adminId={user.id} setClassess={setClasses}/>
      </div>
      <div className={'absolute z-[1000] w-screen h-screen bg-[#1d2837]/10 backdrop-blur-md ' + (anneeScolaire ? styles.show : styles.hide)}>
        <X onClick={()=>setAnneeScolaire(false)} size={36} color="#FF7E29"  className='p-2 hover:cursor-pointer hover:scale-105 transition-transform duration-300' />
        <AnneeScolaires adminId={user.id} setAnneeScolaire={setAnneeScolaire}/>
      </div>
    </div>):(
      
      <div className="flex items-center justify-center h-screen text-white">
        <div className="text-center">
          <p className="text-2xl mb-4">Loading...</p>
        </div>
      </div>
    )}

    </div>
  );
}
