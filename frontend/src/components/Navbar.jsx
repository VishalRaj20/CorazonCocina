import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBars, FaTimes, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { user, logout } = useAuth();
    const { cart, setIsCartOpen } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        // Fire once to set initial state
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Menu', path: '/menu' },
        { name: 'Reservation', path: '/reservation' },
    ];

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-500 border-b ${isScrolled
                ? 'bg-[#0f0f0f]/95 backdrop-blur-xl shadow-2xl border-white/10 py-2'
                : 'bg-[#0f0f0f]/80 backdrop-blur-md border-transparent shadow-lg py-4'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`flex justify-between items-center transition-all duration-500 h-16`}>

                    {/* Logo Section */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="font-heading text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2 group">
                            <span className="text-3xl group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">🌶️</span>
                            Corazón <span className="text-primary-gold italic">Cocina</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-10">
                        {navLinks.map((link) => (
                            <div key={link.name} className="relative group overflow-hidden py-2">
                                <Link
                                    to={link.path}
                                    className={`font-heading tracking-[0.2em] uppercase text-xs font-bold transition-colors flex items-center h-full ${location.pathname === link.path
                                        ? 'text-primary-gold drop-shadow-[0_0_8px_rgba(207,181,59,0.5)]'
                                        : 'text-gray-300 group-hover:text-white'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                                <span className={`absolute bottom-0 left-0 h-[2px] bg-primary-gold transition-all duration-300 ease-out ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                                    }`}></span>
                            </div>
                        ))}

                        <div className="flex items-center space-x-8 border-l border-white/20 pl-8 ml-2">
                            {user ? (
                                <div className="flex items-center space-x-6">
                                    {user.isAdmin && (
                                        <Link
                                            to="/admin"
                                            className="text-gray-300 hover:text-white font-heading tracking-widest uppercase text-[11px] font-bold transition-all relative group"
                                        >
                                            Admin
                                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="text-gray-300 hover:text-red-400 font-heading tracking-widest uppercase text-[11px] font-bold transition-all relative group"
                                    >
                                        Logout
                                        <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-red-400 transition-all duration-300 group-hover:w-full"></span>
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="bg-primary-gold/10 text-primary-gold hover:bg-primary-gold hover:text-black hover:shadow-[0_0_15px_rgba(207,181,59,0.4)] border border-primary-gold/50 font-heading tracking-[0.1em] uppercase text-[11px] font-bold transition-all duration-300 px-6 py-2.5 rounded-full"
                                >
                                    Login
                                </Link>
                            )}

                            {/* Cart Icon */}
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="relative p-2 text-primary-gold hover:text-white transition-all hover:scale-110 group"
                                aria-label="Open cart"
                            >
                                <FaShoppingCart size={22} className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" />
                                {cart.length > 0 && (
                                    <span className="absolute -top-1 -right-2 inline-flex items-center justify-center w-5 h-5 text-[10px] font-black text-black bg-primary-gold rounded-full shadow-[0_0_10px_rgba(207,181,59,0.5)] border-2 border-[#0f0f0f]">
                                        {cart.reduce((a, c) => a + c.qty, 0)}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center space-x-5">
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative p-2 text-primary-gold hover:text-white transition-transform hover:scale-110"
                        >
                            <FaShoppingCart size={22} />
                            {cart.length > 0 && (
                                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-[10px] font-black text-black bg-primary-gold rounded-full shadow-md border-2 border-[#0f0f0f]">
                                    {cart.reduce((a, c) => a + c.qty, 0)}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-white hover:text-primary-gold focus:outline-none transition-transform hover:scale-110"
                        >
                            {isOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <div className={`md:hidden absolute w-full transition-all duration-300 ease-in-out border-t border-white/10 bg-[#0f0f0f]/95 backdrop-blur-2xl shadow-2xl origin-top ${isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}>
                <div className="px-6 py-8 space-y-6 flex flex-col items-center">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`block text-2xl font-heading tracking-[0.2em] uppercase font-bold transition-colors ${location.pathname === link.path
                                ? 'text-primary-gold drop-shadow-md'
                                : 'text-gray-300 hover:text-white'
                                }`}
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}

                    {/* Mobile Authenticated User Links */}
                    {user && (
                        <Link
                            to="/orders"
                            className={`block text-2xl font-heading tracking-[0.2em] uppercase font-bold transition-colors ${location.pathname === '/orders'
                                    ? 'text-primary-gold drop-shadow-md'
                                    : 'text-gray-300 hover:text-white'
                                }`}
                            onClick={() => setIsOpen(false)}
                        >
                            My Orders
                        </Link>
                    )}

                    <div className="w-24 h-[1px] bg-white/20 mt-4 mb-4"></div>

                    {user ? (
                        <>
                            {user.isAdmin && (
                                <Link
                                    to="/admin"
                                    className="block text-lg font-heading tracking-widest uppercase font-bold text-gray-400 hover:text-white transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Admin Dashboard
                                </Link>
                            )}
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setIsOpen(false);
                                }}
                                className="block text-lg font-heading tracking-widest uppercase font-bold text-red-500 hover:text-red-400 transition-colors"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-primary-gold/10 text-primary-gold border border-primary-gold w-full text-center py-4 rounded-xl text-lg font-heading tracking-[0.2em] uppercase font-bold shadow-lg"
                            onClick={() => setIsOpen(false)}
                        >
                            Secure Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
