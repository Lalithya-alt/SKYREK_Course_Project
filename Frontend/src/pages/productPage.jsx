import React, { useEffect } from 'react'
import api from '../Utils/api'
import ProductCard from '../components/productCard' 

export default function ProductPage() {

    const [products, setProducts] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [categoryPages, setCategoryPages] = React.useState({})
    const [windowWidth, setWindowWidth] = React.useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

    const categoryOrder = [
        "SmartPhones",
        "Laptops",
        "Headphones",
        "Graphic Card",
        "Motherboard",
        "CPU",
        "RAM",
        "Storage"
    ];

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getPageSize = () => {
        if (windowWidth < 640) return 1; // mobile
        if (windowWidth < 1024) return 2; // tablet
        return 5; // desktop
    };

    const currentPageSize = getPageSize();

    const fetchProducts = (query = "") => {
        setLoading(true);
        setCategoryPages({});
        const endpoint = query.trim() 
            ? `/products/search?query=${encodeURIComponent(query.trim())}` 
            : "/products";
        api.get(endpoint)
            .then((response) => {
                setProducts(response.data)  
                setLoading(false)
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
                setProducts([]);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProducts(searchQuery);
    };

    const handleClearSearch = () => {
        setSearchQuery("");
        fetchProducts("");
    };

    const handlePrevPage = (category, currentPage) => {
        setCategoryPages((prev) => ({
            ...prev,
            [category]: Math.max(currentPage - 1, 0)
        }));
    };

    const handleNextPage = (category, currentPage, totalPages) => {
        setCategoryPages((prev) => ({
            ...prev,
            [category]: Math.min(currentPage + 1, totalPages - 1)
        }));
    };

    const groupedProducts = React.useMemo(() => {
        const groups = {};
        products.forEach((product) => {
            const category = product.category || "Other";
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(product);
        });
        return groups;
    }, [products]);

    const orderedCategories = React.useMemo(() => {
        const presentCategories = Object.keys(groupedProducts);
        return [
            ...categoryOrder.filter(cat => presentCategories.includes(cat)),
            ...presentCategories.filter(cat => !categoryOrder.includes(cat))
        ];
    }, [groupedProducts]);

  return (
    <div className='w-full min-h-screen pt-14 pb-10'>

      {/* Search Bar */}
      <div className='max-w-md mx-auto mb-10 px-4'>
        <form onSubmit={handleSearch} className='flex items-center gap-3'>
          <div className='relative flex-1'>
            <input
              type='text'
              placeholder='Search products...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full h-12 pl-11 pr-10 rounded-2xl border border-blue-900 bg-white text-blue-900 placeholder:text-blue-900/50 focus:outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-900/20 text-sm shadow-md transition'
            />
            <div className='absolute left-4 top-1/2 -translate-y-1/2 text-blue-900/60'>
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'></path>
              </svg>
            </div>
            {searchQuery && (
              <button
                type='button'
                onClick={handleClearSearch}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-blue-900/60 hover:text-blue-900 transition cursor-pointer'
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12'></path>
                </svg>
              </button>
            )}
          </div>
          <button
            type='submit'
            className='h-12 px-6 rounded-2xl bg-linear-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer shadow-lg'
          >
            Search
          </button>
        </form>
      </div>

      <div className='w-full px-4 sm:px-6 md:px-8 lg:px-10 space-y-12'>
        {loading && <h1 className='text-white text-center py-20 text-xl font-medium'>Loading products...</h1>}
        
        {!loading && products.length === 0 && <p className='text-white text-center py-20 text-lg'>No products found.</p>}
        
        {!loading && products.length > 0 && orderedCategories.map((category) => {
          const categoryProducts = groupedProducts[category] || [];
          if (categoryProducts.length === 0) return null;

          const totalPages = Math.ceil(categoryProducts.length / currentPageSize);
          const rawPage = categoryPages[category] || 0;
          const currentPage = Math.min(rawPage, Math.max(totalPages - 1, 0));
          const displayedProducts = categoryProducts.slice(currentPage * currentPageSize, (currentPage + 1) * currentPageSize);

          return (
            <div key={category} className="space-y-1">
              {/* Category Header */}
              <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-bold text-blue tracking-wide bg-linear-to-r from-blue-500 to-blue-900 bg-clip-text text-transparent">
                    {category}
                  </h2>
                  <span className="text-xs text-slate-350 font-semibold bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    {categoryProducts.length} {categoryProducts.length === 1 ? 'Product' : 'Products'}
                  </span>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handlePrevPage(category, currentPage)}
                      disabled={currentPage === 0}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-35 disabled:hover:bg-transparent transition cursor-pointer"
                      aria-label="Previous Page"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d="M15 19l-7-7 7-7"></path>
                      </svg>
                    </button>
                    <span className="text-sm text-slate-300 font-semibold min-w-8 text-center">
                      {currentPage + 1} / {totalPages}
                    </span>
                    <button
                      onClick={() => handleNextPage(category, currentPage, totalPages)}
                      disabled={currentPage >= totalPages - 1}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-35 disabled:hover:bg-transparent transition cursor-pointer"
                      aria-label="Next Page"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d="M9 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Horizontal Grid with Left/Right Navigation Arrows */}
              <div className="relative group/row px-1 sm:px-0">
                {/* Left Arrow Button */}
                {currentPage > 0 && (
                  <button
                    onClick={() => handlePrevPage(category, currentPage)}
                    className="absolute left-2 md:-left-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-slate-950/90 border border-slate-700 text-white shadow-2xl hover:bg-cyan-500 hover:border-cyan-400 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center"
                    aria-label="Previous Page"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path>
                    </svg>
                  </button>
                )}

                {/* Grid List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
                  {displayedProducts.map((product) => (
                    <ProductCard 
                      key={product.productId} 
                      productId={product.productId}
                      name={product.name} 
                      price={product.price}
                      labelledprice={product.labelledprice}
                      photo={product.Images && product.Images.length > 0 ? product.Images[0] : "/default-product1.jpg"}
                      description={product.description}
                    />
                  ))}
                </div>

                {/* Right Arrow Button */}
                {currentPage < totalPages - 1 && (
                  <button
                    onClick={() => handleNextPage(category, currentPage, totalPages)}
                    className="absolute right-2 md:-right-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-slate-955/90 border border-slate-700 text-white shadow-2xl hover:bg-cyan-500 hover:border-cyan-400 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center"
                    aria-label="Next Page"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}
