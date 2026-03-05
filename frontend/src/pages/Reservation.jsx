import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const generateTimeSlots = () => {
    const slots = [];

    // Lunch: 12:15 PM to 3:00 PM
    let h = 12;
    let m = 15;
    while (h < 15 || (h === 15 && m === 0)) {
        const displayH = h > 12 ? h - 12 : h;
        const displayM = m === 0 ? '00' : m;
        const valueH = h < 10 ? `0${h}` : h;
        slots.push({ label: `${displayH}:${displayM} PM`, value: `${valueH}:${displayM}`, group: 'Lunch' });
        m += 15;
        if (m === 60) { m = 0; h += 1; }
    }

    // Dinner: 3:15 PM to 11:45 PM
    h = 15;
    m = 15;
    while (h < 23 || (h === 23 && m <= 45)) {
        const displayH = h > 12 ? h - 12 : h;
        const displayM = m === 0 ? '00' : m;
        const valueH = h < 10 ? `0${h}` : h;
        slots.push({ label: `${displayH}:${displayM} PM`, value: `${valueH}:${displayM}`, group: 'Dinner' });
        m += 15;
        if (m === 60) { m = 0; h += 1; }
    }
    return slots;
};

const TIME_SLOTS = generateTimeSlots();

const Reservation = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        guests: '2',
        date: '',
        time: '',
        specialRequest: ''
    });
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        try {
            await api.post('/reservations', formData);
            setStatus('success');
            setFormData({ name: '', phone: '', email: '', guests: '2', date: '', time: '', specialRequest: '' });
            setTimeout(() => setStatus('idle'), 5000);
        } catch (error) {
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <div className="pt-28 pb-20 min-h-screen bg-primary-beige relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-20 right-0 w-64 h-64 bg-primary-terracotta rounded-full filter blur-[100px] opacity-20"></div>
            <div className="absolute bottom-20 left-0 w-80 h-80 bg-primary-darkgreen rounded-full filter blur-[100px] opacity-10"></div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
                >
                    <div className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary-darkred mb-4">Book a Table</h1>
                        <p className="text-gray-600 font-body text-lg">
                            Reserve your spot and experience authentic Mexican flavor and luxury.
                        </p>
                    </div>

                    <AnimatePresence>
                        {status === 'success' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-xl mb-8 flex justify-between items-center"
                            >
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Reservation Confirmed!</h4>
                                    <p>We look forward to hosting you at Corazón Cocina.</p>
                                </div>
                            </motion.div>
                        )}

                        {status === 'error' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl mb-8"
                            >
                                <p className="font-bold">Oops! Something went wrong. Please try again or call us.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-all"
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-all"
                                    placeholder="(407) 123-4567"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">Number of Guests</label>
                                <select
                                    name="guests"
                                    value={formData.guests}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-all appearance-none"
                                >
                                    {[...Array(10)].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? 'Guest' : 'Guests'}</option>
                                    ))}
                                    <option value="Larger">Larger Party (Please call)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    required
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">Time</label>
                                <select
                                    name="time"
                                    required
                                    value={formData.time}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-all appearance-none bg-white"
                                >
                                    <option value="" disabled>Select a time</option>
                                    <optgroup label="Lunch Service">
                                        {TIME_SLOTS.filter(s => s.group === 'Lunch').map(slot => (
                                            <option key={slot.value} value={slot.value}>{slot.label}</option>
                                        ))}
                                    </optgroup>
                                    <optgroup label="Dinner Service">
                                        {TIME_SLOTS.filter(s => s.group === 'Dinner').map(slot => (
                                            <option key={slot.value} value={slot.value}>{slot.label}</option>
                                        ))}
                                    </optgroup>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Special Requests (Optional)</label>
                            <textarea
                                name="specialRequest"
                                rows="4"
                                value={formData.specialRequest}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-all"
                                placeholder="Anniversary, Dietary Restrictions, etc."
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'submitting'}
                            className="w-full bg-primary-darkred text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition-colors duration-300 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {status === 'submitting' ? 'Confirming...' : 'Confirm Reservation'}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Reservation;
