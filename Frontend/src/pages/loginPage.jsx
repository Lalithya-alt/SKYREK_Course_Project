import React, { useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { MdEmail } from 'react-icons/md'
import { PiPasswordBold } from 'react-icons/pi'
import api from '../Utils/api'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  async function handleLogin() {

    setIsLoading(true)

    try {
      // const res = await axios.post('http://localhost:3000/users/login', {
      //   email,
      //   password
      // })

      const res = await api.post('/users/login', {
        email,
        password
      })

      const token = res.data.token
      localStorage.setItem('token', token)

      if(res.data.isAdmin) {
       // window.location.href = "/admin"
        navigate('/admin')
      } else {
        // window.location.href = "/"
        navigate('/')
      }

      console.log(res.data)
      toast.success('Login successful')

    } catch (error) {
      console.log(error)
      toast.error( error?.response?.data?.message ||'Login failed')
    }
    setIsLoading(false)
  }

  return (
    <div className='relative w-full min-h-screen bg-[url("/login-bg.jpg")] bg-cover bg-center flex items-center justify-center px-4 overflow-hidden'>

      {/* Overlay */}
      <div className='absolute inset-0 bg-black/60'></div>

      {/* Glow */}
      <div className='absolute top-20 left-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl'></div>
      <div className='absolute bottom-10 right-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl'></div>

      {/* Card */}
      <div className='relative z-10 w-full max-w-md rounded-3xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-2xl p-10 flex flex-col gap-7'>

        <div className='text-center'>
          <h1 className='text-5xl font-extrabold text-white tracking-wide'>
            Welcome
          </h1>
          <p className='text-gray-300 mt-3 text-sm tracking-wide'>
            Sign in to your account
          </p>
        </div>

        {/* Email */}
        <div className='flex flex-col gap-2'>
          <label className='text-white text-sm font-semibold'>
            Email Address
          </label>

          <div className='flex items-center h-14 px-4 rounded-2xl bg-white/10 border border-white/20 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/40 transition'>
            <MdEmail className='text-white text-2xl mr-3' />

            <input
              type='email'
              placeholder='Enter your email'
              className='w-full bg-transparent text-white placeholder:text-gray-300 outline-none'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
        </div>

        {/* Password */}
        <div className='flex flex-col gap-2'>
          <label className='text-white text-sm font-semibold'>
            Password
          </label>

          <div className='flex items-center h-14 px-4 rounded-2xl bg-white/10 border border-white/20 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/40 transition'>
            <PiPasswordBold className='text-white text-2xl mr-3' />

            <input
              type='password'
              placeholder='Enter your password'
              className='w-full bg-transparent text-white placeholder:text-gray-300 outline-none'
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
        </div>

        {/* Remember */}
        <div className='flex items-center justify-between text-sm text-white'>
          <label className='flex items-center gap-2 cursor-pointer'>
            <input type='checkbox' className='accent-cyan-500 w-4 h-4' />
            Remember me
          </label>

          <a href='#' className='hover:text-cyan-300'>
            Forgot Password?
          </a>
        </div>

        {/* Button */}
        <button disabled={isLoading}
          className='w-full h-14 rounded-2xl bg-linear-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg hover:scale-[1.02] transition'
          onClick={handleLogin}
        >
          {
            isLoading ?"Loading..." : "login"  
          }
        </button>

        {/* Footer */}
        <p className='text-center text-gray-300 text-sm'>
          Don’t have an account?{' '}
          <span className='text-cyan-300 cursor-pointer hover:underline'>
            Register
          </span>
        </p>

      </div>
    </div>
  )
}