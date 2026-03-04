import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders/myorders');
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Processing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Preparing': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Ready for Pickup': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="pt-32 pb-20 min-h-screen flex justify-center items-center bg-[#FAF7F2]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-darkred"></div>
            </div>
        );
    }

    return (
        <div className="pt-28 pb-20 min-h-screen bg-[#FAF7F2]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-heading font-extrabold text-[#0f0f0f] mb-4"
                    >
                        My <span className="text-primary-darkred italic">Orders</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-gray-600 max-w-2xl mx-auto font-body"
                    >
                        Track your recent orders and view your history.
                    </motion.p>
                </div>

                {orders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 max-w-2xl mx-auto"
                    >
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">🧾</span>
                        </div>
                        <h3 className="text-2xl font-heading font-bold text-gray-800 mb-2">No orders found</h3>
                        <p className="text-gray-500 font-body">Looks like you haven't placed any orders yet. Check out our menu to get started!</p>
                    </motion.div>
                ) : (
                    <div className="space-y-6 max-w-4xl mx-auto">
                        {orders.map((order, index) => (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                            >
                                {/* Order Header */}
                                <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100">
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Order #{order._id.substring(order._id.length - 6)}</p>
                                        <p className="text-sm text-gray-700 font-medium">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total</p>
                                            <p className="font-heading font-bold text-primary-darkred text-lg">${order.totalPrice.toFixed(2)}</p>
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-6">
                                    <div className="divide-y divide-gray-50">
                                        {order.orderItems.map((item, i) => (
                                            <div key={i} className="py-3 flex items-center gap-4">
                                                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl shadow-sm" />
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-gray-900 font-heading">{item.name}</h4>
                                                    <p className="text-gray-500 text-sm">Qty: {item.qty}</p>
                                                </div>
                                                <p className="font-bold text-gray-700">${(item.price * item.qty).toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Tracking Graphic */}
                                    {['Processing', 'Preparing', 'Ready for Pickup'].includes(order.status) && (
                                        <div className="mt-8 pt-6 border-t border-gray-100">
                                            <h4 className="font-heading font-bold text-sm uppercase tracking-widest text-gray-400 mb-4">Live Tracking</h4>
                                            <div className="relative">
                                                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full z-0"></div>
                                                <div className="absolute top-1/2 left-0 h-1 bg-primary-gold -translate-y-1/2 rounded-full z-0 transition-all duration-1000" style={{
                                                    width: order.status === 'Processing' ? '15%' :
                                                        order.status === 'Preparing' ? '50%' :
                                                            order.status === 'Ready for Pickup' ? '90%' : '0%'
                                                }}></div>

                                                <div className="relative z-10 flex justify-between">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm border-2 ${order.status === 'Processing' || order.status === 'Preparing' || order.status === 'Ready for Pickup' ? 'bg-primary-gold border-primary-gold text-black shadow-[0_0_10px_rgba(207,181,59,0.5)]' : 'bg-white border-gray-200 text-gray-400'}`}>✓</div>
                                                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500">Processing</span>
                                                    </div>
                                                    <div className="flex flex-col items-center gap-2">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm border-2 ${order.status === 'Preparing' || order.status === 'Ready for Pickup' ? 'bg-primary-gold border-primary-gold text-black shadow-[0_0_10px_rgba(207,181,59,0.5)]' : 'bg-white border-gray-200 text-gray-400'}`}>🍳</div>
                                                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500">Preparing</span>
                                                    </div>
                                                    <div className="flex flex-col items-center gap-2">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm border-2 ${order.status === 'Ready for Pickup' ? 'bg-primary-gold border-primary-gold text-black shadow-[0_0_10px_rgba(207,181,59,0.5)]' : 'bg-white border-gray-200 text-gray-400'}`}>🛍️</div>
                                                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500">Ready</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
