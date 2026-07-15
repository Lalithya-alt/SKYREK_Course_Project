import React, { useState } from 'react'
import { Link, Routes, Route } from 'react-router-dom'
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa"
import { BsFillGiftFill } from "react-icons/bs"
import { FaUserTie } from "react-icons/fa"
import AdminProductPage from './admin/adminProductPage'
import AdminAddProductForm from './admin/adminAddProductForm'
import AdminEditProductForm from './admin/adminEditProductForm'
import AdminOrdersPage from './admin/adminOrdersPage'

export default function AdminPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className='w-full h-screen flex bg-slate-50 overflow-hidden relative'>
      
      {/* Mobile Drawer Overlay */}
      {isSidebarOpen && (
        <div 
          className='fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-xs'
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <div className={`fixed md:relative top-0 left-0 h-full w-64 bg-white flex flex-col shadow-2xl z-50 transition-transform duration-300 md:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Logo and Mobile Close Button */}
        <div className='w-full h-32 relative border-b border-gray-100 flex items-center justify-center px-6'>
          <img src='/logo.png' className='h-24 w-full object-contain' alt="logo" />
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className='md:hidden p-2 text-gray-500 hover:text-red-500 transition-colors absolute top-4 right-4'
            aria-label="Close menu"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <nav className='flex-1 py-4 flex flex-col gap-1'>
          <Link 
            to={"/admin/"} 
            onClick={() => setIsSidebarOpen(false)}
            className='flex items-center gap-4 px-6 py-4 text-slate-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors font-semibold text-lg border-l-4 border-transparent hover:border-cyan-500'
          >
            <FaShoppingCart size={20} />
            <span>Orders</span>
          </Link>

          <Link 
            to={"/admin/products"} 
            onClick={() => setIsSidebarOpen(false)}
            className='flex items-center gap-4 px-6 py-4 text-slate-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors font-semibold text-lg border-l-4 border-transparent hover:border-cyan-500'
          >
            <BsFillGiftFill size={20} />
            <span>Products</span>
          </Link>

          <Link 
            to={"/admin/users"} 
            onClick={() => setIsSidebarOpen(false)}
            className='flex items-center gap-4 px-6 py-4 text-slate-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors font-semibold text-lg border-l-4 border-transparent hover:border-cyan-500'
          >
            <FaUserTie size={20} />
            <span>Users</span>
          </Link>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className='flex-1 h-full flex flex-col overflow-hidden'>
        
        {/* Mobile Top Header */}
        <div className='md:hidden w-full h-16 bg-white border-b border-gray-200 flex items-center px-6 justify-between shrink-0 shadow-sm z-30'>
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className='p-2 text-slate-700 hover:text-cyan-500 transition-colors'
            aria-label="Open menu"
          >
            <FaBars size={24} />
          </button>
          <span className='font-bold text-slate-800 text-lg'>Admin Dashboard</span>
          <div className='w-10 h-10'></div> {/* Spacer to center the title */}
        </div>

        {/* Dynamic Route Content */}
        <div className='flex-1 overflow-auto p-4 md:p-8 bg-slate-50'>
          <Routes>
            <Route path='/' element={<AdminOrdersPage/>} />
            <Route path="products" element={<AdminProductPage/>} />
            <Route path="users" element={<h1 className="text-2xl font-bold text-slate-800">Users Page</h1>} />
            <Route path="products/add" element={<AdminAddProductForm/>} />
            <Route path="products/:id/edit" element={<AdminEditProductForm/>} />
          </Routes>
        </div>
      </div>
    </div>
  )
}
