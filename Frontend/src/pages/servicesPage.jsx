import React from 'react';
import { FaSearch, FaLock, FaStar, FaHeart } from 'react-icons/fa';

export default function ServicesPage() {
  const services = [
    {
      title: "Product Browsing & Search",
      description: "Find exactly what you need in seconds with our advanced filtering options, smart search bars, and categorized collections.",
      icon: <FaSearch className="w-8 h-8 text-white" />
    },
    {
      title: "Secure Online Ordering",
      description: "Enjoy a protected shopping environment with encrypted data transfer, automated confirmation, and seamless cart operations.",
      icon: <FaLock className="w-8 h-8 text-white" />
    },
    {
      title: "Product Reviews & Ratings",
      description: "Make informed choices by reading verified reviews and ratings left by members of the Digital Mart shopping community.",
      icon: <FaStar className="w-8 h-8 text-white" />
    },
    {
      title: "Wishlist Management",
      description: "Save items you love, organize custom purchase lists, and receive notifications when prices drop or items restock.",
      icon: <FaHeart className="w-8 h-8 text-white" />
    }
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6 py-16 flex-1 w-full">
        {/* Header Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full w-96 h-96 -top-20 left-1/2 -translate-x-1/2 pointer-events-none"></div>
          <span className="text-xs uppercase tracking-[4px] text-blue-600 font-bold bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100 shadow-xs animate-pulse">
            Our Offerings
          </span>
          <h1 className="text-4xl md:text-6xl font-black mt-6 tracking-tight bg-linear-to-r from-slate-900 via-blue-900 to-indigo-950 bg-clip-text text-transparent">
            Premium Platform Services
          </h1>
          <p className="mt-4 text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            We provide a reliable, efficient, and secure ecosystem for all your tech and electronics shopping needs.
          </p>
        </div>

        {/* Grid List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="group relative overflow-hidden rounded-3xl bg-linear-to-br from-zinc-950 via-slate-900 to-black text-white p-8 transition-all duration-300 hover:-translate-y-2 shadow-lg hover:shadow-2xl border border-white/5 hover:border-cyan-500/20"
            >
              {/* Card Hover Radial Background */}
              <div className="absolute inset-0 bg-radial from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>
              
              {/* Icon Container */}
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                {service.icon}
              </div>

              {/* Card Title */}
              <h3 className="text-xl font-bold mt-6 text-white tracking-wide group-hover:text-cyan-200 transition duration-300">
                {service.title}
              </h3>

              {/* Card Description */}
              <p className="mt-4 text-sm text-blue-100 leading-relaxed font-light">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
