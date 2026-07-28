import React from 'react'

export default function LandingComponent() {
  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-950">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/For_a_React_website_hero_secti.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-slate-950/70 z-10 backdrop-blur-[1px]"></div>

      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full w-full px-6 text-center text-white">
        
        {/* Glow Badge */}
        <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs md:text-sm font-semibold tracking-wider uppercase shadow-[0_0_15px_rgba(6,182,212,0.15)] animate-pulse">
          <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
          premium shopping destination
        </div>

        {/* Hero Welcome Text */}
        <h1 className="text-4xl md:text-7xl font-black tracking-tight max-w-4xl leading-tight">
          welcome <br className="md:hidden" />
          <span className="bg-linear-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(6,182,212,0.2)]">
            Digital Mart
          </span> <br className="hidden md:inline" />
          ecommece web site
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-2xl font-light leading-relaxed">
          Discover a curated selection of next-generation gadgets, premium electronics, and an unparalleled shopping experience built for you.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="/products"
            className="px-8 py-4 rounded-xl font-bold bg-linear-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] cursor-pointer"
          >
            Explore Products
          </a>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 opacity-60 animate-bounce">
          <span className="text-xs uppercase tracking-[3px] text-slate-400 font-medium">Scroll Down</span>
          <div className="w-5 h-8 rounded-full border-2 border-slate-400 flex justify-center p-1">
            <div className="w-1 h-2 rounded-full bg-cyan-400"></div>
          </div>
        </div>

      </div>
    </div>
  )
}
