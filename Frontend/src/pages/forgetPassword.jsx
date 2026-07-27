import React, { useState } from 'react'
import api from '../Utils/api'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function ForgetPassword() {
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState(1) // 1: Send OTP, 2: Reset Password
    const navigate = useNavigate()
    
    function sendOTP(e){
        e.preventDefault();
        if (!email) {
            return toast.error("Please enter your email");
        }
        setLoading(true);
        api.post("/users/otp", { email: email })
            .then((res) => {
                console.log(res);
                toast.success(res.data.message || "OTP sent successfully");
                setLoading(false);
                setStep(2);
            })
            .catch((err) => {
                console.log(err);
                toast.error(err?.response?.data?.message || "Failed to send OTP");
                setLoading(false);
            });
    }

    function handleResetPassword(e) {
        e.preventDefault();
        if (!otp || !password || !confirmPassword) {
            return toast.error("All fields are required");
        }
        if (password !== confirmPassword) {
            return toast.error("Passwords do not match");
        }
        setLoading(true);
        api.post("/users/reset-password", { email, otp, password })
            .then((res) => {
                console.log(res);
                toast.success(res.data.message || "Password reset successful");
                setLoading(false);
                navigate("/login");
            })
            .catch((err) => {
                console.log(err);
                toast.error(err?.response?.data?.message || "Failed to reset password");
                setLoading(false);
            });
    }

  return (
    <div>
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            {step === 1 ? "Forgot password" : "Reset Password"}
                        </h1>
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                            Don't have an account? <a href="/register" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a>
                        </p>
                        
                        {step === 1 ? (
                            <form className="space-y-4 md:space-y-6" onSubmit={sendOTP}>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        id="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        placeholder="name@company.com" 
                                        required
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-50"
                                >
                                    {loading ? "Sending..." : "Send OTP"}
                                </button>
                            </form>
                        ) : (
                            <form className="space-y-4 md:space-y-6" onSubmit={handleResetPassword}>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email Address</label>
                                    <input 
                                        type="email" 
                                        value={email}
                                        disabled
                                        className="bg-gray-100 border border-gray-300 text-gray-500 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="otp" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter OTP</label>
                                    <input 
                                        type="text" 
                                        name="otp" 
                                        id="otp" 
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        placeholder="Enter the 6-digit OTP" 
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New Password</label>
                                    <input 
                                        type="password" 
                                        name="password" 
                                        id="password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        placeholder="••••••••" 
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
                                    <input 
                                        type="password" 
                                        name="confirmPassword" 
                                        id="confirmPassword" 
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        placeholder="••••••••" 
                                        required
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-50"
                                >
                                    {loading ? "Resetting..." : "Reset Password"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    </div>
  )
}
