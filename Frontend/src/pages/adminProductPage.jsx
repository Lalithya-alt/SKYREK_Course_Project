import React from 'react'
import { BiSolidCartAdd } from "react-icons/bi";

export default function adminProductPage() {
  return (
    <div className='w-full h-full'>
        adminProductPage

        <button className='bg-accent w-15 h-15 rounded-full text-white text-4xl flex justify-center items-center fixed bottom-10 right-10 shadow-2xl hover:bg-[#0041C2]'>
            <BiSolidCartAdd />
        </button>
    </div>
  )
}

