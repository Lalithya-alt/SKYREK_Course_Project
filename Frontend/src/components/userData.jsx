import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"

export default function UserData() {

const [user,setUser] = useState(null)
const [selectedOption, setSelectedOption] = useState("me")
const navigate = useNavigate();

useEffect(() => {
    const token = localStorage.getItem("token")
   if(token != null) {
        axios.get("/api/users/me",{ 
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then((response) => {
            setUser(response.data)
        })
   }
}, [])

  return (
    <div>
        {
            user == null ? 
          <button className="px-5 py-2.5 rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 hover:scale-105 hover:shadow-cyan-500/30 hover:shadow-lg transition duration-300 font-semibold" onClick={() => window.location.href = '/login'}>
            Log in
          </button>:<div className="flex items-center gap-2 flex-nowrap shrink-0">
            <img src={user.image || "/default-profile.png"} className='w-12 h-12 rounded-full object-cover shrink-0' alt="profile"/>
            <select
                value={selectedOption}
                onChange={(e) => {
                    setSelectedOption(e.target.value);
                    if (e.target.value === "settings") {
                        navigate("/settings");
                    }
                    if (e.target.value === "myorders") {
                        navigate("/myOrders");
                    }
                    if (e.target.value === "logout") {
                        localStorage.removeItem("token");
                        setUser(null);
                        window.location.href = '/';
                    }
                    setSelectedOption("me");
                }}
                style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(34,211,238,0.4)",
                    color: "white",
                    borderRadius: "10px",
                    padding: "6px 12px",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    backdropFilter: "blur(12px)",
                    outline: "none",
                    boxShadow: "0 0 12px rgba(34,211,238,0.15)",
                    transition: "box-shadow 0.3s ease",
                }}
                onFocus={e => e.target.style.boxShadow = "0 0 18px rgba(34,211,238,0.4)"}
                onBlur={e => e.target.style.boxShadow = "0 0 12px rgba(34,211,238,0.15)"}
            >
                <option value="me" disabled style={{ background: "#0f172a", color: "#94a3b8" }}>Hi, {user.firstName} ▾</option>
                <option value="settings" style={{ background: "#0f172a", color: "white" }}>⚙️ Settings</option>
                <option value="myorders" style={{ background: "#0f172a", color: "white" }}>📦 My Orders</option>
                <option value="logout" style={{ background: "#0f172a", color: "#f87171" }}>🚪 Logout</option>
            </select>
            </div>
        }

    </div>
  )
}
