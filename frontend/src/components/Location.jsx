import React from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhoneAlt, FaClock, FaUtensils, FaLeaf, FaCheckCircle } from 'react-icons/fa';

const Location = () => {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Info Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="bg-primary-darkred text-white p-10 md:p-14 rounded-2xl shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 opacity-10 blur-xl">
                            <div className="w-64 h-64 bg-primary-gold rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-4xl font-heading font-bold mb-8 text-white">Visit <span className="text-primary-gold">Us</span></h2>

                            <div className="space-y-6 mb-10">
                                <div className="flex items-start">
                                    <FaMapMarkerAlt className="text-primary-gold w-6 h-6 mr-4 mt-1 flex-shrink-0" />
                                    <div>
                                        <h5 className="font-bold text-lg mb-1 text-white">Located in Orlando</h5>
                                        <p className="text-gray-300">6800 Visitors Cir<br />Orlando, FL 32819</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <FaPhoneAlt className="text-primary-gold w-6 h-6 mr-4 mt-1 flex-shrink-0" />
                                    <div>
                                        <h5 className="font-bold text-lg mb-1 text-white">Call for Inquiries</h5>
                                        <p className="text-gray-300">+1 407-237-9490</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <FaClock className="text-primary-gold w-6 h-6 mr-4 mt-1 flex-shrink-0" />
                                    <div className="w-full">
                                        <h5 className="font-bold text-lg mb-2 text-white">Opening Hours</h5>
                                        <div className="space-y-2 text-sm w-full">
                                            <div className="flex justify-between text-gray-300 border-b border-white/10 pb-2">
                                                <span>Sunday - Friday</span>
                                                <span className="font-bold text-white">12:00 PM – 12:00 AM</span>
                                            </div>
                                            <div className="flex justify-between text-gray-300 pt-1">
                                                <span>Saturday</span>
                                                <span className="font-bold text-white">12:00 PM – 1:00 AM</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 pt-8 border-t border-white/20">
                                <div>
                                    <h5 className="font-bold text-lg mb-4 text-white flex items-center gap-2">
                                        <FaUtensils className="text-primary-gold" /> Dining Details
                                    </h5>
                                    <ul className="text-gray-300 space-y-3 text-sm">
                                        <li className="flex flex-col">
                                            <span className="text-primary-gold text-xs font-bold uppercase tracking-wider mb-1">Cuisines</span>
                                            <span className="text-white">Mexican</span>
                                        </li>
                                        <li className="flex flex-col">
                                            <span className="text-primary-gold text-xs font-bold uppercase tracking-wider mb-1">Meal Types</span>
                                            <span className="text-white">Lunch, Dinner</span>
                                        </li>
                                        <li className="flex flex-col">
                                            <span className="text-primary-gold text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                                                Special Diets <FaLeaf className="text-green-400" />
                                            </span>
                                            <span className="text-white">Vegetarian friendly, Vegan options</span>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="font-bold text-lg mb-4 text-white flex items-center gap-2">
                                        <FaCheckCircle className="text-primary-gold" /> Features
                                    </h5>
                                    <ul className="text-gray-300 grid grid-cols-1 gap-2 text-sm">
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary-gold"></div> Reservations</li>
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary-gold"></div> Seating</li>
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary-gold"></div> Serves Alcohol</li>
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary-gold"></div> Table Service</li>
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary-gold"></div> Takeout</li>
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary-gold"></div> Wheelchair Accessible</li>
                                    </ul>
                                </div>
                            </div>

                            <a
                                href="https://maps.google.com/?q=6800+Visitors+Cir,+Orlando,+FL+32819"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-block bg-primary-gold text-primary-darkred font-bold py-3 px-8 rounded-full hover:bg-white transition-colors duration-300 shadow-lg text-lg w-full text-center md:w-auto"
                            >
                                Get Directions
                            </a>
                        </div>
                    </motion.div>

                    {/* Map */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-96 lg:h-full min-h-[400px] w-full rounded-2xl shadow-xl overflow-hidden border-4 border-white"
                    >
                        {/* Embedded Google Map */}
                        <iframe
                            src="https://maps.google.com/maps?q=6800+Visitors+Cir,+Orlando,+FL+32819&t=&z=14&ie=UTF8&iwloc=B&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Restaurant Location"
                        ></iframe>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Location;
