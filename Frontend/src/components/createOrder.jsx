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

  const inputStyle = {
    width: "100%",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "10px 14px",
    color: "#1e293b",
    fontSize: "0.875rem",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const labelStyle = {
    display: "block",
    color: "#475569",
    fontSize: "0.78rem",
    fontWeight: "600",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    marginBottom: "5px",
  };

  const fieldStyle = { display: "flex", flexDirection: "column" };

  const handleFocus = e => {
    e.target.style.borderColor = "#06b6d4";
    e.target.style.boxShadow = "0 0 0 3px rgba(6,182,212,0.12)";
    e.target.style.background = "#fff";
  };
  const handleBlur = e => {
    e.target.style.borderColor = "#e2e8f0";
    e.target.style.boxShadow = "none";
    e.target.style.background = "#f8fafc";
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
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(6px)" }}
        >
          <div style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "20px",
            width: "100%",
            maxWidth: "480px",
            maxHeight: "90vh",
            overflowY: "auto",
            position: "relative",
            boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
          }}>

            {/* Header strip */}
            <div style={{
              padding: "22px 28px 18px",
              borderBottom: "1px solid #f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "700", color: "#0f172a" }}>
                  Shipping Details
                </h2>
                <p style={{ margin: "3px 0 0", fontSize: "0.78rem", color: "#94a3b8" }}>
                  Fill in your delivery information below
                </p>
              </div>

              {/* Close button */}
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: "#f1f5f9",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  color: "#64748b",
                  width: "30px", height: "30px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", fontSize: "14px", flexShrink: 0,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.color = "#ef4444"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#64748b"; }}
              >✕</button>
            </div>

            {/* Form body */}
            <div style={{ padding: "24px 28px 28px", display: "flex", flexDirection: "column", gap: "16px" }}>

              {/* First Name + Last Name */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>First Name <span style={{ color: "#f87171" }}>*</span></label>
                  <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
                    placeholder="e.g. John" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Last Name <span style={{ color: "#f87171" }}>*</span></label>
                  <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                    placeholder="e.g. Doe" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                </div>
              </div>

              {/* Address Line 1 */}
              <div style={fieldStyle}>
                <label style={labelStyle}>Address Line 1 <span style={{ color: "#f87171" }}>*</span></label>
                <input type="text" value={addressLine1} onChange={e => setAddressLine1(e.target.value)}
                  placeholder="Street address, P.O. box" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
              </div>

              {/* Address Line 2 */}
              <div style={fieldStyle}>
                <label style={labelStyle}>Address Line 2 <span style={{ color: "rgba(148,163,184,0.5)", fontWeight: 400, textTransform: "none", letterSpacing: 0, fontSize: "0.72rem" }}>(optional)</span></label>
                <input type="text" value={addressLine2} onChange={e => setAddressLine2(e.target.value)}
                  placeholder="Apartment, suite, unit" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
              </div>

              {/* City + Phone */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>City <span style={{ color: "#f87171" }}>*</span></label>
                  <input type="text" value={city} onChange={e => setCity(e.target.value)}
                    placeholder="e.g. Colombo" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Phone Number <span style={{ color: "#f87171" }}>*</span></label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="e.g. 077 123 4567" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                </div>
              </div>

              {/* Divider */}
              <div style={{ borderTop: "1px solid #f1f5f9", marginTop: "4px" }} />

              {/* Confirm button */}
              <button
                onClick={handleCheckout}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "12px",
                  background: loading ? "rgba(71,85,105,0.5)" : "rgba(6,182,212,0.9)",
                  border: "1px solid rgba(6,182,212,0.3)",
                  color: "white",
                  fontWeight: "700",
                  fontSize: "0.9rem",
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "background 0.2s, opacity 0.2s",
                  letterSpacing: "0.02em",
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "rgba(6,182,212,1)"; }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "rgba(6,182,212,0.9)"; }}
              >
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <svg style={{ animation: "spin 1s linear infinite", height: "17px", width: "17px" }}
                      xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path style={{ opacity: 0.75 }} fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : "Confirm Order"}
              </button>

            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}