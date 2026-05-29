import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from '../components/header'
import ProductPage from './productPage'
import ProductOverview from './productOverview'
import CartPage from './cart'


export default function HomePage() {
  return (
    <div className='w-full h-screen'>
      <Header />


        <div className='w-full h-[calc(100%-100px)]  flex '>
        <Routes>
        <Route path='/' element={<h1>Home Page</h1>} />
          <Route path ="/products" element={<ProductPage />} />
          <Route path = "/ContactUS" element={<h1>Contact Us Page</h1>} />
          <Route path = "/AboutUs" element={<h1>About Us Page</h1>} />
          <Route path = "/Services" element={<h1>Services Page</h1>} />
          <Route path = "/ProductOverview/:productId" element={<ProductOverview />} />
          <Route path = "/*" element={<h1>404 - Page Not Found</h1>} />
          <Route path ="/cart" element={<CartPage />}/>
        </Routes>
        </div>
    </div>
  )
}


