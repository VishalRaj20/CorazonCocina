import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <div className="relative h-screen flex items-center justify-center overflow-hidden">
            <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')",
                    filter: "brightness(0.4)"
                }}
            />
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 drop-shadow-lg"
                >
                    Authentic Mexican Flavors in the Heart of Orlando
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-xl md:text-2xl text-gray-200 mb-10 font-body drop-shadow-md"
                >
                    A culinary journey blending rich traditions, vibrant spices, and modern luxury.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row justify-center gap-4"
                >
                    <Link
                        to="/menu"
                        className="bg-primary-darkred text-white py-3 px-8 rounded-full font-bold hover:bg-primary-terracotta transition-colors shadow-lg text-lg border-2 border-primary-darkred hover:border-primary-terracotta"
                    >
                        View Menu
                    </Link>
                    <Link
                        to="/reservation"
                        className="bg-transparent text-white py-3 px-8 rounded-full font-bold hover:bg-white hover:text-primary-darkred transition-colors shadow-lg text-lg border-2 border-white backdrop-blur-sm"
                    >
                        Book a Table
                    </Link>
                </motion.div>
            </div>

            {/* Scroll indicator down arrow */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-6 h-10 border-2 border-white rounded-full flex justify-center p-1"
                >
                    <div className="w-1 h-3 bg-white rounded-full" />
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Hero;
