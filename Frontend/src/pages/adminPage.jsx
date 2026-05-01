import React from 'react'
import { Link, Routes, Route } from 'react-router-dom'
import { FaShoppingCart } from "react-icons/fa"
import { BsFillGiftFill } from "react-icons/bs"
import { FaUserTie } from "react-icons/fa"
import AdminProductPage from './adminProductPage'


export default function adminPage() {
  return (
    <div className='w-full h-screen flex bg-primary'>
     
      <div className='w-60 h-full bg-white flex flex-col shadow-2xl'>
        <div className='w-full h-37.5'>
           <img src='/logo.png' className='h-full w-full object-contain'/>
        </div>

        <div className='w-full h-auto p-4 text-xl text-accent flex justify-center gap-4 '>
          <FaShoppingCart />
          <Link to={"/admin/orders"}>Orders</Link>
        </div>

        <div className='w-full h-auto p-4 text-xl text-accent flex justify-center gap-4 '>
          <BsFillGiftFill />
          <Link to={"/admin/products"}>Products</Link>
        </div>

        <div className='w-full h-auto p-4 text-xl text-accent flex justify-center gap-4 '>
          <FaUserTie />
          <Link to={"/admin/users"}>Users</Link>
        </div>

      </div>

      <div className='w-[calc(100%-300px)] h-full p-4'>
        <Routes>
            <Route path="orders" element={<h1>Order Page</h1>} />
            <Route path="products" element={<AdminProductPage/>} />
            <Route path="users" element={<h1>Users Page</h1>} />
        </Routes>
      </div>
    </div>
  )
}
