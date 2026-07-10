export default function Header() {
  return (
    <div className="h-25 w-full bg-linear-to-br from-zinc-950 via-slate-900 to-black text-white flex">
      
      {/* Header */}
      <header className="relative z-10 w-full border-b border-white/10 backdrop-blur-xl bg-white/5">
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

              <p className="text-sm text-gray-300 tracking-[3px] uppercase">
                e-commerce Platform
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-10 text-sm font-medium">
            <a href="/" className="hover:text-cyan-400 transition duration-300">
              Home
            </a>

            <a  href="/products" className="hover:text-cyan-400 transition duration-300">
              Products
            </a>

            <a  href="/cart" className="hover:text-cyan-400 transition duration-300">
              Cart
            </a>

            <a href="#" className="hover:text-cyan-400 transition duration-300">
              Services
            </a>

            <a  href="#" className="hover:text-cyan-400 transition duration-300">
              Contact
            </a>
          </nav>

          {/* Button */}
          <button className="px-5 py-2.5 rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 hover:scale-105 hover:shadow-cyan-500/30 hover:shadow-lg transition duration-300 font-semibold" onClick={() => window.location.href = '/login'}>
            Log in
          </button>
        </div>
      </header>

     
    </div>
  );
}