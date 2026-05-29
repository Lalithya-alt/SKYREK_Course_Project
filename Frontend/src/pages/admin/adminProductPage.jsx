import React, { useState, useEffect } from 'react'
import { BiSolidCartAdd } from "react-icons/bi";
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../Utils/api';
import LoadingScreen from '../../components/LoadingScreen';
import ProductDeleteButton from '../../components/productDeleteButton';

export default function adminProductPage() {

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to view products");  
        return;
      }
      const res = await api.get('/products', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className='w-full h-full p-6'>
        
        <div className="mb-8">
          <h2 className="text-4xl font-extrabold bg-linear-to-r from-[#0c1572] to-cyan-600 bg-clip-text text-transparent mb-2">
            Product Management
          </h2>
          <p className="text-gray-500 text-sm">Manage and oversee all products</p>
        </div>

        {isLoading ? (
          <LoadingScreen />
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl shadow-2xl">
            <table className="w-full border-collapse min-w-max">
              <thead>
                <tr className="bg-linear-to-r from-[#060c4e] to-blue-500 text-white">
                  <th className="p-4 text-left font-bold">Image</th>
                  <th className="p-4 text-left font-bold">Product ID</th>
                  <th className="p-4 text-left font-bold">Name</th>
                  <th className="p-4 text-left font-bold">Price</th>
                  <th className="p-4 text-left font-bold">Labelled Price</th>
                  <th className="p-4 text-left font-bold">Brand</th>
                  <th className="p-4 text-left font-bold">Model</th>
                  <th className="p-4 text-left font-bold">Category</th>
                  <th className="p-4 text-left font-bold">Status</th>
                  <th className="p-4 text-left font-bold">Stock</th>
                  <th className="p-4 text-left font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {products.map((product, index) => (
                  <tr 
                    key={product.productId} 
                    className={`border-b border-blue-100 transition-all duration-300 hover:shadow-lg hover:bg-linear-to-r hover:from-blue-50 hover:to-cyan-50 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'
                    }`}
                  >
                    <td className="p-4">
                      <img 
                        src={product.Images?.[0] || '/default-product1.jpg'} 
                        alt={product.name} 
                        className="w-16 h-16 object-cover rounded-xl border-2 border-blue-200 shadow-md hover:shadow-lg transition-shadow" 
                      />
                    </td>
                    <td className="p-4 font-semibold text-blue-700">{product.productId}</td>
                    <td className="p-4 font-medium text-gray-800 max-w-xs truncate">{product.name}</td>
                    <td className="p-4">
                      <span className="bg-linear-to-r from-green-100 to-emerald-100 text-green-700 font-bold px-3 py-1 rounded-full text-sm">
                        LKR{(product.price ?? 0).toFixed(2)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-600 font-semibold">
                        LKR{(product.labelledprice ?? 0).toFixed(2)}
                      </span>
                    </td>
                    <td className="p-4 text-gray-700 font-medium">{product.brand || 'N/A'}</td>
                    <td className="p-4 text-gray-600">{product.model || 'N/A'}</td>
                    <td className="p-4">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {product.category || 'N/A'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        product.isavailable 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {product.isavailable ? '✓ In Stock' : '✕ Out'}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-center">
                      <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-lg inline-block">
                        {product.stock ?? 0}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Link 
                          to={`/admin/products/${product.productId}/edit`}
                          state={{ product }}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
                        >
                          Edit
                        </Link>
                        <ProductDeleteButton productId={product.productId} onRefresh={fetchProducts} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Link to="/admin/products/add" className='bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 w-16 h-16 rounded-full text-white text-4xl flex justify-center items-center fixed bottom-10 right-10 shadow-2xl transition-all duration-300 hover:scale-110'>
            <BiSolidCartAdd />
        </Link>
    </div>
  )
}

