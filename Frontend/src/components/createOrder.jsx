import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../Utils/api";
import { ClearCart } from "../Utils/cart";

export default function CreateOrder({ cart }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");

  const handleCheckout = async () => {
    // Basic validation
    if (!firstName || !lastName || !addressLine1 || !city || !phone) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!cart || cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    // Validate cart structure
    const invalidCartItems = cart.filter(
      (item) =>
        !item ||
        !item.product ||
        !item.product.productId ||
        !item.quantity ||
        item.quantity < 1
    );

    if (invalidCartItems.length > 0) {
      console.error("Invalid cart items:", invalidCartItems);
      toast.error("Cart contains invalid items. Please refresh and try again.");
      return;
    }

    setLoading(true);

    try {
      // Map cart to items structure expected by backend: [{ productId, qty }]
      const items = cart.map((item) => ({
        productId: item.product.productId,
        qty: item.quantity,
      }));

      console.log("📦 Sending order payload:", {
        firstName,
        lastName,
        addressLine1,
        addressLine2,
        city,
        phone,
        items,
        cartLength: cart.length,
      });

      const res = await api.post("/orders/create", {
        firstName,
        lastName,
        addressLine1,
        addressLine2,
        city,
        phone,
        items,
      });

      toast.success("Order placed successfully!");
      console.log("✅ Order response:", res.data);

      // Clear input fields
      setFirstName("");
      setLastName("");
      setAddressLine1("");
      setAddressLine2("");
      setCity("");
      setPhone("");

      // Clear the local cart
      ClearCart();

      setIsModalOpen(false);
      
      // Redirect to products/shop page
      navigate("/products");
    } catch (error) {
      console.error("❌ Checkout error details:", {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
        fullError: error,
      });
      
      // More detailed error message
      let errMsg = "Failed to place order. Please try again.";
      
      if (error?.response?.status === 401) {
        errMsg = "Your session expired. Please login again.";
      } else if (error?.response?.status === 400) {
        errMsg = error?.response?.data?.error || error?.response?.data?.message || "Invalid order data.";
      } else if (error?.response?.status === 500) {
        errMsg = "Server error. Please try again later.";
      } else if (error?.message === "Network Error") {
        errMsg = "Network error. Please check your connection.";
      } else {
        errMsg = error?.response?.data?.error || error?.response?.data?.message || errMsg;
      }
      
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Order Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full py-3.5 rounded-2xl bg-linear-to-r from-cyan-500 to-blue-600 text-white font-bold hover:scale-[1.02] transition-all duration-300 cursor-pointer"
      >
        Order Now
      </button>

      {/* Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-9999 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-8 relative animate-in text-gray-900">

            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-4 text-xl font-bold text-gray-900 hover:text-red-500 cursor-pointer"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
              Shipping Details
            </h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="First Name *"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
              />

              <input
                type="text"
                placeholder="Last Name *"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
              />

              <input
                type="text"
                placeholder="Address Line 1 *"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
              />

              <input
                type="text"
                placeholder="Address Line 2"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
              />

              <input
                type="text"
                placeholder="City *"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
              />

              <input
                type="text"
                placeholder="Phone Number *"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
              />
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-semibold flex items-center justify-center cursor-pointer transition duration-200"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Confirm Order"
              )}
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}