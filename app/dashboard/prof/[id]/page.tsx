'use client'
import styles from './Prof.module.css'
import React, { use, useEffect, useState } from 'react'
import { MenuIcon, XIcon, UserIcon, BookOpenIcon, ClipboardListIcon, CogIcon, LogOutIcon } from 'lucide-react';
import { deconnecterEtudiant } from '../../../services/studentsServices';
import Notes from './Note';
import CoursPage from './Cours';
import ClassesProfPage from './ClassesProf';
import { useRouter } from 'next/navigation';
import BulletinLayout from './bulletinLayout';
import SelectBulletin from './SelectBulletin';


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
const [profId, setProfId] = useState<string | null>(null);
const [adminId, setAdminId] = useState<string | null>(null);
const [loadSideBar, setLoadSideBar] = useState(false)
const [sideBar, setSideBar] = useState('profile')
const {id} = use(params);
const menuItems = [
        { name: 'Cotes', icon: <ClipboardListIcon className="w-6 h-6 mr-3" />, link: '/dashboard' },
        { name: 'Cours', icon: <BookOpenIcon className="w-6 h-6 mr-3" />, link: '/courses' },
        { name: 'Mes Classes', icon: <BookOpenIcon className="w-6 h-6 mr-3" />, link: '/classes' },
        { name: 'Étudiants', icon: <UserIcon className="w-6 h-6 mr-3" />, link: '/students' },
        { name: 'Notes', icon: <ClipboardListIcon className="w-6 h-6 mr-3" />, link: '/grades' },
        { name: 'Paramètres', icon: <CogIcon className="w-6 h-6 mr-3" />, link: '/settings' },
    ];

  useEffect(() => {
    
    const item = localStorage.getItem('masomo_teacher');
    setProfId(item);
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
      localStorage.removeItem('masomo_student');
      routing('/prof/'+adminId)
    }
  

  return (
    <div className='w-screen h-screen relative'>
            <MenuIcon size={36} className='absolute left-0' onClick={()=>setLoadSideBar(true)} />
            <aside className={`fixed top-0 left-0 z-[1000] w-64 h-screen bg-[#1d2837] text-white transform ${loadSideBar ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
            
            {/* Bouton pour fermer le sidebar */}
            <button 
                className="absolute top-4 right-4 text-white"
                onClick={() => setLoadSideBar(false)}
            >
                <XIcon className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold p-6 border-b border-gray-700">Professeur</h2>

            <nav className="mt-6">
                <ul>
                    {menuItems.map((item, idx) => (
                        <li onClick={() => loadSideBarFunction(item.name)} key={idx} className="px-6 py-3 hover:bg-gray-800 cursor-pointer flex items-center">
                            {item.icon}
                            <span>{item.name}</span>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Bouton Déconnexion */}
            <button onClick={async () => await deconnexion()} className="absolute bottom-6 left-6 flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded">
                <LogOutIcon className="w-5 h-5 mr-2" />
                Déconnexion
            </button>
        </aside>
            <div className="flex-1 mt-10 p-4">
  {profId && adminId ? (
    <>
      {sideBar === "Cotes" && <Notes profId={profId} adminId={adminId} />}
      {sideBar === "Cours" && <CoursPage profId={profId} adminId={adminId} />}
      {sideBar === "Mes Classes" && <ClassesProfPage profId={profId} adminId={adminId} />}
      {sideBar === "Notes" && <SelectBulletin adminId={adminId} />}
    </>
  ) : (
    <h1 className="text-2xl font-bold">Loading...</h1>
  )}
</div>


        </div>
    
  )
}

export default page
