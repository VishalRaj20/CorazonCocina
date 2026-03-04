import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
    return (
        <section className="py-20 bg-primary-beige">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full md:w-1/2 relative"
                    >
                        <div className="z-10 relative border-4 border-primary-gold p-2">
                            <img
                                src="https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                alt="Chef preparing tacos"
                                className="w-full h-auto shadow-2xl object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-full h-full bg-primary-darkgreen z-0"></div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-full md:w-1/2"
                    >
                        <h4 className="text-primary-terracotta font-bold tracking-widest uppercase mb-2">Our Story</h4>
                        <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
                            A Taste of <span className="text-primary-darkred">Tradition</span>
                        </h2>
                        <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                            At Corazón Cocina Mexicana, we believe that food is the heart of family and culture.
                            Our recipes have been passed down through generations, bringing the authentic, vibrant
                            flavors of Mexico straight to your table in Orlando.
                        </p>
                        <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                            Whether you're craving our signature slow-roasted carnitas or a refreshing,
                            hand-crafted margarita, every dish is prepared with fresh ingredients, love,
                            and a touch of modern luxury.
                        </p>
                        <div className="flex items-center gap-6">
                            <div>
                                <h5 className="font-heading text-3xl font-bold text-primary-darkred">10+</h5>
                                <p className="text-sm text-gray-500 uppercase tracking-wide">Years Experience</p>
                            </div>
                            <div className="w-px h-12 bg-gray-300"></div>
                            <div>
                                <h5 className="font-heading text-3xl font-bold text-primary-darkred">100%</h5>
                                <p className="text-sm text-gray-500 uppercase tracking-wide">Authentic Recipes</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;
