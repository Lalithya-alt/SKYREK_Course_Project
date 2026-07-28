import React, { useState } from "react";
import { MdMenu, MdClose } from "react-icons/md";
import UserData from "./userData.jsx";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="h-25 w-full bg-linear-to-br from-zinc-950 via-slate-900 to-black text-white flex relative">
      
      {/* Header */}
      <header className="relative z-20 w-full border-b border-white/10 backdrop-blur-xl bg-white/5">
        <div className="max-w-7xl mx-auto h-22.5 px-6 flex items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-400 blur-xl opacity-40 rounded-full"></div>
              <img src="/logo.png" alt="logo" className="relative h-[65px] w-[65px] object-cover rounded-2xl border border-white/20 shadow-2xl" />
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-wide bg-linear-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
                Digital Mart
              </h1>
              <p className="text-xs md:text-sm text-gray-300 tracking-[3px] uppercase">
                e-commerce Platform
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10 text-sm font-medium">
            <a href="/" className="hover:text-cyan-400 transition duration-300">
              Home
            </a>
            <a href="/products" className="hover:text-cyan-400 transition duration-300">
              Products
            </a>
            {localStorage.getItem("token") && (
              <a href="/cart" className="hover:text-cyan-400 transition duration-300">
                Cart
              </a>
            )}
            <a href="/Services" className="hover:text-cyan-400 transition duration-300">
              Services
            </a>
            <a href="/ContactUS" className="hover:text-cyan-400 transition duration-300">
              Contact
            </a>
          </nav>

          {/* Right Section (User & Menu Toggle) */}
          <div className="flex items-center gap-4">
            <UserData />
            
            {/* Hamburger Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-white hover:text-cyan-400 transition duration-300 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <MdClose size={28} /> : <MdMenu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-22.5 left-0 w-full bg-slate-950/95 border-b border-white/10 backdrop-blur-xl z-50 flex flex-col p-6 gap-4 shadow-2xl transition duration-300">
            <a 
              href="/" 
              onClick={() => setIsMenuOpen(false)}
              className="text-lg font-medium hover:text-cyan-400 transition duration-200 py-2 border-b border-white/5"
            >
              Home
            </a>
            <a 
              href="/products" 
              onClick={() => setIsMenuOpen(false)}
              className="text-lg font-medium hover:text-cyan-400 transition duration-200 py-2 border-b border-white/5"
            >
              Products
            </a>
            {localStorage.getItem("token") && (
              <a 
                href="/cart" 
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-medium hover:text-cyan-400 transition duration-200 py-2 border-b border-white/5"
              >
                Cart
              </a>
            )}
            <a 
              href="/Services" 
              onClick={() => setIsMenuOpen(false)}
              className="text-lg font-medium hover:text-cyan-400 transition duration-200 py-2 border-b border-white/5"
            >
              Services
            </a>
            <a 
              href="/ContactUS" 
              onClick={() => setIsMenuOpen(false)}
              className="text-lg font-medium hover:text-cyan-400 transition duration-200 py-2"
            >
              Contact
            </a>
          </div>
        )}
      </header>
    </div>
  );
}