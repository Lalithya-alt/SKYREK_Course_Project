import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../Utils/api';
import uploadmedia from '../Utils/mediaUpload';

export default function Settings() {
    const [user, setUser] = useState(null);
    const [firstName, setFirstName] = useState("");
    const [lastname, setLastname] = useState("");
    const [image, setImage] = useState(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        
        if (token != null) {
            api.get("/users/me", { 
                headers: { 
                    "Authorization": `Bearer ${token}`
                }
            }).then((response) => {
                setUser(response.data);
                setFirstName(response.data.firstName || "");
                setLastname(response.data.lastName || "");
            }).catch((err) => {
                console.error(err);
                setUser(null);
            });
        } else {
            window.location.href = "/login";
            toast.error("You are not authorized to access this page");
        }
    }, []);

    async function handleUpdateProfile(e) {
        e.preventDefault();
        setLoading(true);
        
        let imageurl = user ? user.image : null;

        try {
            if (image != null) {
                imageurl = await uploadmedia(image);
                if (imageurl == null) {
                    setLoading(false);
                    return toast.error("Failed to upload image");
                }
            }

            const response = await api.put("/users", {
                firstName: firstName,
                lastName: lastname,
                image: imageurl
            });

            setUser(response.data);
            setFirstName(response.data.firstName || "");
            setLastname(response.data.lastName || "");
            toast.success("Profile updated successfully!");
            window.location.reload();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdatePassword(e) {
        e.preventDefault();
        if (password !== confirmPassword) {
            return toast.error("Passwords do not match");
        }
        if (!password) {
            return toast.error("Password cannot be empty");
        }

        setLoading(true);
        try {
            await api.post("/users/password", {
                password: password
            });
            toast.success("Password updated successfully!");
            setPassword("");
            setConfirmPassword("");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to update password");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full h-full overflow-y-auto flex flex-col lg:flex-row justify-center items-start lg:items-center gap-8 px-4 py-8 bg-slate-50/30">

            {/* Profile Information */}
            <div className="w-full max-w-[480px] min-h-[460px] shrink-0 bg-white border border-slate-100 shadow-xl rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight mb-1">Profile Information</h1>
                    <p className="text-slate-400 text-xs mb-6">Update your account details and profile picture</p>
                </div>
                <form className="flex flex-col gap-5 flex-grow justify-between" onSubmit={handleUpdateProfile}>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col items-center gap-2 mb-2">
                            <img 
                                src={image ? URL.createObjectURL(image) : (user && user.image ? user.image : "/default-profile.png")} 
                                className="w-24 h-24 rounded-full object-cover border-2 border-cyan-500 shadow-md shrink-0" 
                                alt="profile preview" 
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5" htmlFor="firstName">First Name</label>
                                <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm" type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5" htmlFor="lastName">Last Name</label>
                                <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm" type="text" id="lastName" value={lastname} onChange={(e) => setLastname(e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5" htmlFor="image">Profile Image</label>
                            <input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300 focus:outline-none text-sm cursor-pointer" type="file" id="image" onChange={(e) => setImage(e.target.files[0])} />
                        </div>
                    </div>
                    <button className="w-full py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:opacity-50 transition-all shadow-md shadow-cyan-500/10 cursor-pointer mt-4 text-sm" type="submit" disabled={loading}>
                        {loading ? "Updating..." : "Update Profile"}
                    </button>
                </form>
            </div>

            {/* Change password */}
            <div className="w-full max-w-[480px] min-h-[460px] shrink-0 bg-white border border-slate-100 shadow-xl rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight mb-1">Change Password</h1>
                    <p className="text-slate-400 text-xs mb-6">Secure your account with a strong password</p>
                </div>
                <form className="flex flex-col gap-5 flex-grow justify-between" onSubmit={handleUpdatePassword}>
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5" htmlFor="password">New Password</label>
                            <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5" htmlFor="confirmPassword">Confirm Password</label>
                            <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm" type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" />
                        </div>
                    </div>
                    <button className="w-full py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:opacity-50 transition-all shadow-md shadow-cyan-500/10 cursor-pointer mt-4 text-sm" type="submit" disabled={loading}>
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}