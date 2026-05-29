import React, { useEffect } from 'react'
import api from '../Utils/api'
import ProductCard from '../components/productCard' 

export default function ProductPage() {

    const [products, setProducts] = React.useState([])
    const [loading, setLoading] = React.useState(true)

    useEffect(() => {
        api.get("/products")
            .then((response) => {
                setProducts(response.data)  
                setLoading(false)
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
                setLoading(false);
            });
    }, []);

  return (
    <div className='w-full min-h-screen '>
      <div className='w-full px-4 sm:px-6 md:px-8 lg:px-10 pt-8 pb-16'>
        {loading && <h1 className='text-white text-center py-20'>Loading products...</h1>}
        
        {!loading && products.length === 0 && <p className='text-white text-center py-20'>No products found.</p>}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
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
