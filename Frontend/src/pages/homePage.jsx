import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Header from '../components/header'
import ProductPage from './productPage'
import ProductOverview from './productOverview'
import CartPage from './cart'
import Checkout from './checkout'
import MyOrders from './MyOrders'
import Settings from '../components/settings'
import LandingComponent from './landingcomponent'
import ServicesPage from './servicesPage'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function HomePage() {
  return (
    <div className='w-full h-screen'>
      <Header />


        <div className='w-full h-[calc(100%-100px)]  flex '>
        <Routes>
          <Route path='/' element={<LandingComponent />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/ContactUS" element={<h1>Contact Us Page</h1>} />
          <Route path="/Services" element={<ServicesPage />} />
          <Route path="/ProductOverview/:productId" element={<ProductOverview />} />
          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path ='/myOrders' element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
          <Route path ='settings' element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
        </div>
    </div>
  )
}


