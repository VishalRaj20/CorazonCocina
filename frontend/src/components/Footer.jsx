import React from 'react';
import { FaInstagram, FaFacebookF, FaTwitter } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-[#0f0f0f] border-t-4 border-primary-darkred text-white py-16 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div>
                        <h3 className="font-heading text-3xl font-extrabold text-primary-gold mb-4 flex items-center gap-2">
                            <span className="text-2xl">🌶️</span> Corazón Cocina
                        </h3>
                        <p className="font-body text-gray-400 leading-relaxed text-sm pr-4">
                            Authentic Mexican Flavors in the Heart of Orlando. Experience the true taste of Mexico in a luxurious, modern setting.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-heading text-xl font-bold tracking-widest uppercase mb-6 text-white border-b border-gray-800 pb-2 inline-block">
                            Contact & Hours
                        </h4>
                        <div className="space-y-3 text-gray-400 text-sm font-body">
                            <p className="flex items-center gap-2"><span className="text-primary-gold text-lg">📍</span> 6800 Visitors Cir, Orlando, FL 32819</p>
                            <p className="flex items-center gap-2"><span className="text-primary-gold text-lg">📞</span> +1 407-237-9490</p>
                            <div className="pt-2">
                                <p className="font-bold text-white mb-1 tracking-wider text-xs">OPENING HOURS:</p>
                                <div className="flex justify-between">
                                    <span>Sunday - Friday</span>
                                    <span className="text-primary-gold font-bold">12:00 PM - 12:00 AM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Saturday</span>
                                    <span className="text-primary-gold font-bold">12:00 PM - 1:00 AM</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-heading text-xl font-bold tracking-widest uppercase mb-6 text-white border-b border-gray-800 pb-2 inline-block">
                            Follow Us
                        </h4>
                        <div className="flex space-x-5">
                            <a
                                href="https://www.instagram.com/corazoncocinamex/"
                                target="_blank"
                                rel="noreferrer"
                                className="bg-[#1a1a1a] p-3 rounded-full text-gray-300 hover:text-white hover:bg-primary-darkred hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                            >
                                <FaInstagram size={22} />
                            </a>
                            <a
                                href="#"
                                className="bg-[#1a1a1a] p-3 rounded-full text-gray-300 hover:text-white hover:bg-primary-darkred hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                            >
                                <FaFacebookF size={22} />
                            </a>
                            <a
                                href="#"
                                className="bg-[#1a1a1a] p-3 rounded-full text-gray-300 hover:text-white hover:bg-primary-darkred hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                            >
                                <FaTwitter size={22} />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-xs font-body tracking-wider text-gray-500 flex flex-col md:flex-row justify-between items-center">
                    <p>&copy; {new Date().getFullYear()} Corazón Cocina Mexicana. All rights reserved.</p>
                    <p className="mt-2 md:mt-0 space-x-4">
                        <a href="#" className="hover:text-primary-gold transition-colors">Privacy Policy</a>
                        <span>|</span>
                        <a href="#" className="hover:text-primary-gold transition-colors">Terms of Service</a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
