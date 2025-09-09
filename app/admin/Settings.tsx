import {Settings, Clipboard, ClipboardCheck,Home , Share2} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

type Props = {
    setSettings :  Dispatch<SetStateAction<boolean>>;
    adminId: string;
}

type Shares = { title:string, text:string, url:string }

function SettingsLayout({setSettings,adminId}:Props) {
    const [urlProf, setUrlProf] = useState('')
    const [urlStudent, setUrlStudent] = useState('')
    const router = useRouter();
    const [isCopied, setIsCopied] = useState(false);
    const [isCopiedStudent, setIsCopiedStudent] = useState(false);

  const copy = async (text:string,state:string = 'prof') => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        throw new Error('Clipboard API not supported');
      }
      state === 'prof' ? setIsCopied(true) : setIsCopiedStudent(true)
      setTimeout(() => state === 'prof' ? setIsCopied(false) : setIsCopiedStudent(false), 2000);
      return true;
    } catch (err) {
      console.error('Copy failed:', err);
      return false;
    }
  };

  const openShareFallback = ({ title, text, url }:Shares) => {
    console.log(url)
  const encodedText = encodeURIComponent(`${title}\n\n${text}\n\n${url}`);
  const platforms = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodedText}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodedText}`
  };

  // Open a popup or redirect
  window.open(platforms.whatsapp, '_blank', 'noreferrer noopener');
}

const handleShare = (url:string) => {
    openShareFallback({
      title: 'Share',
      text: 'inscription',
      url: url
    });
  };

    const routing = (route : string) => {
        router.push("/"+route)
    }

    const getBaseUrl = (fullUrl:string,state:string = 'prof') => {
        const id_admin = localStorage.getItem('masomo_admin') || ''

        // Create a URL object (works in browsers and Node.js)
        const url = new URL(fullUrl);

        // Extract protocol, hostname, and port
        const protocol = url.protocol; // "http:" or "https:"
        const hostname = url.hostname; // "localhost"
        const port = url.port; // "3000" (empty if default port)

        // Reconstruct the base URL
        let baseUrl = `${protocol}//${hostname}`;
        if (port) baseUrl += `:${port}`;

        return `${baseUrl}/${state}/${id_admin}`  ;
    }

    useEffect(() => {
        const fullUrl = window.location.href
        setUrlProf(getBaseUrl(fullUrl))
        setUrlStudent(getBaseUrl(fullUrl,'students'))
    }, [])
    


  return (
    <div className="relative flex h-100dvh text-white justify-center items-center flex-col gap-4">
        {/* Header */}
        <div className='flex justify-center items-center'>
            <Settings size={36} color="#FF7E29" />
            <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        {/* Body */}
        <div className='w-screen h-[80dvh] overflow-y-scroll '>
            <div className='flex flex-col p-2 m-4 gap-4 bg-[#1d2837cc] border rounded-md border-amber-50 '>
                <p className='text-2xl font-bold'>Link Prof</p>
                <p className='break-all' >{urlProf}</p>
                <div className='flex justify-around items-center'>
                    {isCopied && <ClipboardCheck size={36} color="#FF7E29" />}
                    {!isCopied && <Clipboard onClick={() => copy(urlProf)} size={36} color="#FF7E29" />}
                    <Share2 size={36} onClick={()=>handleShare(urlProf)} />
                </div>
            </div>
            <div className='flex flex-col p-2 m-4 gap-4 bg-[#1d2837cc] border rounded-md border-amber-50 '>
                <p className='text-2xl font-bold'>Link Student</p>
                <p className='break-all' >{urlStudent}</p>
                <div className='flex justify-around items-center'>
                    {isCopiedStudent && <ClipboardCheck size={36} color="#FF7E29" />}
                    {!isCopiedStudent && <Clipboard onClick={() => copy(urlStudent,'student')} size={36} color="#FF7E29" />}
                    <Share2 size={36} onClick={()=>handleShare(urlStudent)} />
                </div>
            </div>
            
            
        </div>

        <div onClick={()=> {routing('admin');setSettings(false)}} className='absolute bottom-0 flex items-center hover:cursor-pointer hover:scale-105 transition-transform duration-300' >
        <Home  size={36} color="#FF7E29" />
        </div>

    </div>
  )
}

export default SettingsLayout
