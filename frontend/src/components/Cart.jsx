import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { FaTimes, FaTrash, FaShoppingCart, FaCreditCard, FaPaypal, FaApple } from 'react-icons/fa';
import api from '../services/api';

const Cart = () => {
    const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

    // Checkout State
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [checkoutStep, setCheckoutStep] = useState(1); // 1: Form, 2: Processing, 3: Success
    const [paymentMethod, setPaymentMethod] = useState('card'); // card, paypal, apple
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', address: '', city: '', zipCode: '', instructions: '',
        card: '', expiry: '', cvc: ''
    });

    const handleCheckout = () => {
        setIsCheckoutOpen(true);
    };

    // Discount State
    const [couponCode, setCouponCode] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponError, setCouponError] = useState('');
    const [availablePoints, setAvailablePoints] = useState(0);
    const [usePoints, setUsePoints] = useState(false);

    useEffect(() => {
        if (isCheckoutOpen) {
            api.get('/users/profile')
                .then(res => setAvailablePoints(res.data.loyaltyPoints || 0))
                .catch(console.error);
        }
    }, [isCheckoutOpen]);

    const applyCoupon = async () => {
        try {
            const { data } = await api.post('/coupons/validate', { code: couponCode });
            setCouponDiscount(data.discountPercentage);
            setCouponError('');
        } catch (error) {
            setCouponDiscount(0);
            setCouponError(error.response?.data?.message || 'Invalid coupon');
        }
    };

    const discountAmount = cartTotal * (couponDiscount / 100);
    const maxPointsToUse = Math.floor(availablePoints / 100) * 100;
    const pointsDiscount = usePoints ? (maxPointsToUse / 100) * 5 : 0;
    const finalTotal = Math.max(0, cartTotal - discountAmount - pointsDiscount);

    const processPayment = async (e) => {
        e.preventDefault();
        setCheckoutStep(2);

        try {
            // Call API to create order using real cart data
            const orderData = {
                orderItems: cart,
                customerInfo: {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    zipCode: formData.zipCode,
                },
                instructions: formData.instructions,
                paymentMethod: paymentMethod,
                couponCode: couponDiscount > 0 ? couponCode : undefined,
                usedLoyaltyPoints: usePoints ? maxPointsToUse : 0,
                totalPrice: finalTotal
            };

            await api.post('/orders', orderData);

            setCheckoutStep(3);
            clearCart();
        } catch (error) {
            console.error('Order creation failed:', error);
            alert(error.response?.data?.message || 'Payment failed. Please try again.');
            setCheckoutStep(1); // Go back to form on error
        }
    };

    const closeAll = () => {
        setIsCheckoutOpen(false);
        setIsCartOpen(false);
        setTimeout(() => {
            setCheckoutStep(1);
            setFormData({ name: '', email: '', phone: '', address: '', city: '', zipCode: '', instructions: '', card: '', expiry: '', cvc: '' });
        }, 500); // Reset after animation
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black bg-opacity-50 z-50 backdrop-blur-sm"
                    ></motion.div>

                    {/* Cart Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-2xl font-heading font-bold text-primary-darkred">Your Cart</h2>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="text-gray-500 hover:text-primary-terracotta transition-colors"
                                aria-label="Close Cart"
                            >
                                <FaTimes size={24} />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-grow overflow-y-auto p-6 space-y-6">
                            {cart.length === 0 ? (
                                <div className="text-center text-gray-500 mt-20">
                                    <p className="font-body text-lg">Your cart is empty.</p>
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="mt-4 text-primary-terracotta font-bold hover:underline"
                                    >
                                        Continue Browsing
                                    </button>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <div key={item._id} className="flex gap-4 border-b border-gray-100 pb-4">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-20 h-20 object-cover rounded-lg shadow-sm"
                                        />
                                        <div className="flex-grow">
                                            <div className="flex justify-between mb-1">
                                                <h4 className="font-bold text-gray-900 group-hover:text-primary-darkred transition-colors line-clamp-1">
                                                    {item.name}
                                                </h4>
                                                <button
                                                    onClick={() => removeFromCart(item._id)}
                                                    className="text-red-500 hover:text-red-700 p-1"
                                                >
                                                    <FaTrash size={14} />
                                                </button>
                                            </div>
                                            <p className="text-primary-terracotta font-bold text-sm mb-2">
                                                ${item.price.toFixed(2)}
                                            </p>
                                            <div className="flex items-center space-x-3">
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.qty - 1)}
                                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                                                >
                                                    -
                                                </button>
                                                <span className="font-bold w-4 text-center">{item.qty}</span>
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.qty + 1)}
                                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div className="p-6 border-t border-gray-100 bg-gray-50">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="font-bold text-gray-600 text-lg">Total</span>
                                    <span className="font-heading font-bold text-2xl text-primary-darkred">
                                        ${cartTotal.toFixed(2)}
                                    </span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-primary-darkgreen text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition-colors duration-300 shadow-xl"
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}

            {/* Dummy Checkout Modal Overlay */}
            {isCheckoutOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeAll}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                    ></motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-primary-darkred p-5 text-center text-white relative flex-shrink-0">
                            <h3 className="font-heading font-bold text-2xl">Secure Checkout</h3>
                            {checkoutStep === 1 && <p className="text-primary-gold text-sm tracking-widest uppercase mt-1">Total: ${finalTotal.toFixed(2)}</p>}
                            <button onClick={closeAll} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
                                <FaTimes size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            {checkoutStep === 1 && (
                                <form onSubmit={processPayment} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                                    <div className="space-y-3 pb-4 border-b border-gray-100">
                                        <h4 className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-2">Contact Info</h4>
                                        <input required type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-primary-darkred focus:ring-1 focus:ring-primary-darkred outline-none transition-colors" />
                                        <input required type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-primary-darkred focus:ring-1 focus:ring-primary-darkred outline-none transition-colors" />
                                        <input required type="tel" placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-primary-darkred focus:ring-1 focus:ring-primary-darkred outline-none transition-colors" />
                                    </div>

                                    <div className="space-y-3 pb-4 border-b border-gray-100">
                                        <h4 className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-2">Delivery Address</h4>
                                        <input required type="text" placeholder="Street Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-primary-darkred focus:ring-1 focus:ring-primary-darkred outline-none transition-colors" />
                                        <div className="flex gap-3">
                                            <input required type="text" placeholder="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-1/2 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-primary-darkred focus:ring-1 focus:ring-primary-darkred outline-none transition-colors" />
                                            <input required type="text" placeholder="Zip Code" value={formData.zipCode} onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })} className="w-1/2 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-primary-darkred focus:ring-1 focus:ring-primary-darkred outline-none transition-colors" />
                                        </div>
                                        <textarea placeholder="Delivery Instructions (Optional)" value={formData.instructions} onChange={(e) => setFormData({ ...formData, instructions: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-primary-darkred focus:ring-1 focus:ring-primary-darkred outline-none transition-colors resize-none h-20"></textarea>
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="text-xs font-bold text-gray-400 tracking-widest uppercase">Select Payment Method</p>
                                        </div>
                                        <div className="flex gap-2 mb-4">
                                            <button type="button" onClick={() => setPaymentMethod('card')} className={`flex-1 py-3 flex justify-center items-center rounded-xl border transition-all ${paymentMethod === 'card' ? 'border-primary-darkred text-primary-darkred bg-red-50' : 'border-gray-200 text-gray-400 hover:bg-gray-50'}`}>
                                                <FaCreditCard size={20} />
                                            </button>
                                            <button type="button" onClick={() => setPaymentMethod('paypal')} className={`flex-1 py-3 flex justify-center items-center rounded-xl border transition-all ${paymentMethod === 'paypal' ? 'border-primary-darkred text-[#00457C] bg-blue-50' : 'border-gray-200 text-gray-400 hover:bg-gray-50'}`}>
                                                <FaPaypal size={20} />
                                            </button>
                                            <button type="button" onClick={() => setPaymentMethod('apple')} className={`flex-1 py-3 flex justify-center items-center rounded-xl border transition-all ${paymentMethod === 'apple' ? 'border-primary-darkred text-black bg-gray-100' : 'border-gray-200 text-gray-400 hover:bg-gray-50'}`}>
                                                <FaApple size={24} />
                                            </button>
                                        </div>

                                        {paymentMethod === 'card' && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3">
                                                <input required={paymentMethod === 'card'} type="text" placeholder="Card Number (e.g. 4242...)" value={formData.card} onChange={(e) => setFormData({ ...formData, card: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-primary-darkred focus:ring-1 focus:ring-primary-darkred outline-none transition-colors" />
                                                <div className="flex gap-3">
                                                    <input required={paymentMethod === 'card'} type="text" placeholder="MM/YY" value={formData.expiry} onChange={(e) => setFormData({ ...formData, expiry: e.target.value })} className="w-1/2 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-primary-darkred focus:ring-1 focus:ring-primary-darkred outline-none transition-colors" />
                                                    <input required={paymentMethod === 'card'} type="text" placeholder="CVC" value={formData.cvc} onChange={(e) => setFormData({ ...formData, cvc: e.target.value })} className="w-1/2 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-primary-darkred focus:ring-1 focus:ring-primary-darkred outline-none transition-colors" />
                                                </div>
                                            </motion.div>
                                        )}
                                        {paymentMethod === 'paypal' && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="py-2 text-center text-sm text-gray-500">
                                                You will be redirected to PayPal to complete your purchase securely.
                                            </motion.div>
                                        )}
                                        {paymentMethod === 'apple' && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="py-2 text-center text-sm text-gray-500">
                                                Confirm payment securely using your Apple device.
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Discount & Rewards Section */}
                                    <div className="space-y-3 pt-2 border-t border-gray-100">
                                        <h4 className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-1">Rewards & Discounts</h4>

                                        {availablePoints >= 100 && (
                                            <div className="flex items-center justify-between p-3 bg-primary-beige/30 rounded-xl border border-primary-gold/30">
                                                <div>
                                                    <p className="text-sm font-bold text-gray-800">Use Loyalty Points</p>
                                                    <p className="text-xs text-gray-500">You have {availablePoints} points. Use {maxPointsToUse} for ${((maxPointsToUse / 100) * 5).toFixed(2)} off.</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={usePoints}
                                                    onChange={() => setUsePoints(!usePoints)}
                                                    className="w-5 h-5 text-primary-darkred focus:ring-primary-darkred border-gray-300 rounded"
                                                />
                                            </div>
                                        )}

                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Promo Code"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:border-primary-darkred outline-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={applyCoupon}
                                                className="bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-black transition-colors"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                        {couponDiscount > 0 && <p className="text-green-600 text-xs font-bold">Coupon applied! {couponDiscount}% off.</p>}
                                        {couponError && <p className="text-red-500 text-xs">{couponError}</p>}
                                    </div>

                                    <button type="submit" className="w-full bg-primary-darkgreen text-white font-bold py-4 rounded-xl mt-6 shadow-lg shadow-primary-darkgreen/30 hover:bg-green-800 transition-colors flex items-center justify-center gap-2">
                                        Pay ${finalTotal.toFixed(2)} {paymentMethod === 'apple' && <FaApple size={18} />}
                                    </button>
                                </form>
                            )}

                            {checkoutStep === 2 && (
                                <div className="flex flex-col items-center justify-center py-10">
                                    <div className="w-16 h-16 border-4 border-gray-200 border-t-primary-darkred rounded-full animate-spin mb-6"></div>
                                    <h4 className="text-xl font-heading font-bold text-gray-800">Processing Payment...</h4>
                                    <p className="text-sm text-gray-500 mt-2">Please do not close this window.</p>
                                </div>
                            )}

                            {checkoutStep === 3 && (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                    <h4 className="text-2xl font-heading font-bold text-gray-900 mb-2">Payment Successful!</h4>
                                    <p className="text-gray-500 mb-8 max-w-[80%]">Your order has been placed successfully. A receipt has been sent to your email.</p>
                                    <button onClick={closeAll} className="w-full bg-primary-darkred text-white font-bold py-4 rounded-xl hover:bg-black transition-colors focus:outline-none">
                                        Return to Home
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default Cart;
