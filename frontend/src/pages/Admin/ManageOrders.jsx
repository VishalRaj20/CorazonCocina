import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders');
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (id, newStatus) => {
        try {
            await api.put(`/orders/${id}/status`, { status: newStatus });
            fetchOrders(); // Refresh table
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Processing': return 'bg-yellow-100 text-yellow-800';
            case 'Preparing': return 'bg-blue-100 text-blue-800';
            case 'Ready for Pickup': return 'bg-purple-100 text-purple-800';
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center flex-col items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-darkred mb-4"></div>
                <p className="text-gray-500 font-body">Loading kitchen orders...</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#0f0f0f] text-white">
                <h2 className="text-2xl font-heading font-bold">Live Kitchen Orders</h2>
                <div className="bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
                    <span className="text-primary-gold font-bold text-sm tracking-widest uppercase">{orders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled').length} Active</span>
                </div>
            </div>

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
                        {orders.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <p className="font-bold text-gray-900 font-heading">#{order._id.substring(order._id.length - 6)}</p>
                                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleTimeString()} - {new Date(order.createdAt).toLocaleDateString()}</p>
                                </td>
                                <td className="p-4">
                                    <p className="font-medium text-gray-800">{order.customerInfo?.name || order.user?.name || 'Guest'}</p>
                                    <p className="text-xs text-gray-500">{order.customerInfo?.email || '-'}</p>
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
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-center border ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        ) : (
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateStatus(order._id, e.target.value)}
                                                className={`appearance-none font-bold text-xs uppercase tracking-wider pl-4 pr-10 py-2 rounded-xl outline-none border cursor-pointer transition-all ${getStatusColor(order.status)}`}
                                            >
                                                <option value="Processing">Processing</option>
                                                <option value="Preparing">Preparing</option>
                                                <option value="Ready for Pickup">Ready for Pickup</option>
                                                <option value="Completed">Completed</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        )}
                                        {/* Dropdown Arrow custom styling omitted for conciseness but implied by native select */}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {orders.length === 0 && (
                    <div className="p-12 text-center text-gray-500 font-body">
                        No orders have been placed yet.
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ManageOrders;
