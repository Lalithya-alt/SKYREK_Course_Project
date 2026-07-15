import React, { useState } from 'react';
import { FaEye } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import api from '../Utils/api';
import toast from 'react-hot-toast';

export default function AdminOrderData({ order, refresh, isAdmin }) {
    const [isOpen, setIsOpen] = useState(false);
    const [orderStatus, setOrderStatus] = useState(order.status || 'pending');
    const [isUpdating, setIsUpdating] = useState(false);

    const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    const handleStatusUpdate = async () => {
        if (orderStatus === order.status) {
            toast.error('Please select a different status');
            return;
        }

        setIsUpdating(true);
        try {
            const token = localStorage.getItem("token");
            const res = await api.put(`/orders/${order.orderId}`, 
                { status: orderStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            if (res.status === 200) {
                toast.success('Order status updated successfully');
                refresh();
                setIsOpen(false);
            }
        } catch (error) {
            console.error("Error updating order status:", error);
            toast.error(error.response?.data?.error || 'Failed to update order status');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <>

            <button
                onClick={() => setIsOpen(true)}
                title="View order"
                className="text-blue-600 hover:text-blue-800 p-2 rounded-md transition-colors"
            >
                <FaEye size={18} />
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="w-full max-w-2xl max-h-[85vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden">
                        
                        {/* Header */}
                        <div className="bg-linear-to-r from-[#060c4e] to-blue-500 text-white p-6 flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-extrabold">Order Details</h3>
                                <p className="text-blue-100 text-sm mt-1">Order ID: {order.orderId}</p>
                            </div>
                            <button 
                                className="text-white hover:bg-white/20 p-2 rounded-full transition-colors duration-200"
                                onClick={() => setIsOpen(false)}
                                title="Close"
                            >
                                <MdClose size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="overflow-y-auto flex-1 p-6">
                            {/* Customer Info */}
                            <div className="bg-blue-50/50 rounded-xl p-4 mb-6 border border-blue-100">
                                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
                                    Customer Information
                                </h4>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide">Name</p>
                                        <p className="text-gray-800 font-semibold">{order.firstName} {order.lastName}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide">Email</p>
                                        <p className="text-gray-800 font-semibold">{order.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide">Phone</p>
                                        <p className="text-gray-800 font-semibold">{order.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide">City</p>
                                        <p className="text-gray-800 font-semibold">{order.city}</p>
                                    </div>
                                </div>
                            </div>

                            {/*Update Order status */}
                            <div className="bg-blue-50 rounded-lg p-2 mb-4 border border-blue-100">
                                <div className="flex items-center gap-2">
                                    <label className="font-semibold text-gray-700 text-sm whitespace-nowrap">Status:</label>
                                    {isAdmin ? (
                                        <>
                                            <select
                                                value={orderStatus}
                                                onChange={(e) => setOrderStatus(e.target.value)}
                                                className="flex-1 px-2 py-1 text-sm border border-blue-300 rounded bg-white text-gray-800 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            >
                                                {statusOptions.map((status) => (
                                                    <option key={status} value={status}>
                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                onClick={handleStatusUpdate}
                                                disabled={isUpdating}
                                                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-3 py-1 text-sm rounded font-semibold disabled:cursor-not-allowed"
                                            >
                                                {isUpdating ? '...' : 'Save'}
                                            </button>
                                        </>
                                    ) : (
                                        <span className="text-sm font-semibold text-gray-800 capitalize">{orderStatus}</span>
                                    )}
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="mb-6">
                                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <span className="w-1 h-5 bg-cyan-500 rounded-full"></span>
                                    Order Items
                                </h4>
                                <div className="space-y-3">
                                    {order.items && order.items.map((item, index) => (
                                        <div key={index} className="flex items-center gap-4 bg-linear-to-r from-white to-blue-50/30 p-4 rounded-xl border border-blue-100 hover:shadow-md transition-shadow duration-200">
                                            <img 
                                                src={item.product.image || '/default-product1.jpg'} 
                                                alt={item.product.name} 
                                                className="w-20 h-20 object-cover rounded-lg shadow-sm" 
                                            />       
                                            <div className="flex-1">
                                                <h5 className="font-semibold text-gray-800 mb-3">{item.product.name}</h5>
                                                <div className="flex items-start gap-3 mt-2">
                                                    <div className="flex-1">
                                                        <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Quantity</p>
                                                        <p className="font-bold text-blue-600 text-lg">{item.qty}</p>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Unit Price</p>
                                                        <p className="font-bold text-green-700 text-lg">LKR {item.product.price}</p>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Subtotal</p>
                                                        <p className="font-bold text-cyan-600 text-lg">LKR {(item.product.price * item.qty).toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer - Total */}
                        <div className="bg-linear-to-r border-blue-100 p-6">
                            <div className="flex justify-center items-end gap-4">
                                <span className="text-gray-700 font-bold text-lg">Order Total:</span>
                                <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                    LKR {(order.totalPrice ?? 0).toFixed(2)}
                                </span>
                            </div>
                            <div className="mt-4 flex gap-3">
                              
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}