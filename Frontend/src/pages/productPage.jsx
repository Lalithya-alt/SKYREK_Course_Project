import React, { useEffect } from 'react'
import api from '../Utils/api'
import ProductCard from '../components/productCard' 

export default function ProductPage() {

    const [products, setProducts] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [searchQuery, setSearchQuery] = React.useState("")

    const fetchProducts = (query = "") => {
        setLoading(true);
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

      <div className='w-full px-4 sm:px-6 md:px-8 lg:px-10'>
        {loading && <h1 className='text-white text-center py-20 text-xl font-medium'>Loading products...</h1>}
        
        {!loading && products.length === 0 && <p className='text-white text-center py-20 text-lg'>No products found.</p>}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
            {products.map((product) => (
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
        )}
      </div>
    </div>
  )
}
