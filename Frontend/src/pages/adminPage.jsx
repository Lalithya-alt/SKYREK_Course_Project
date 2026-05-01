import React from 'react'
import { Link, Routes, Route } from 'react-router-dom'

export default function adminPage() {
  return (
    <div className='w-full h-screen bg-purple-600 flex '>
     
      <div className='w-75 h-full bg-white flex flex-col'>
        <Link className='w-25 h-12.5 bg-blue-500 my-3 ' to="/admin/">Orders</Link>
        <Link className='w-25 h-12.5 bg-blue-500 my-3 ' to="/admin/product">Products</Link>
        <Link className='w-25 h-12.5 bg-blue-500 my-3 ' to="/admin/users">Users</Link>
      </div>

      <div className='w-[calc(100%-300px)] h-full bg-amber-200'>
        <Routes>
            <Route path="/" element={<h1>Order Page</h1>} />
            <Route path="/product" element={<h1>Products Page</h1>} />
            <Route path="/users" element={<h1>Users Page</h1>} />
        </Routes>
      </div>
    </div>
  )
}
