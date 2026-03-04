import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FaUtensils, FaCalendarAlt, FaStar, FaTrash, FaCheck, FaTimes, FaShoppingCart, FaUsers, FaTag, FaChartBar } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview'); // overview, menu, reservations, reviews

    // Data State
    const [menus, setMenus] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [orders, setOrders] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [users, setUsers] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    // New Menu Item State
    const [newMenu, setNewMenu] = useState({
        name: '', category: 'Tacos', description: '', price: '', image: '', isVegetarian: false, isVegan: false, available: true
    });
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    // New Coupon State
    const [newCoupon, setNewCoupon] = useState({
        code: '', discountPercentage: '', expiryDate: '', usageLimit: ''
    });

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'menu') {
                const { data } = await api.get('/menu');
                setMenus(data);
            } else if (activeTab === 'reservations') {
                const { data } = await api.get('/reservations');
                setReservations(data);
            } else if (activeTab === 'reviews') {
                const { data } = await api.get('/reviews/all');
                setReviews(data);
            } else if (activeTab === 'orders') {
                const { data } = await api.get('/orders');
                setOrders(data);
            } else if (activeTab === 'users') {
                const { data } = await api.get('/users');
                setUsers(data);
            } else if (activeTab === 'coupons') {
                const { data } = await api.get('/coupons');
                setCoupons(data);
            } else if (activeTab === 'overview') {
                const { data } = await api.get('/analytics');
                setAnalytics(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // --- Menu Handlers ---
    const handleUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const { data } = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setNewMenu({ ...newMenu, image: data.url });
        } catch (error) {
            console.error(error);
            alert('Image upload failed. Check the backend connection.');
        } finally {
            setUploading(false);
        }
    };

    const handleCreateMenu = async (e) => {
        e.preventDefault();
        if (!newMenu.image) return alert('Please upload an image first');
        try {
            await api.post('/menu', newMenu);
            setNewMenu({ name: '', category: 'Tacos', description: '', price: '', image: '', isVegetarian: false, isVegan: false, available: true });
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteMenu = async (id) => {
        if (window.confirm('Delete this item?')) {
            try {
                await api.delete(`/menu/${id}`);
                fetchData();
            } catch (error) {
                console.error(error);
            }
        }
    };

    // --- Reservation Handlers ---
    const updateReservationStatus = async (id, status) => {
        try {
            await api.put(`/reservations/${id}/status`, { status });
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const updateOrderStatus = async (id, newStatus) => {
        try {
            await api.put(`/orders/${id}/status`, { status: newStatus });
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Failed to update status');
        }
    };

    // --- User Handlers ---
    const updateUserRole = async (user) => {
        try {
            await api.put(`/users/${user._id}`, { role: user.role === 'admin' ? 'user' : 'admin' });
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Failed to update role');
        }
    };

    const toggleUserStatus = async (user) => {
        try {
            await api.put(`/users/${user._id}`, { isActive: !user.isActive });
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Failed to update status');
        }
    };

    // --- Review Handlers ---
    const approveReview = async (id) => {
        try {
            await api.put(`/reviews/${id}/approve`);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const deleteReview = async (id) => {
        try {
            await api.delete(`/reviews/${id}`);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    // --- Coupon Handlers ---
    const handleCreateCoupon = async (e) => {
        e.preventDefault();
        try {
            await api.post('/coupons', {
                ...newCoupon,
                usageLimit: newCoupon.usageLimit ? parseInt(newCoupon.usageLimit) : null
            });
            setNewCoupon({ code: '', discountPercentage: '', expiryDate: '', usageLimit: '' });
            fetchData();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to create coupon');
        }
    };

    const toggleCouponStatus = async (id) => {
        try {
            await api.put(`/coupons/${id}/status`);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const deleteCoupon = async (id) => {
        if (window.confirm('Delete this coupon?')) {
            try {
                await api.delete(`/coupons/${id}`);
                fetchData();
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="pt-28 pb-20 min-h-screen bg-gray-50 flex flex-col md:flex-row">

            {/* Sidebar */}
            <div className="w-full md:w-64 bg-white shadow-xl rounded-r-3xl flex-shrink-0 z-10 md:min-h-[calc(100vh-8rem)]">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="font-heading font-bold text-2xl text-primary-darkred">Admin Panel</h2>
                    <p className="text-sm text-gray-500">Welcome, {user?.name}</p>
                </div>
                <div className="p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`w-full flex items-center px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'overview' ? 'bg-primary-darkred text-white shadow-md' : 'text-gray-600 hover:bg-primary-beige'}`}
                    >
                        <FaChartBar className="mr-3" /> Overview & Stats
                    </button>
                    <button
                        onClick={() => setActiveTab('menu')}
                        className={`w-full flex items-center px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'menu' ? 'bg-primary-darkred text-white shadow-md' : 'text-gray-600 hover:bg-primary-beige'}`}
                    >
                        <FaUtensils className="mr-3" /> Menu Management
                    </button>
                    <button
                        onClick={() => setActiveTab('reservations')}
                        className={`w-full flex items-center px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'reservations' ? 'bg-primary-darkred text-white shadow-md' : 'text-gray-600 hover:bg-primary-beige'}`}
                    >
                        <FaCalendarAlt className="mr-3" /> Reservations
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`w-full flex items-center px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'reviews' ? 'bg-primary-darkred text-white shadow-md' : 'text-gray-600 hover:bg-primary-beige'}`}
                    >
                        <FaStar className="mr-3" /> Reviews
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`w-full flex items-center px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'orders' ? 'bg-primary-darkred text-white shadow-md' : 'text-gray-600 hover:bg-primary-beige'}`}
                    >
                        <FaShoppingCart className="mr-3" /> Kitchen Orders
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`w-full flex items-center px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'users' ? 'bg-primary-darkred text-white shadow-md' : 'text-gray-600 hover:bg-primary-beige'}`}
                    >
                        <FaUsers className="mr-3" /> Users
                    </button>
                    <button
                        onClick={() => setActiveTab('coupons')}
                        className={`w-full flex items-center px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'coupons' ? 'bg-primary-darkred text-white shadow-md' : 'text-gray-600 hover:bg-primary-beige'}`}
                    >
                        <FaTag className="mr-3" /> Promos & Rewards
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow p-4 md:p-8 w-full max-w-6xl mx-auto">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary-darkred"></div>
                    </div>
                ) : (
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {/* Overview Tab */}
                        {activeTab === 'overview' && analytics && (
                            <div>
                                <h3 className="text-3xl font-heading font-bold text-gray-800 mb-8">Business Overview</h3>

                                {/* Top Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                    <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-primary-darkred">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Revenue</p>
                                        <h4 className="text-3xl font-heading font-black text-gray-900">${analytics.totalRevenue.toFixed(2)}</h4>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-green-500">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Orders</p>
                                        <h4 className="text-3xl font-heading font-black text-gray-900">{analytics.totalOrders}</h4>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-blue-500">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Menu Items</p>
                                        <h4 className="text-3xl font-heading font-black text-gray-900">-</h4>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-purple-500">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Active Users</p>
                                        <h4 className="text-3xl font-heading font-black text-gray-900">-</h4>
                                    </div>
                                </div>

                                {/* Charts */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Revenue Line Chart */}
                                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
                                        <h4 className="font-bold text-lg mb-6 text-gray-800">Revenue (Last 7 Days)</h4>
                                        <div className="h-80 w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={analytics.revenueChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                                    <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} formatter={(value) => [`$${value}`, 'Revenue']} />
                                                    <Line type="monotone" dataKey="revenue" stroke="#8B0000" strokeWidth={3} dot={{ r: 4, fill: '#8B0000', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Top Items Bar Chart */}
                                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                                        <h4 className="font-bold text-lg mb-6 text-gray-800">Top Selling Items</h4>
                                        <div className="h-80 w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={analytics.topItems} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                                                    <XAxis type="number" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                                    <YAxis dataKey="name" type="category" width={100} stroke="#4b5563" fontSize={12} fontWeight="bold" tickLine={false} axisLine={false} />
                                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                                    <Bar dataKey="qty" fill="#BE7C4D" radius={[0, 4, 4, 0]} barSize={20} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Menu Tab */}
                        {activeTab === 'menu' && (
                            <div>
                                <h3 className="text-3xl font-heading font-bold text-gray-800 mb-8">Manage Menu Items</h3>

                                {/* Add Item Form */}
                                <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
                                    <h4 className="font-bold text-lg mb-4 text-primary-terracotta border-b pb-2">Add New Dish</h4>
                                    <form onSubmit={handleCreateMenu} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input type="text" placeholder="Dish Name" required value={newMenu.name} onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })} className="border p-3 rounded-lg w-full" />
                                        <select value={newMenu.category} onChange={(e) => setNewMenu({ ...newMenu, category: e.target.value })} className="border p-3 rounded-lg w-full">
                                            {['Tacos', 'Burritos', 'Quesadillas', 'Fajitas', 'Appetizers', 'Drinks', 'Vegetarian/Vegan'].map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                        <input type="number" placeholder="Price" required step="0.01" value={newMenu.price} onChange={(e) => setNewMenu({ ...newMenu, price: e.target.value })} className="border p-3 rounded-lg w-full" />
                                        <div>
                                            <input type="file" onChange={handleUpload} className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-beige file:text-primary-darkred hover:file:bg-primary-terracotta hover:file:text-white transition-all" />
                                            {uploading && <span className="text-xs text-gray-500">Uploading...</span>}
                                            {newMenu.image && <span className="text-xs text-green-600 block mt-1">Image loaded!</span>}
                                        </div>
                                        <textarea placeholder="Description" required value={newMenu.description} onChange={(e) => setNewMenu({ ...newMenu, description: e.target.value })} className="border p-3 rounded-lg w-full md:col-span-2"></textarea>
                                        <div className="flex md:col-span-2 gap-6 items-center flex-wrap">
                                            <label className="flex items-center space-x-2 cursor-pointer">
                                                <input type="checkbox" checked={newMenu.isVegetarian} onChange={(e) => setNewMenu({ ...newMenu, isVegetarian: e.target.checked })} className="w-5 h-5 rounded text-primary-darkred focus:ring-primary-darkred" />
                                                <span>Vegetarian</span>
                                            </label>
                                            <label className="flex items-center space-x-2 cursor-pointer">
                                                <input type="checkbox" checked={newMenu.isVegan} onChange={(e) => setNewMenu({ ...newMenu, isVegan: e.target.checked })} className="w-5 h-5 rounded text-primary-darkred focus:ring-primary-darkred" />
                                                <span>Vegan</span>
                                            </label>
                                            <button type="submit" disabled={uploading || !newMenu.image} className="ml-auto bg-primary-darkred text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-colors disabled:opacity-50">
                                                Add Item
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                {/* List Items */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {menus.map(item => (
                                        <div key={item._id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
                                            <img src={item.image} alt={item.name} className="w-full h-40 object-cover" />
                                            <div className="p-4 flex-grow flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                                                        <span className="text-primary-darkred font-bold">${item.price.toFixed(2)}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mb-4 bg-gray-100 inline-block px-2 py-1 rounded">{item.category}</p>
                                                </div>
                                                <button onClick={() => handleDeleteMenu(item._id)} className="w-full flex items-center justify-center py-2 text-sm text-red-600 border border-red-200 hover:bg-red-50 rounded-lg transition-colors">
                                                    <FaTrash className="mr-2" /> Delete Item
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reservations Tab */}
                        {activeTab === 'reservations' && (
                            <div>
                                <h3 className="text-3xl font-heading font-bold text-gray-800 mb-8">Reservations</h3>
                                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-primary-beige text-gray-800 uppercase text-sm font-bold tracking-wider">
                                                    <th className="p-4 border-b">Details</th>
                                                    <th className="p-4 border-b">Contact</th>
                                                    <th className="p-4 border-b">Status</th>
                                                    <th className="p-4 border-b text-center">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reservations.length === 0 && (
                                                    <tr><td colSpan="4" className="p-6 text-center text-gray-500">No reservations found.</td></tr>
                                                )}
                                                {reservations.map(res => (
                                                    <tr key={res._id} className="hover:bg-gray-50 border-b border-gray-50 last:border-none">
                                                        <td className="p-4">
                                                            <div className="font-bold text-gray-900">{res.date} at {res.time}</div>
                                                            <div className="text-sm text-gray-500">{res.guests} Guests</div>
                                                            {res.specialRequest && <div className="text-xs text-primary-terracotta mt-1 italic">"{res.specialRequest}"</div>}
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="font-bold">{res.name}</div>
                                                            <div className="text-sm text-gray-500">{res.phone}</div>
                                                            <div className="text-xs text-gray-400">{res.email}</div>
                                                        </td>
                                                        <td className="p-4">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${res.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                                res.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                                    'bg-yellow-100 text-yellow-700'
                                                                }`}>
                                                                {res.status}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-center space-x-2">
                                                            {res.status !== 'confirmed' && (
                                                                <button onClick={() => updateReservationStatus(res._id, 'confirmed')} className="text-green-600 hover:text-green-800 p-2 bg-green-50 rounded-full transition-colors" title="Confirm">
                                                                    <FaCheck />
                                                                </button>
                                                            )}
                                                            {res.status !== 'cancelled' && (
                                                                <button onClick={() => updateReservationStatus(res._id, 'cancelled')} className="text-red-600 hover:text-red-800 p-2 bg-red-50 rounded-full transition-colors" title="Cancel">
                                                                    <FaTimes />
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Reviews Tab */}
                        {activeTab === 'reviews' && (
                            <div>
                                <h3 className="text-3xl font-heading font-bold text-gray-800 mb-8">Manage Reviews</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {reviews.length === 0 && <p className="text-gray-500 col-span-full">No reviews found.</p>}
                                    {reviews.map(review => (
                                        <div key={review._id} className={`bg-white p-6 rounded-xl shadow-md border-t-4 ${review.isApproved ? 'border-green-500' : 'border-yellow-500'}`}>
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex">
                                                    {[...Array(review.rating)].map((_, i) => <FaStar key={i} className="text-primary-gold" />)}
                                                </div>
                                                <span className={`text-xs font-bold px-2 py-1 rounded ${review.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {review.isApproved ? 'Approved' : 'Pending'}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 italic mb-4 line-clamp-3">"{review.comment}"</p>
                                            <p className="font-bold text-gray-900 mb-6">- {review.name}</p>

                                            <div className="flex justify-between mt-auto">
                                                {!review.isApproved && (
                                                    <button onClick={() => approveReview(review._id)} className="text-green-600 hover:text-white hover:bg-green-600 border border-green-600 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                                                        Approve
                                                    </button>
                                                )}
                                                <button onClick={() => deleteReview(review._id)} className="text-red-600 hover:text-white hover:bg-red-600 border border-red-600 px-4 py-2 rounded-lg text-sm font-bold transition-colors ml-auto">
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Orders Tab */}
                        {activeTab === 'orders' && (
                            <div>
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-3xl font-heading font-bold text-gray-800">Live Kitchen Orders</h3>
                                    <div className="bg-[#0f0f0f] text-white px-4 py-1.5 rounded-full shadow-md">
                                        <span className="text-primary-gold font-bold text-sm tracking-widest uppercase">{orders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled').length} Active</span>
                                    </div>
                                </div>
                                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-200">
                                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Order Info</th>
                                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Customer</th>
                                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Items</th>
                                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Total</th>
                                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status/Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {orders.length === 0 && (
                                                    <tr><td colSpan="5" className="p-12 text-center text-gray-500 font-body">No orders have been placed yet.</td></tr>
                                                )}
                                                {orders.map((order) => (
                                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="p-4">
                                                            <p className="font-bold text-gray-900 font-heading">#{order._id.substring(order._id.length - 6)}</p>
                                                            <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleTimeString()} - {new Date(order.createdAt).toLocaleDateString()}</p>
                                                        </td>
                                                        <td className="p-4">
                                                            <p className="font-medium text-gray-800">{order.customerInfo?.name || order.user?.name || 'Guest'}</p>
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                <p>{order.customerInfo?.phone || '-'}</p>
                                                                <p className="line-clamp-1" title={`${order.customerInfo?.address}, ${order.customerInfo?.city} ${order.customerInfo?.zipCode}`}>
                                                                    {order.customerInfo?.address ? `${order.customerInfo.address}, ${order.customerInfo.city}` : '-'}
                                                                </p>
                                                                {order.instructions && <p className="text-primary-terracotta italic mt-1 font-medium">"{order.instructions}"</p>}
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <p className="text-sm text-gray-700">{order.orderItems.length} items</p>
                                                            <p className="text-xs text-gray-400 line-clamp-1 max-w-[150px]">{order.orderItems.map(i => i.name).join(', ')}</p>
                                                        </td>
                                                        <td className="p-4 font-bold text-primary-darkred text-lg">
                                                            ${order.totalPrice.toFixed(2)}
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex flex-col gap-2 relative">
                                                                {['Completed', 'Cancelled'].includes(order.status) ? (
                                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-center border ${order.status === 'Completed' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
                                                                        {order.status}
                                                                    </span>
                                                                ) : (
                                                                    <select
                                                                        value={order.status}
                                                                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                                        className={`appearance-none font-bold text-xs uppercase tracking-wider pl-4 pr-10 py-2 rounded-xl outline-none border cursor-pointer transition-all ${order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                                                            order.status === 'Preparing' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                                                                'bg-purple-100 text-purple-800 border-purple-200'
                                                                            }`}
                                                                    >
                                                                        <option value="Processing">Processing</option>
                                                                        <option value="Confirmed">Confirmed</option>
                                                                        <option value="Preparing">Preparing</option>
                                                                        <option value="Out for delivery">Out for delivery</option>
                                                                        <option value="Ready for Pickup">Ready for Pickup</option>
                                                                        <option value="Delivered">Delivered</option>
                                                                        <option value="Completed">Completed</option>
                                                                        <option value="Cancelled">Cancelled</option>
                                                                    </select>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Users Tab */}
                        {activeTab === 'users' && (
                            <div>
                                <h3 className="text-3xl font-heading font-bold text-gray-800 mb-8">Manage Users</h3>
                                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-200">
                                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">User Info</th>
                                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Role</th>
                                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {users.length === 0 && (
                                                    <tr><td colSpan="4" className="p-12 text-center text-gray-500 font-body">No users found.</td></tr>
                                                )}
                                                {users.map(u => (
                                                    <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="p-4">
                                                            <div className="font-bold text-gray-900">{u.name}</div>
                                                            <div className="text-xs text-gray-500">{u.email}</div>
                                                        </td>
                                                        <td className="p-4">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                                                {u.role || (u.isAdmin ? 'admin' : 'user')}
                                                            </span>
                                                        </td>
                                                        <td className="p-4">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${u.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                                {u.isActive !== false ? 'Active' : 'Disabled'}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-center space-x-2">
                                                            <button
                                                                onClick={() => updateUserRole(u)}
                                                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-bold transition-colors"
                                                            >
                                                                {u.role === 'admin' || u.isAdmin ? 'Demote to User' : 'Promote to Admin'}
                                                            </button>
                                                            <button
                                                                onClick={() => toggleUserStatus(u)}
                                                                className={`px-3 py-1 rounded text-xs font-bold transition-colors ${u.isActive !== false ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                                                            >
                                                                {u.isActive !== false ? 'Disable' : 'Enable'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Coupons Tab */}
                        {activeTab === 'coupons' && (
                            <div>
                                <h3 className="text-3xl font-heading font-bold text-gray-800 mb-8">Manage Promo Codes</h3>

                                {/* Add Coupon Form */}
                                <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
                                    <h4 className="font-bold text-lg mb-4 text-primary-terracotta border-b pb-2">Create New Promo</h4>
                                    <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Code</label>
                                            <input type="text" placeholder="e.g. SUMMER20" required value={newCoupon.code} onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })} className="border p-3 rounded-lg w-full outline-none focus:border-primary-darkred" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Discount %</label>
                                            <input type="number" placeholder="20" min="1" max="100" required value={newCoupon.discountPercentage} onChange={(e) => setNewCoupon({ ...newCoupon, discountPercentage: e.target.value })} className="border p-3 rounded-lg w-full outline-none focus:border-primary-darkred" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Expiry Date</label>
                                            <input type="date" required value={newCoupon.expiryDate} onChange={(e) => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })} className="border p-3 rounded-lg w-full outline-none focus:border-primary-darkred" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Usage Limit (Opt)</label>
                                            <input type="number" placeholder="100" min="1" value={newCoupon.usageLimit} onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: e.target.value })} className="border p-3 rounded-lg w-full outline-none focus:border-primary-darkred" />
                                        </div>
                                        <div className="md:col-span-4 mt-2">
                                            <button type="submit" className="w-full md:w-auto bg-primary-darkred text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-colors">
                                                Create Promo Code
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                {/* List Coupons */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {coupons.length === 0 && <p className="text-gray-500 col-span-full">No active promo codes.</p>}
                                    {coupons.map(coupon => (
                                        <div key={coupon._id} className={`bg-white p-6 rounded-xl shadow-md border-t-4 ${coupon.isActive && new Date(coupon.expiryDate) > new Date() ? 'border-green-500' : 'border-gray-300 opacity-75'}`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-heading font-black text-2xl tracking-widest text-primary-darkred">{coupon.code}</h4>
                                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {coupon.isActive ? 'Active' : 'Disabled'}
                                                </span>
                                            </div>
                                            <p className="text-3xl font-black text-gray-800 mb-4">{coupon.discountPercentage}% OFF</p>
                                            <div className="space-y-1 text-sm text-gray-500 mb-6">
                                                <p><strong>Expires:</strong> {new Date(coupon.expiryDate).toLocaleDateString()}</p>
                                                <p><strong>Used:</strong> {coupon.usedCount} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : 'times'}</p>
                                            </div>

                                            <div className="flex gap-2">
                                                <button onClick={() => toggleCouponStatus(coupon._id)} className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${coupon.isActive ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                                                    {coupon.isActive ? 'Disable' : 'Enable'}
                                                </button>
                                                <button onClick={() => deleteCoupon(coupon._id)} className="px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg text-sm font-bold transition-colors">
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
