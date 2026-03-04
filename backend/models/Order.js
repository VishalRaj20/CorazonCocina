import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    orderItems: [
        {
            name: { type: String, required: true },
            qty: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            _id: {
                type: String, // Changed to String to allow mock IDs like '1', '2'
                required: true,
            },
        },
    ],
    customerInfo: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        zipCode: { type: String, required: true }
    },
    instructions: {
        type: String,
        default: ''
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    paymentStatus: {
        type: String,
        required: true,
        default: 'Pending',
        enum: ['Pending', 'Paid', 'Failed']
    },
    paidAt: {
        type: Date,
    },
    status: {
        type: String,
        required: true,
        default: 'Pending',
        enum: ['Pending', 'Confirmed', 'Preparing', 'Out for delivery', 'Delivered', 'Cancelled']
    }
}, {
    timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
