import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast';
import api from '../Utils/api';
import LoadingScreen from '../components/loadingScreen';
import { formatTimestamp } from '../Utils/dateFormate';
import AdminOrderData from '../components/OrderData';

export default function MyOrders() {

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("You must be logged in to view orders");
          return;
        }
        const res = await api.get(`/orders/${pageNumber}/${pageSize}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOrders(res.data.orders);
        setTotalOrders(res.data.totalOrders);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("Error fetching orders:", err);
        toast.error("Failed to load orders");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [pageNumber, pageSize]);

  return (
    <div className='w-full h-full p-6 flex flex-col'>

      <div className="mb-8">
        <h2 className="text-4xl font-extrabold bg-linear-to-r from-[#0c1572] to-cyan-600 bg-clip-text text-transparent mb-2">
          My Orders
        </h2>
        <p className="text-gray-500 text-sm">View and track all your orders</p>
      </div>

      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <LoadingScreen />
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No orders found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl shadow-2xl">

            <div className='h-full gap-4 flex items-center mb-3 text-gray-600 font-semibold'>
              {totalOrders} Orders
            </div>

            <table className="w-full border-collapse min-w-max">
              <thead>
                <tr className="bg-linear-to-r from-[#060c4e] to-blue-500 text-white">
                  <th className="p-4 text-left font-bold">Order ID</th>
                  <th className="p-4 text-left font-bold">Name</th>
                  <th className="p-4 text-left font-bold">City</th>
                  <th className="p-4 text-left font-bold">Phone Number</th>
                  <th className="p-4 text-left font-bold">Status</th>
                  <th className="p-4 text-left font-bold">Date</th>
                  <th className="p-4 text-left font-bold">Total Amount</th>
                  <th className="p-4 text-left font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {orders.map((order, index) => (
                  <tr
                    key={order._id}
                    className={`border-b border-blue-100 transition-all duration-300 hover:shadow-lg hover:bg-linear-to-r hover:from-blue-50 hover:to-cyan-50 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'
                    }`}
                  >
                    <td className="p-4 font-semibold text-blue-700">{order.orderId}</td>
                    <td className="p-4 font-medium text-gray-800 max-w-xs truncate">{order.firstName} {order.lastName}</td>
                    <td className="p-4 text-gray-700 font-medium">{order.city}</td>
                    <td className="p-4 text-gray-700 font-medium">{order.phone}</td>
                    <td className="p-4 text-gray-600">{order.status || 'N/A'}</td>
                    <td className="p-4 text-gray-600">{formatTimestamp(order.date)}</td>
                    <td className="p-4">
                      <span className="bg-linear-to-r from-green-100 to-emerald-100 text-green-700 font-bold px-3 py-1 rounded-full text-sm">
                        LKR {(order.totalPrice ?? 0).toFixed(2)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <AdminOrderData isAdmin={false} order={order} refresh={() => setPageNumber(n => n)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex justify-center mt-6 gap-2 pt-6 border-t border-gray-200">
        <button
          className="bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
          onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
          disabled={pageNumber === 1}
        >
          Previous
        </button>
        <span className="flex items-center px-4 py-2 text-gray-700 font-semibold">
          Page {pageNumber} of {totalPages}
        </span>
        <button
          className="bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
          onClick={() => setPageNumber((prev) => Math.min(prev + 1, totalPages))}
          disabled={pageNumber === totalPages}
        >
          Next
        </button>
      </div>

    </div>
  )
}
