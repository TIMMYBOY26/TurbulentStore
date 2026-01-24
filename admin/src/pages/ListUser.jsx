import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ListUser = ({ token }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // States for Modal
    const [showModal, setShowModal] = useState(false);
    const [selectedUserCart, setSelectedUserCart] = useState([]);
    const [modalLoading, setModalLoading] = useState(false);

    // State for the search query
    const [searchTerm, setSearchTerm] = useState("");

    // Logic to filter users based on name or email
    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        fetchUsers();
    }, [token]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(backendUrl + "/api/user/list", {
                headers: { token },
            });

            if (response.data.success) {
                setUsers(response.data.users);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Function to check detailed cart contents
    const checkCartDetails = async (userId) => {
        try {
            setModalLoading(true);
            setShowModal(true);
            const response = await axios.post(
                backendUrl + "/api/cart/details",
                { userId },
                { headers: { token } }
            );

            if (response.data.success) {
                setSelectedUserCart(response.data.detailedCart);
            } else {
                toast.error(response.data.message);
                setShowModal(false);
            }
        } catch (error) {
            toast.error(error.message);
            setShowModal(false);
        } finally {
            setModalLoading(false);
        }
    };

    const clearCart = async (userId) => {
        if (window.confirm("Are you sure you want to empty this user's cart?")) {
            try {
                const response = await axios.post(
                    backendUrl + "/api/cart/clear-user-cart",
                    { userId },
                    { headers: { token } }
                );

                if (response.data.success) {
                    toast.success("User cart cleared successfully!");
                    await fetchUsers();
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error("Error clearing cart: " + error.message);
            }
        }
    };

    return (
        <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
            <ToastContainer position="bottom-right" />

            {/* --- CART DETAILS MODAL --- */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800">Cart Contents</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                        </div>

                        <div className="p-6 max-h-[60vh] overflow-y-auto">
                            {modalLoading ? (
                                <p className="text-center py-10 text-gray-500">Loading details...</p>
                            ) : selectedUserCart.length === 0 ? (
                                <p className="text-center py-10 text-gray-500">This cart is empty.</p>
                            ) : (
                                <div className="space-y-4">
                                    {selectedUserCart.map((item, index) => (
                                        <div key={index} className="flex items-center gap-4 border-b pb-4 last:border-0">
                                            <img src={item.image[0]} className="w-16 h-16 object-cover rounded-lg border" alt="" />
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-gray-800 truncate w-48">{item.name}</p>
                                                <p className="text-xs text-gray-500">Size: <span className="font-bold text-gray-700">{item.size}</span></p>
                                                <p className="text-xs text-gray-500">Qty: <span className="font-bold text-gray-700">{item.quantity}</span></p>
                                            </div>
                                            <p className="text-sm font-black text-gray-900">${item.price}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t bg-gray-50 text-right">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all text-sm font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
                    <p className="text-sm text-gray-500">Monitor active shoppers and manage carts</p>
                </div>
                <p className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm border">
                    Total Registered: {users.length}
                </p>
            </div>

            {/* Search Input */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by name or email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 w-full"
                />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-[0.5fr_2fr_3fr_1.5fr_1.5fr] items-center py-4 px-6 bg-gray-100 border-b text-gray-600 font-semibold text-sm uppercase tracking-wider">
                    <span>#</span>
                    <span>Name</span>
                    <span>Email</span>
                    <span className="text-center">Cart Activity</span>
                    <span className="text-center">Actions</span>
                </div>

                <div className="divide-y divide-gray-200">
                    {loading ? (
                        <p className="p-10 text-center text-gray-500 text-lg">Loading users...</p>
                    ) : filteredUsers.length === 0 ? (
                        <p className="p-10 text-center text-gray-500 text-lg">No users found.</p>
                    ) : (
                        filteredUsers.map((user, index) => {
                            const cartItemCount = Object.keys(user.cartData || {}).length;

                            return (
                                <div
                                    className="grid grid-cols-[1fr_2fr_1fr] md:grid-cols-[0.5fr_2fr_3fr_1.5fr_1.5fr] items-center gap-4 py-4 px-6 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                                    key={user._id}
                                >
                                    <span className="text-gray-400 font-medium">{index + 1}</span>

                                    <div className="flex flex-col">
                                        <p className="font-bold text-gray-900">{user.name}</p>
                                        <span className="md:hidden text-xs text-gray-400 truncate">{user.email}</span>
                                    </div>

                                    <p className="hidden md:block text-gray-600 truncate">{user.email}</p>

                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => checkCartDetails(user._id)}
                                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${cartItemCount > 0
                                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                : "bg-gray-100 text-gray-400 cursor-default"
                                                }`}>
                                            {cartItemCount} {cartItemCount === 1 ? 'Item' : 'Items'}
                                        </button>
                                    </div>

                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={() => clearCart(user._id)}
                                            disabled={cartItemCount === 0}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${cartItemCount > 0
                                                ? "bg-orange-100 text-orange-600 hover:bg-orange-600 hover:text-white shadow-sm"
                                                : "bg-gray-50 text-gray-300 cursor-not-allowed border border-gray-100"
                                                }`}
                                        >
                                            Empty Cart
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListUser;
