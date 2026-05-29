import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from '../components/header'
import HomePage from './homePage'


export default function homePage() {
  return (
    <div className='w-full h-screen'>
      <Header />


        <div className='w-full h-[calc(100%-100px)]  flex '>
        <Routes>
        <Route path='/' element={<h1>Home Page</h1>} />
          <Route path ="/products" element={<h1>Products Page</h1>} />
          <Route path = "/ContactUS" element={<h1>Contact Us Page</h1>} />
          <Route path = "/AboutUs" element={<h1>About Us Page</h1>} />
          <Route path = "/*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
        </div>
    </div>
  )
}

