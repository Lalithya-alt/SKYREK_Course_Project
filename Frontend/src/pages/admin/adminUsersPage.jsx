import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast';
import api from '../../Utils/api';
import LoadingScreen from '../../components/loadingScreen';

export default function AdminUsersPage() {

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchUsers = () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to view users");
        setIsLoading(false);
        return;
      }
      api.get(`/users/all?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        setUsers(res.data.users || []);
        setTotalUsers(res.data.totalUsers || 0);
        setTotalPages(res.data.totalPages || 1);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        toast.error("Failed to load users");
        setIsLoading(false);
      });
    };

    fetchUsers();
  }, [pageNumber, pageSize]);

  const handleUpdateStatusAndRole = (email, updates) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to modify users");
      return;
    }

    api.put(`/users/${email}/status-role`, updates, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((res) => {
      toast.success(res.data.message || "User updated successfully");
      setUsers((prevUsers) =>
        prevUsers.map((u) => u.email === email ? { ...u, ...updates } : u)
      );
    })
    .catch((err) => {
      console.error("Error updating user:", err);
      toast.error(err?.response?.data?.message || "Failed to update user");
    });
  };

  return (
    <div className='w-full h-full p-6 flex flex-col'>
        
        <div className="mb-8">
          <h2 className="text-4xl font-extrabold bg-linear-to-r from-[#0c1572] to-cyan-600 bg-clip-text text-transparent mb-2">
            User Management
          </h2>
          <p className="text-gray-500 text-sm">Manage and oversee all registered users</p>
        </div>

        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <LoadingScreen />
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No users found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl shadow-2xl">

             <div className='p-4 bg-slate-50 border-b border-gray-100 font-semibold text-slate-700'> {totalUsers} Users.</div>

              <table className="w-full border-collapse min-w-max">
                <thead>
                  <tr className="bg-linear-to-r from-[#060c4e] to-blue-500 text-white">
                    <th className="p-4 text-left font-bold">Profile</th>
                    <th className="p-4 text-left font-bold">Name</th>
                    <th className="p-4 text-left font-bold">Email</th>
                    <th className="p-4 text-left font-bold">Role</th>
                    <th className="p-4 text-left font-bold">Verification</th>
                    <th className="p-4 text-left font-bold">Status</th>
                    <th className="p-4 text-center font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {users.map((user, index) => (
                    <tr 
                      key={user._id} 
                      className={`border-b border-blue-100 transition-all duration-300 hover:shadow-lg hover:bg-linear-to-r hover:from-blue-50 hover:to-cyan-50 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'
                      }`}
                    >
              
                      <td className="p-4">
                        <img 
                          src={user.image || "/default-profile.png"} 
                          alt={`${user.firstName}'s avatar`}
                          className="w-10 h-10 rounded-full object-cover border-2 border-blue-200"
                          onError={(e) => { e.target.src = "/default-profile.png" }}
                        />
                      </td>
                      <td className="p-4 font-semibold text-blue-900">{user.firstName} {user.lastName}</td>
                      <td className="p-4 text-gray-700 font-medium">{user.email}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          user.isAdmin 
                            ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                            : 'bg-blue-100 text-blue-700 border border-blue-200'
                        }`}>
                          {user.isAdmin ? 'Admin' : 'Customer'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          user.isEmailVerified 
                            ? 'bg-green-100 text-green-700 border border-green-200' 
                            : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                        }`}>
                          {user.isEmailVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          user.isBlocked 
                            ? 'bg-red-100 text-red-700 border border-red-200' 
                            : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}>
                          {user.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleUpdateStatusAndRole(user.email, { isAdmin: !user.isAdmin })}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition active:scale-95 cursor-pointer hover:shadow-md ${
                              user.isAdmin 
                                ? 'bg-amber-100 hover:bg-amber-200 text-amber-700 border border-amber-200' 
                                : 'bg-purple-100 hover:bg-purple-200 text-purple-700 border border-purple-200'
                            }`}
                          >
                            {user.isAdmin ? 'Make Customer' : 'Make Admin'}
                          </button>
                          <button
                            onClick={() => handleUpdateStatusAndRole(user.email, { isBlocked: !user.isBlocked })}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition active:scale-95 cursor-pointer hover:shadow-md ${
                              user.isBlocked 
                                ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border border-emerald-200' 
                                : 'bg-red-100 hover:bg-red-200 text-red-700 border border-red-200'
                            }`}
                          >
                            {user.isBlocked ? 'Unblock' : 'Block'}
                          </button>
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
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
            disabled={pageNumber === 1}
          >
            Previous
          </button>
          <span className="flex items-center px-4 py-2 text-gray-700 font-semibold">
            Page {pageNumber} of {totalPages}
          </span>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setPageNumber((prev) => Math.min(prev + 1, totalPages))}
            disabled={pageNumber === totalPages}
          >
            Next
          </button>
        </div>
    
    </div>
  )
}

