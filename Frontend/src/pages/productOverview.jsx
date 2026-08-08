import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../Utils/api'
import ProductCard from '../components/productCard'
import ProductImageSlideshow from '../components/productimageSlideshow'

export default function ProductOverview() {
const parameters = useParams();
const navigate = useNavigate();

const productId = parameters.productId;

const [product, setProducts] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
    if (!productId) {
        navigate("/products");
        return;
    }
    api.get("/products/" + productId)
    .then((response) => {
        console.log(response.data)
        setProducts(response.data)
        setLoading(false)
    }).catch((error) => {
        console.error("error fetching product Overview" ,error)
        setLoading(false)
        navigate("/products")
    })
}, [productId, navigate])

const products = product ? [product] : [];

  return (
    <div className="flex flex-col md:flex-row w-full h-full p-4 md:p-8 gap-6 md:gap-8">

        {loading && <h1>Loading products...</h1>}
        {!loading && products.length === 0 && <p className='text-white text-center py-20'>No products found.</p>}
        {!loading && products.length > 0 && (
          <>
            {/*ProductImage */}
            <div className="w-full md:w-1/2 h-full">
              {products.map((product) => (
                <ProductImageSlideshow 
                  key={product.productId || product._id}
                  images={product.Images}
                />
              ))}
            </div>

            {/*ProductDetails */}
            <div className="w-full md:w-1/2 flex items-start justify-start">
              {products.map((product) => (
                <ProductCard 
                  key={product.productId || product._id}
                  productId={product.productId}
                  name={product.name}
                  brand={product.brand}
                  model={product.model}
                  description={product.description}
                  price={product.price}
                  labelledprice={product.labelledprice}
                  photo={product.Images && product.Images.length > 0 ? product.Images[0] : "/default-product1.jpg"}
                  showImage={false}
                />
              ))}
            </div>
          </>
        )}
       
    </div>
  )
}
