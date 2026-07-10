import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getCart, AddToCart, RemoveFromCart, ClearCart, getTotalPrice, getTotalItems } from '../Utils/cart';
import { FaTrash, FaPlus, FaMinus, FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import CreateOrder from '../components/createOrder';

export default function CheckoutPage() {

  const location = useLocation();
  const stateCart = location.state?.cartItems;
  const isDirectBuy = location.state?.isDirectBuy || false;

  const isStateCorrupted = isDirectBuy && (!stateCart || stateCart.length === 0 || stateCart.some(item => !item?.product || !item.product.productId || !item.product.name || item.product.price === undefined));
  
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const loadCart = () => {
    if (isStateCorrupted) {
      setCartItems([]);
      setTotalPrice(0);
      setTotalItems(0);
      return;
    }
    const items = stateCart || getCart();
    setCartItems(items);
    
    const totalQty = items.reduce((total, item) => total + item.quantity, 0);
    const totalPriceVal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);
    
    setTotalPrice(totalPriceVal);
    setTotalItems(totalQty);
  };

  useEffect(() => {
    loadCart();
  }, [stateCart]);

  const handleQuantityChange = (product, change) => {
    if (isDirectBuy) {
      const updatedItems = cartItems.map((item) => {
        if (item.product.productId === product.productId) {
          const newQty = item.quantity + change;
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter((item) => item.quantity > 0);

      setCartItems(updatedItems);
      const totalQty = updatedItems.reduce((total, item) => total + item.quantity, 0);
      const totalPriceVal = updatedItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
      
      setTotalPrice(totalPriceVal);
      setTotalItems(totalQty);
      if (change > 0) {
        toast.success("Quantity increased");
      } else {
        toast.success("Quantity decreased");
      }
      return;
    }

    AddToCart(product, change);
    const items = getCart();
    setCartItems(items);
    setTotalPrice(getTotalPrice());
    setTotalItems(getTotalItems());
    if (change > 0) {
      toast.success("Quantity increased");
    } else {
      toast.success("Quantity decreased");
    }
  };

  const handleRemove = (productId) => {
    if (isDirectBuy) {
      const updatedItems = cartItems.filter((item) => item.product.productId !== productId);
      setCartItems(updatedItems);
      const totalQty = updatedItems.reduce((total, item) => total + item.quantity, 0);
      const totalPriceVal = updatedItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
      
      setTotalPrice(totalPriceVal);
      setTotalItems(totalQty);
      toast.success("Item removed from checkout");
      return;
    }

    RemoveFromCart(productId);
    const items = getCart();
    setCartItems(items);
    setTotalPrice(getTotalPrice());
    setTotalItems(getTotalItems());
    toast.success("Item removed from cart");
  };

  const handleClearCart = () => {
    if (isDirectBuy) {
      setCartItems([]);
      setTotalPrice(0);
      setTotalItems(0);
      toast.success("Checkout cleared");
      return;
    }

    ClearCart();
    setCartItems([]);
    setTotalPrice(0);
    setTotalItems(0);
    toast.success("Cart cleared");
  };
 
  return (
    <div className="w-full min-h-screen text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-10xl mx-auto">
        
        {isStateCorrupted ? (
          <div className="text-center py-16 px-4 bg-slate-900 rounded-3xl border border-slate-800 backdrop-blur-md">
            <FaShoppingCart className="mx-auto text-6xl text-rose-500/80 mb-4 animate-pulse" />
            <h2 className="text-xl font-bold text-rose-400 mb-2">Unable to process purchase</h2>
            <p className="text-slate-200 mb-8">Checkout details are unavailable because the product information is missing or corrupted.</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-linear-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/20"
            >
              <FaArrowLeft className="text-sm" />
              Return to Shop
            </Link>
          </div>
        ) : cartItems.length === 0 ? (
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
            {/* Table layout */}
            <div className="lg:col-span-2 space-y-4 animate-fade-in">
              <div className="w-full overflow-x-auto bg-slate-900/80 border border-slate-800 rounded-3xl backdrop-blur-md p-6 shadow-xl shadow-slate-950/30">
                <table className="w-full text-slate-100 min-w-150 border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      <th className="py-4 px-4 text-left">Product</th>
                      <th className="py-4 px-4 text-left">Price</th>
                      <th className="py-4 px-4 text-center">Quantity</th>
                      <th className="py-4 px-4 text-right">Subtotal</th>
                      <th className="py-4 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {cartItems.map((item) => {
                      const prod = item.product;
                      if (!prod) return null;
                      return (
                        <tr
                          key={prod.productId}
                          className="hover:bg-slate-800/20 transition-all duration-300 group"
                        >
                          {/* Product Info (Image + Details) */}
                          <td className="py-4 px-4 text-left align-middle">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 border border-slate-800 rounded-xl overflow-hidden shrink-0 flex items-center justify-center bg-slate-950/40 relative group-hover:border-cyan-500/30 transition-colors duration-300">
                                <img
                                  src={prod.photo || "/default-product1.jpg"}
                                  alt={prod.name}
                                  className="w-full h-full object-cover rounded-lg transition duration-500 group-hover:scale-105"
                                  onError={(e) => {
                                    e.target.src = "/default-product1.jpg";
                                  }}
                                />
                              </div>
                              <div className="min-w-0">
                                <h3 className="font-bold text-white text-sm sm:text-base leading-tight truncate max-w-50" title={prod.name}>
                                  {prod.name}
                                </h3>
                                {(prod.brand || prod.model) && (
                                  <p className="text-[10px] font-semibold text-slate-400 mt-1 uppercase tracking-wider flex gap-1.5">
                                    {prod.brand && <span className="bg-slate-950/60 px-1.5 py-0.5 rounded border border-slate-850">{prod.brand}</span>}
                                    {prod.model && <span className="bg-slate-950/60 px-1.5 py-0.5 rounded border border-slate-850">{prod.model}</span>}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Price */}
                          <td className="py-4 px-4 text-left align-middle font-medium text-slate-300">
                            Rs. {prod.price}
                          </td>

                          {/* Quantity Selector */}
                          <td className="py-4 px-4 text-center align-middle">
                            <div className="inline-flex items-center bg-slate-950/60 rounded-xl px-2.5 py-1 border border-slate-800 gap-3">
                              <button
                                onClick={() => handleQuantityChange(prod, -1)}
                                className="p-1 text-slate-450 hover:text-white transition duration-200 cursor-pointer"
                              >
                                <FaMinus className="text-[10px]" />
                              </button>
                              <span className="font-bold text-white text-xs sm:text-sm w-4 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(prod, 1)}
                                className="p-1 text-slate-450 hover:text-white transition duration-200 cursor-pointer"
                              >
                                <FaPlus className="text-[10px]" />
                              </button>
                            </div>
                          </td>

                          {/* Subtotal */}
                          <td className="py-4 px-4 text-right align-middle font-bold text-cyan-400">
                            Rs. {prod.price * item.quantity}
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-4 text-center align-middle">
                            <button
                              onClick={() => handleRemove(prod.productId)}
                              className="p-2 text-slate-500 hover:text-rose-400 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
                              title="Remove Item"
                            >
                              <FaTrash className="text-sm" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-300 transition duration-200 mt-4"
              >
                <FaArrowLeft className="text-xs" />
                Continue Shopping
              </Link>
            </div>

            {/* Summary */}
            <div className="p-6 bg-slate-900/90 rounded-3xl border border-slate-800 backdrop-blur-md h-fit space-y-6 shadow-xl shadow-slate-950/50 ">
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

             <CreateOrder cart={cartItems} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
