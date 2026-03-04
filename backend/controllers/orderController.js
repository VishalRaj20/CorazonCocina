import Order from '../models/Order.js';
import User from '../models/User.js';
import Coupon from '../models/Coupon.js';
import { sendSMS, sendWhatsApp } from '../services/twilioService.js';
import { sendEmail } from '../services/emailService.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req, res) => {
    const { orderItems, customerInfo, instructions, totalPrice, paymentMethod, couponCode, usedLoyaltyPoints } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    } else {
        const order = new Order({
            orderItems,
            user: req.user._id,
            customerInfo,
            instructions,
            totalPrice,
            paymentStatus: paymentMethod === 'paypal' ? 'Pending' : 'Paid',
            paidAt: paymentMethod === 'paypal' ? null : Date.now(),
            status: 'Confirmed'
        });

        const createdOrder = await order.save();

        // ----------------------------------------------------
        // Loyalty Points & Coupon Updates
        // ----------------------------------------------------
        try {
            const user = await User.findById(req.user._id);
            if (user) {
                // Deduct used points
                if (usedLoyaltyPoints) {
                    user.loyaltyPoints -= usedLoyaltyPoints;
                }
                // Earn new points ($10 spent = 1 point)
                const earnedPoints = Math.floor(totalPrice / 10);
                user.loyaltyPoints += earnedPoints;

                // Track order history
                user.orderHistory.push(createdOrder._id);
                await user.save();
            }

            // Update Coupon Usage
            if (couponCode) {
                const coupon = await Coupon.findOne({ code: couponCode });
                if (coupon) {
                    coupon.usedCount += 1;
                    await coupon.save();
                }
            }
        } catch (updateError) {
            console.error('Failed to update User Points/Coupon:', updateError);
        }

        // ----------------------------------------------------
        // Trigger Notifications to Admins
        // ----------------------------------------------------
        try {
            const admins = await User.find({ role: 'admin' });

            const totalStr = `$${totalPrice.toFixed(2)}`;
            const itemsStr = orderItems.map(i => `${i.qty} ${i.name}`).join(', ');

            const message = `New Order Received!\n\nCustomer: ${customerInfo.name}\nItems: ${itemsStr}\nTotal: ${totalStr}\nAddress: ${customerInfo.city}, ${customerInfo.zipCode}\n\nCheck Admin Dashboard.`;
            const htmlMessage = `<h2>New Order Received!</h2><p><strong>Customer:</strong> ${customerInfo.name}</p><p><strong>Items:</strong> ${itemsStr}</p><p><strong>Total:</strong> ${totalStr}</p><p><strong>Address:</strong> ${customerInfo.address}, ${customerInfo.city} ${customerInfo.zipCode}</p><p>Please check the Admin Dashboard to process this order.</p>`;

            for (const admin of admins) {
                if (admin.phone) {
                    sendSMS(admin.phone, message).catch(err => console.error(err));
                    sendWhatsApp(admin.phone, message).catch(err => console.error(err));
                }
                if (admin.email) {
                    sendEmail(admin.email, 'New Order Received', htmlMessage).catch(err => console.error(err));
                }
            }
        } catch (notifError) {
            console.error('Failed to send notifications:', notifError);
        }

        res.status(201).json(createdOrder);
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
    res.json(orders);
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.status = req.body.status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
};
