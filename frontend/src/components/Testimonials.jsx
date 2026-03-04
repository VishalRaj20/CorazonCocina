import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import api from '../services/api';

const Testimonials = () => {
    const [reviews, setReviews] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/reviews', newReview);
            setSubmitMessage('Thank you! Your review has been submitted for approval.');
            setNewReview({ name: '', rating: 5, comment: '' });
            setTimeout(() => setSubmitMessage(''), 5000);
        } catch (error) {
            setSubmitMessage('Failed to submit review. Please try again.');
            setTimeout(() => setSubmitMessage(''), 5000);
        } finally {
            setIsSubmitting(false);
        }
    };

    const mockReviews = [
        {
            _id: '1',
            name: 'Sarah Johnson',
            rating: 5,
            comment: 'Absolutely phenomenal! The Birria tacos are life-changing. Best Mexican restaurant in Orlando hands down.',
        },
        {
            _id: '2',
            name: 'Michael Chen',
            rating: 5,
            comment: 'The ambiance is incredible—luxurious yet welcoming. Their margaritas and fajitas are a must-try.',
        },
        {
            _id: '3',
            name: 'Elena Rodriguez',
            rating: 4,
            comment: 'Authentic flavors that remind me of home. The vegan options are surprisingly delicious too!',
        }
    ];

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { data } = await api.get('/reviews');
                if (data.length > 0) {
                    setReviews(data);
                } else {
                    setReviews(mockReviews);
                }
            } catch (error) {
                setReviews(mockReviews);
            }
        };
        fetchReviews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (reviews.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % reviews.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [reviews]);

    if (reviews.length === 0) return null;

    return (
        <section className="py-24 bg-[#111111] relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[-10%] right-[-5%] opacity-10 blur-sm pointer-events-none">
                <svg width="600" height="600" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="2" strokeDasharray="4 4" />
                    <circle cx="50" cy="50" r="25" stroke="white" strokeWidth="1" />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                    {/* Left Side - Testimonials Slider */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center lg:text-left"
                    >
                        <div className="flex justify-center lg:justify-start mb-6">
                            {[...Array(5)].map((_, i) => (
                                <FaStar key={i} className="text-primary-gold w-6 h-6 mx-1 drop-shadow-md" />
                            ))}
                        </div>
                        <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-4">4.8 Average Rating</h2>
                        <p className="text-primary-beige mb-12 uppercase tracking-[0.2em] text-sm font-bold opacity-80">What Our Guests Say</p>

                        <div className="relative min-h-[220px]">
                            <FaQuoteLeft className="absolute -top-6 -left-4 text-white/10 w-24 h-24 pointer-events-none" />
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentIndex}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5 }}
                                    className="absolute inset-0 flex flex-col justify-start"
                                >
                                    <p className="text-2xl md:text-4xl font-heading italic text-white mb-8 leading-tight drop-shadow-sm">
                                        "{reviews[currentIndex].comment}"
                                    </p>
                                    <p className="text-xl font-body font-bold text-primary-gold uppercase tracking-wider">
                                        — {reviews[currentIndex].name}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="flex justify-center lg:justify-start space-x-3 mt-12">
                            {reviews.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`w-12 h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-primary-gold w-16' : 'bg-white/30 hover:bg-white/60'
                                        }`}
                                    aria-label={`Go to slide ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Side - Submit Review Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="bg-white/5 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl relative"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-gold opacity-10 blur-2xl rounded-full"></div>

                        <div className="mb-10 text-center lg:text-left">
                            <h3 className="text-3xl font-heading font-extrabold text-white mb-3">Leave a Review</h3>
                            <p className="text-primary-beige font-body text-sm tracking-wide opacity-80">Loved your meal? Share your experience with us!</p>
                        </div>

                        {submitMessage ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`p-6 rounded-2xl text-center font-bold text-lg ${submitMessage.includes('Thank you')
                                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                                    }`}
                            >
                                {submitMessage}
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmitReview} className="space-y-6 relative z-10">
                                <div>
                                    <label className="block tracking-[0.1em] text-[10px] font-bold text-primary-gold uppercase mb-2 ml-1">Your Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="E.g. John Doe"
                                        value={newReview.name}
                                        onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-primary-gold focus:ring-1 focus:ring-primary-gold transition-all duration-300 font-body"
                                    />
                                </div>

                                <div>
                                    <label className="block tracking-[0.1em] text-[10px] font-bold text-primary-gold uppercase mb-3 ml-1">Rating</label>
                                    <div className="flex space-x-3 bg-black/20 w-fit px-5 py-3 rounded-2xl border border-white/10">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                type="button"
                                                key={star}
                                                onClick={() => setNewReview({ ...newReview, rating: star })}
                                                className="focus:outline-none transition-transform hover:scale-125"
                                            >
                                                <FaStar className={`w-7 h-7 transition-colors ${newReview.rating >= star ? 'text-primary-gold drop-shadow-lg' : 'text-white/20'}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block tracking-[0.1em] text-[10px] font-bold text-primary-gold uppercase mb-2 ml-1">Your Experience</label>
                                    <textarea
                                        required
                                        rows="3"
                                        placeholder="Tell us about the dishes, service, and atmosphere..."
                                        value={newReview.comment}
                                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-primary-gold focus:ring-1 focus:ring-primary-gold transition-all duration-300 font-body resize-none"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-primary-gold text-black font-heading tracking-[0.15em] uppercase font-extrabold shadow-xl text-sm py-5 rounded-2xl hover:bg-white hover:shadow-primary-gold/40 transition-all duration-300 disabled:opacity-70 flex justify-center items-center mt-4"
                                >
                                    {isSubmitting ? (
                                        <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        'Submit Your Review'
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default Testimonials;
