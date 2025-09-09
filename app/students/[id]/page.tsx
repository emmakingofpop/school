"use client"
import { use, useState } from 'react'
import PageConnexionEtudiant from './connexion'
import PageInscriptionEtudiant from './inscription'

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
  const {id} = use(params);
  const [LoadPage, setLoadPage] = useState<boolean>(true)
  return (
    <div>
      <div className='flex justify-center gap-3 mt-3'>
        <button className={`px-4 py-2 rounded ${LoadPage ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} onClick={() => setLoadPage(true)}>Connexion</button>
        <button className={`px-4 py-2 rounded ${!LoadPage ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} onClick={() => setLoadPage(false)}>Inscription</button>
      </div>
      <hr className='my-4'/>
      {LoadPage ? (<PageConnexionEtudiant AdminId={id}/>):(<PageInscriptionEtudiant AdminId={id}/>)}
    </div>
  )
}

export default page
