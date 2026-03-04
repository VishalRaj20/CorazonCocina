import Order from '../models/Order.js';

// @desc    Get analytics data
// @route   GET /api/analytics
// @access  Private/Admin
export const getAnalytics = async (req, res) => {
    try {
        // Total Orders
        const totalOrders = await Order.countDocuments();

        // Total Revenue (excluding cancelled orders)
        const orders = await Order.find({ status: { $ne: 'Cancelled' }, paymentStatus: { $ne: 'Failed' } });
        const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

        // Active Users (simplified - just count logic for demonstration, ideally from User.count)
        // Let's just return basic order analytics

        // Sales Over Time (Last 7 Days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentOrders = await Order.find({
            createdAt: { $gte: sevenDaysAgo },
            status: { $ne: 'Cancelled' },
            paymentStatus: { $ne: 'Failed' }
        }).sort({ createdAt: 1 });

        const revenueByDate = {};
        recentOrders.forEach(order => {
            const date = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (!revenueByDate[date]) {
                revenueByDate[date] = 0;
            }
            revenueByDate[date] += order.totalPrice;
        });

        const revenueChartData = Object.keys(revenueByDate).map(date => ({
            date,
            revenue: Number(revenueByDate[date].toFixed(2))
        }));

        // Top Selling Items
        const itemSales = {};
        orders.forEach(order => {
            order.orderItems.forEach(item => {
                if (!itemSales[item.name]) {
                    itemSales[item.name] = { name: item.name, qty: 0, revenue: 0 };
                }
                itemSales[item.name].qty += item.qty;
                itemSales[item.name].revenue += (item.qty * item.price);
            });
        });

        const topItems = Object.values(itemSales)
            .sort((a, b) => b.qty - a.qty)
            .slice(0, 5) // Top 5
            .map(item => ({ ...item, revenue: Number(item.revenue.toFixed(2)) }));

        res.json({
            totalOrders,
            totalRevenue: Number(totalRevenue.toFixed(2)),
            revenueChartData,
            topItems
        });
    } catch (error) {
        console.error('Analytics Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
