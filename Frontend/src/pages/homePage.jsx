import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from '../components/header'
import ProductPage from './productPage'
import ProductOverview from './productOverview'
import CartPage from './cart'
import Checkout from './checkout'
import MyOrders from './MyOrders'
import Settings from '../components/settings'
import LandingComponent from './landingcomponent'


export default function HomePage() {
  return (
    <div className='w-full h-screen'>
      <Header />


        <div className='w-full h-[calc(100%-100px)]  flex '>
        <Routes>
          <Route path='/' element={<LandingComponent />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/ContactUS" element={<h1>Contact Us Page</h1>} />
          <Route path="/AboutUs" element={<h1>About Us Page</h1>} />
          <Route path="/Services" element={<h1>Services Page</h1>} />
          <Route path="/ProductOverview/:productId" element={<ProductOverview />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path ='/myOrders' element={<MyOrders/>} />
          <Route path ='settings' element={<Settings/>} />
          <Route path="/*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
        </div>
    </div>
  )
}


