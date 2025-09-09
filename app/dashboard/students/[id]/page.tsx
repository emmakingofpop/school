'use client'
import { MenuIcon } from 'lucide-react';
import styles from './Students.module.css'
import React, { use, useEffect, useState } from 'react'
import ModifierEtudiant from './ModifyStudent';
import { deconnecterEtudiant } from '../../../services/studentsServices';
import { useRouter } from 'next/navigation';
interface Props {
  params: {
    id: string;
  };
}

function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
const router = useRouter();
const [studentId, setStudentId] = useState<string | null>(null);
const [adminId, setAdminId] = useState<string | null>(null);
const [loadSideBar, setLoadSideBar] = useState(false)
const [sideBar, setSideBar] = useState('profile')
const {id} = use(params);

  useEffect(() => {
    
    const item = localStorage.getItem('masomo_student');
    setStudentId(item);
    setAdminId(id);
  }, []);

  const loadSideBarFunction = (sideBarName:string) => {
    setSideBar(sideBarName)
    setLoadSideBar(false)
  }

  
  const routing = (route : string) => {
      router.push("/"+route)
  }


  const deconnexion = async () => {
    await deconnecterEtudiant();
    localStorage.removeItem('masomo_teacher');
    routing('/students/'+adminId)
  }

  return (
    <div className='w-screen h-screen relative'>
            <MenuIcon size={36} className='absolute left-0' onClick={()=>setLoadSideBar(true)} />
            <aside
  className={
    'absolute left-0 top-0 z-[1000] w-10/12 sm:w-64 h-screen bg-white/10 backdrop-blur-md text-white transform transition-transform duration-300 ease-in-out ' +
    (loadSideBar ? 'translate-x-0' : '-translate-x-full')
  }
>
  {/* En-tête */}
  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
    <h2 className="text-lg font-bold tracking-wide">Espace Étudiant</h2>
    <MenuIcon
      size={28}
      className="cursor-pointer hover:text-red-400"
      onClick={() => setLoadSideBar(false)}
    />
  </div>

  {/* Menu */}
  <ul className="mt-6 space-y-2">
    
    <li onClick={() => loadSideBarFunction('profile')} className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700 transition cursor-pointer">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-green-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5.121 17.804A8.001 8.001 0 0112 15c1.657 0 3.182.505 4.434 1.366M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
      Profil
    </li>

    <li onClick={() => loadSideBarFunction('Mes classes')} className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700 transition cursor-pointer">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-yellow-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 14l6.16-3.422A12.083 12.083 0 0112 21.5a12.083 12.083 0 01-6.16-10.922L12 14z"
        />
      </svg>
      Mes classes
    </li>

    <li onClick={() => loadSideBarFunction('Résultats')}  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700 transition cursor-pointer">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-purple-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 11V3a1 1 0 012 0v8h6a1 1 0 010 2h-6v8a1 1 0 01-2 0v-8H5a1 1 0 010-2h6z"
        />
      </svg>
      Résultats
    </li>

    <li onClick={async ()=> await deconnexion()} className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-600 transition cursor-pointer">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-red-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5a2 2 0 012-2h3"
        />
      </svg>
      Déconnexion
    </li>
  </ul>
</aside>

            <div className='flex-1 mt-10 p-4'>
                {studentId && adminId ? (
                    sideBar === 'profile' && (<ModifierEtudiant studentId={studentId} AdminId={adminId} />)
                ) : (
                    <h1 className='text-2xl font-bold'>Loading...</h1>
                )}
            </div>

        </div>
    
  )
}

export default page
