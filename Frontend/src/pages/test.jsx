import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { FaYoutube } from "react-icons/fa";
import uploadmedia from '../Utils/mediaUpload';


export default function test() {

const [file, setFile] = useState(null)

async function handleFileChange(event) {
   const selectedFile = event.target.files[0]
   if (selectedFile) {
       setFile(selectedFile)
       try {
           const res = await uploadmedia(selectedFile)
           console.log(res)
           toast.success('File uploaded successfully')
       } catch (error) {
           toast.error('Failed to upload file')
           console.error(error)
       }
   }
}

  return (
   <div className='w-full h-screen flex items-center justify-center bg-primary'>
    <input type = "file" onChange={handleFileChange}/>
     
    <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
      Upload
    </button>
   </div>
  )
}

