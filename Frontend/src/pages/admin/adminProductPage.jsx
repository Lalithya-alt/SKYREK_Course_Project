import React, { useState, useEffect } from 'react'
import { BiSolidCartAdd } from "react-icons/bi";
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../Utils/api';

export default function adminProductPage() {

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await api.get('/products');
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        toast.error("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className='w-full h-full p-6'>
        
        <h2 className="text-2xl font-bold mb-4">Product List</h2>

        {isLoading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {products.map((product, index) => (
              <div 
                key={product.productId || index} 
                className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex justify-between items-center"
              >
                <span><strong>{product.productId}</strong> - {product.name}</span>
                <span className="text-slate-500 font-semibold">${product.price}</span>
              </div>
            ))}
          </div>
        )}

        <Link to ="/admin/products/add" className='bg-accent w-15 h-15 rounded-full text-white text-4xl flex justify-center items-center fixed bottom-10 right-10 shadow-2xl hover:bg-[#0041C2]'>
            <BiSolidCartAdd />
        </Link>
    </div>
  )
}

