import { Link, useNavigate } from "react-router-dom";
import React from 'react';
import { toast } from 'react-hot-toast';
import { AddToCart } from '../Utils/cart';

export default function ProductCard({ name, price, labelledprice, photo, productId, description, brand, model, showImage = true }) {
  const navigate = useNavigate();

  const handleImageError = (e) => {
    e.target.src = "/default-product1.jpg";
  };

  const CardContainer = showImage ? Link : "div";

  return (
    <CardContainer 
      {...(showImage ? { to: "/ProductOverview/" + productId } : {})}
      className={`group relative overflow-hidden rounded-3xl transition-all duration-500 ${
        showImage ? "hover:-translate-y-3 hover:shadow-cyan-500/20" : ""
      }`}
    >
      
      {/* Glow Effect */}
      {showImage && (
        <div className="absolute inset-0 bg-linear-to-br from-cyan-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition duration-500"></div>
      )}

      {/* Product Image */}
      {showImage && (
        <div className="h-56 w-full flex items-center justify-center p-4">
          <img
            src={photo}
            alt={name}
            onError={handleImageError}
            className="h-full w-full object-cover rounded-2xl "
          />
        </div>
      )}

      {/* Product Details */}
      <div className="p-5 relative z-10">
        
        <h1 className="text-xl font-bold text-accent mb-3 items-center justify-center flex gap-2">
          {name}
        </h1>

        {/* Brand & Model */}
        {(brand || model) && (
          <div className="flex gap-2 text-xs font-semibold justify-center mb-3 uppercase tracking-wide">
            {brand && <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">{brand}</span>}
            {model && <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">{model}</span>}
          </div>
        )}

        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
          {description || "Premium quality product with modern features and elegant design."}
        </p>

        {/* Price Section */}
        <div className="mb-4 space-y-1">

        {/* Label Price (Original Price) */}
        {labelledprice && (
            <p className="text-sm font-medium text-gray-700 line-through">
            Label Price: Rs. {labelledprice}
            </p>
        )}

        {/* Product Price (Selling Price) */}
        <p className="text-base font-bold text-accent">
            Product Price: Rs. {price}
        </p>

        </div>
       

        {/* Buttons */}
        {!showImage ? (
          <div className="flex gap-3 w-full mt-4">
            <button
              className="flex-1 group relative overflow-hidden px-4 py-2.5 rounded-2xl bg-linear-to-br from-cyan-500 via-blue-600 to-indigo-700 text-white text-sm font-semibold hover:scale-105 active:scale-95 transition cursor-pointer"
              onClick={() => {
                const token = localStorage.getItem("token");
                if (!token) {
                  toast.error("Please log in first to purchase products.");
                  navigate("/login");
                  return;
                }
                if (!productId || !name || price === undefined || price === null) {
                  toast.error("Unable to purchase. Product details are missing.");
                  return;
                }
                const targetProduct = { productId, name, price, labelledprice, photo, description, brand, model };
                const directBuyItem = [{ product: targetProduct, quantity: 1 }];
                navigate("/checkout", { state: { cartItems: directBuyItem, isDirectBuy: true } });
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Buy Now
              </span>
            </button>
            <button
              className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold hover:scale-105 active:scale-95 transition cursor-pointer"
              onClick={() => {
                const token = localStorage.getItem("token");
                if (!token) {
                  toast.error("Please log in first to add items to your cart.");
                  navigate("/login");
                  return;
                }
                AddToCart({ productId, name, price, labelledprice, photo, description, brand, model }, 1);
                toast.success("Product added to cart");
              }}
            >
              Add to Cart
            </button>
          </div>
        ) : (
          <button
            className="w-full group relative overflow-hidden px-5 py-2.5 rounded-2xl bg-linear-to-br from-cyan-500 via-blue-600 to-indigo-700 text-white text-sm font-semibold cursor-pointer"
          >
            {/* Button Text */}
            <span className="relative z-10 flex items-center justify-center gap-2">
                Add to cart
                <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
                </svg>
            </span>
          </button>
        )}
      </div>
    </CardContainer>
  );
}