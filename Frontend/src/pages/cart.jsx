import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCart, AddToCart, RemoveFromCart, ClearCart, getTotalPrice, getTotalItems } from '../Utils/cart';
import { FaTrash, FaPlus, FaMinus, FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Load cart data
  const loadCart = () => {
    setCartItems(getCart());
    setTotalPrice(getTotalPrice());
    setTotalItems(getTotalItems());
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleQuantityChange = (product, change) => {
    AddToCart(product, change);
    loadCart();
    if (change > 0) {
      toast.success("Quantity increased");
    } else {
      toast.success("Quantity decreased");
    }
  };

  const handleRemove = (productId) => {
    RemoveFromCart(productId);
    loadCart();
    toast.success("Item removed from cart");
  };

  const handleClearCart = () => {
    ClearCart();
    loadCart();
    toast.success("Cart cleared");
  };

  return (
    <div className="w-full min-h-screen text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6 mb-8">
          <div className="flex items-center gap-3">
            <FaShoppingCart className="text-3xl text-accent" />
            <h1 className="text-3xl font-semibold tracking-tight text-accent">Your Shopping Cart</h1>
          </div>
          {cartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-sm font-semibold bg-red-500 p-2 rounded-md text-white hover:text-white hover:bg-red-500 transition duration-200 cursor-pointer"
            >
              Clear Cart
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="text-center py-16 px-4 bg-slate-900/50 rounded-3xl border border-slate-800 backdrop-blur-md">
            <FaShoppingCart className="mx-auto text-6xl text-slate-600 mb-4" />
            <h2 className="text-xl font-bold text-white-500 mb-2">Your cart is currently empty</h2>
            <p className="text-slate-200 mb-8">Add items to your cart to see them here.</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-linear-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/20"
            >
              <FaArrowLeft className="text-sm" />
              Continue Shopping
            </Link>
          </div>
        ) : (
          /* Cart Items & Summary */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const prod = item.product;
                if (!prod) return null;
                return (
                  <div
                    key={prod.productId}
                    className="flex flex-col sm:flex-row items-center gap-4 p-5 bg-slate-900 border border-slate-800 rounded-3xl backdrop-blur-md"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-20 border-2 border-white rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center p-2">
                      <img
                        src={prod.photo || "/default-product1.jpg"}
                        alt={prod.name}
                        className="w-full h-full object-cover rounded-xl"
                        onError={(e) => {
                          e.target.src = "/default-product1.jpg";
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 text-center sm:text-left min-w-0">
                      <h3 className="text-lg font-bold text-white truncate">{prod.name}</h3>
                      <p className="text-sm text-cyan-400 font-semibold mt-1">Rs. {prod.price}</p>
                    </div>

                    {/* Actions & Quantity */}
                    <div className="flex items-center gap-6">
                      <div className="flex items-center bg-slate-800 rounded-xl px-2 py-1 border border-slate-700">
                        <button
                          onClick={() => handleQuantityChange(prod, -1)}
                          className="p-1.5 text-slate-400 hover:text-white transition duration-200 cursor-pointer"
                        >
                          <FaMinus className="text-xs" />
                        </button>
                        <span className="px-3 font-semibold text-white text-sm">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(prod, 1)}
                          className="p-1.5 text-slate-400 hover:text-white transition duration-200 cursor-pointer"
                        >
                          <FaPlus className="text-xs" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemove(prod.productId)}
                        className="p-2 text-slate-400 hover:text-rose-400 hover:scale-105 transition-all duration-200 cursor-pointer"
                      >
                        <FaTrash className="text-base" />
                      </button>
                    </div>
                  </div>
                );
              })}

              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-300 transition duration-200 mt-4"
              >
                <FaArrowLeft className="text-xs" />
                Continue Shopping
              </Link>
            </div>

            {/* Summary */}
            <div className="p-6 bg-slate-900/90 rounded-3xl border border-slate-800 backdrop-blur-md h-fit space-y-6 shadow-xl shadow-slate-950/50">
              <h3 className="text-xl font-bold text-white border-b border-slate-800 pb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Total Items</span>
                  <span className="font-semibold text-slate-200">{totalItems}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white border-t border-slate-800 pt-4">
                  <span>Total Price</span>
                  <span className="text-cyan-400">Rs. {totalPrice}</span>
                </div>
              </div>

              <button
                onClick={() => toast.success("Checkout feature coming soon!")}
                className="w-full py-3.5 rounded-2xl bg-linear-to-r from-cyan-500 to-blue-600 text-white font-bold hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
