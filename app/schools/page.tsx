'use client';
import { Home,SchoolIcon,MenuIcon,Newspaper } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AddSchools from './AddSchools';
import SchoolList from './SchoolList';
import styles from './School.module.css'
import { useState } from 'react';

function page() {
    const router = useRouter();
    const [link, setLink] = useState(0)
    const [loadSideBar, setLoadSideBar] = useState(false)
    const routing = (route : string) => {
        router.push("/"+route)
    }
  return (
    <div className="relative w-screen h-[95dvh]">

      <MenuIcon size={36} className='absolute left-0' onClick={()=>setLoadSideBar(true)} />

      <div className={'absolute left-0 z-[1000] w-10/12 h-screen bg-[#1d2837] ' + (loadSideBar ? styles.show : styles.hide)}>

            <MenuIcon size={36} className='float-end' onClick={()=>setLoadSideBar(false)} />
            <div className='px-2 py-8 grid columns-1 gap-8'>
              <div onClick={()=> {setLink(1);setLoadSideBar(false)}} className='flex items-center hover:cursor-pointer hover:scale-105 transition-transform duration-300' >
                <Newspaper  size={36} color="#FF7E29" />
                <p className='inline font-bold text-2xl  border-b-2 border-[#FF7E29]'>New School</p>
              </div>
              <div  onClick={()=> {setLink(2);setLoadSideBar(false)}}  className='flex items-center hover:cursor-pointer hover:scale-105 transition-transform duration-300' >
                <SchoolIcon  size={36} color="#FF7E29" />
                <p className='inline font-bold text-2xl border-b-2 border-[#FF7E29]'>List School</p>
              </div>
              <div onClick={()=> {routing('admin');setLoadSideBar(false)}} className='flex items-center hover:cursor-pointer hover:scale-105 transition-transform duration-300' >
                <Home  size={36} color="#FF7E29" />
                <p className='inline font-bold text-2xl border-b-2 border-[#FF7E29]'>Home</p>
              </div>
            </div>
      </div>

        <div className='mt-10'>
          { (link === 1 || link === 0 ) && <AddSchools setLink={setLink} />}
          { link ===2 && <SchoolList />}
        </div>
      
        <nav className='flex justify-between items-center absolute bottom-2 left-1/2 transform -translate-x-1/2'>
            <Home onClick={()=> routing('admin')} size={36} color="#FF7E29" className='hover:cursor-pointer hover:scale-105 transition-transform duration-300' />
            
        </nav>
    </div>
  )
}

export default page
