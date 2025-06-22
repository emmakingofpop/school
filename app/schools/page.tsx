'use client';
import { Home,SchoolIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AddSchools from './AddSchools';
import SchoolList from './SchoolList';

function page() {
    const router = useRouter();
    const routing = (route : string) => {
        router.push("/"+route)
    }
  return (
    <div className="relative w-screen h-screen">

        <div className='mt-10'>
          <AddSchools />
          {/* <SchoolList /> */}
        </div>
      
        <nav className='absolute bottom-2 left-1/2 transform -translate-x-1/2'>
            <Home onClick={()=> routing('admin')} size={36} color="#FF7E29" className='hover:cursor-pointer hover:scale-105 transition-transform duration-300' />
            <SchoolIcon onClick={()=> routing('admin')} size={36} color="#FF7E29" className='hover:cursor-pointer hover:scale-105 transition-transform duration-300' />
        
        </nav>
    </div>
  )
}

export default page
