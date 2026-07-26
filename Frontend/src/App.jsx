import './App.css'
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import HomePage from './pages/homePage'
import RegisterPage from './pages/registerPage'
import LoginPage from './pages/loginPage'
import AdminPage from './pages/adminPage'
import Test from './pages/test'
import { GoogleOAuthProvider } from '@react-oauth/google'


export default function App() {
  return (
    <GoogleOAuthProvider clientId="211210550527-npfd1ifrqle4oomdlnhjo2ujd325botj.apps.googleusercontent.com">

    <div className='w-full h-screen'>
      <Toaster position='top-right' containerStyle={{ zIndex: 99999 }} />
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/*' element={<HomePage />} />
        <Route path='/admin/*' element={<AdminPage />} />
        <Route path='/test' element={<Test />} />
        
      </Routes>
    </div>

  </GoogleOAuthProvider>
  )
}
