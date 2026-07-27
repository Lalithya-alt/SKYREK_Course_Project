import React, { useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { MdEmail } from 'react-icons/md'
import { PiPasswordBold } from 'react-icons/pi'
import api from '../Utils/api'
import { useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'


export default function LoginPage() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const googlelogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const googleUserRes = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`
          }
        });
        
        const { email, given_name, family_name, picture } = googleUserRes.data;

        const res = await api.post('/users/google-login', {
          email,
          firstName: given_name,
          lastName: family_name,
          image: picture
        });

        const token = res.data.token;
        localStorage.setItem('token', token);

        toast.success('Login successful');
        
        if (res.data.isAdmin) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message || 'Google Login failed');
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google login failed:', error);
      toast.error('Google login failed');
    }
  });

  const navigate = useNavigate()

  async function handleLogin() {

    setIsLoading(true)

    try {
     
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

          <a href='/forgetPassword' className='hover:text-cyan-300'>
            Forgot Password?
          </a>
        </div>

        {/* Button */}
        <button disabled={isLoading}
          className='w-full h-14 rounded-2xl bg-linear-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg hover:scale-[1.02] transition cursor-pointer'
          onClick={handleLogin}
        >
          {
            isLoading ?"Loading..." : "login"  
          }
        </button>

        {/* Google Login Button */}
        <button
          type="button"
          disabled={isLoading}
          onClick={() => googlelogin()}
          className='w-full h-14 rounded-2xl bg-white text-slate-800 font-bold text-base hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-3 shadow-lg cursor-pointer border border-slate-200'
        >
          <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </button>

        {/* Footer */}
        <p className='text-center text-gray-300 text-sm'>
          Don’t have an account?{' '}
          <span className='text-cyan-300 cursor-pointer hover:underline' onClick={() => navigate('/register')}>
            Register
          </span>
        </p>

      </div>
    </div>
  )
}