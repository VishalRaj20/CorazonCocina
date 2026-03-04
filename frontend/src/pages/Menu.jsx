import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaCartPlus } from 'react-icons/fa';

const Menu = () => {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState(['All']);
    const [activeCategory, setActiveCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleAddToCart = (item) => {
        if (!user) {
            navigate('/login');
            return;
        }
        addToCart(item);
    };

    const mockMenu = [
        { _id: '1', name: 'Birria Tacos', category: 'Tacos', description: 'Slow-cooked beef, consommé.', price: 15.99, image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', available: true },
        { _id: '2', name: 'Al Pastor Tacos', category: 'Tacos', description: 'Marinated pork, pineapple.', price: 14.50, image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', available: true },
        { _id: '3', name: 'Sizzling Steak Fajitas', category: 'Fajitas', description: 'Skirt steak with bell peppers.', price: 22.50, image: 'https://images.unsplash.com/photo-1577906096429-f73c2c312435?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', available: true },
        { _id: '4', name: 'Mushroom Quesadilla', category: 'Quesadillas', description: 'Wild mushrooms, Oaxaca cheese.', price: 12.00, image: 'https://images.unsplash.com/photo-1613564834361-9436948817d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', available: true, isVegetarian: true },
        { _id: '5', name: 'Classic Margarita', category: 'Drinks', description: 'Tequila, lime, agave.', price: 10.00, image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', available: true }
    ];

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const { data } = await api.get('/menu');
                if (data.length > 0) {
                    setItems(data);
                    const cats = ['All', ...new Set(data.map(item => item.category))];
                    setCategories(cats);
                } else {
                    setItems(mockMenu);
                    const cats = ['All', ...new Set(mockMenu.map(item => item.category))];
                    setCategories(cats);
                }
            } catch (error) {
                setItems(mockMenu);
                const cats = ['All', ...new Set(mockMenu.map(item => item.category))];
                setCategories(cats);
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filteredItems = activeCategory === 'All'
        ? items
        : items.filter(item => item.category === activeCategory);

    if (loading) {
        return (
            <div className="pt-32 pb-20 min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-darkred"></div>
            </div>
        );
    }

    return (
        <div className="pt-28 pb-20 min-h-screen bg-primary-beige">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-heading font-bold text-primary-darkred mb-4"
                    >
                        Our Menu
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-gray-700 max-w-2xl mx-auto font-body"
                    >
                        Explore our authentic selection of Mexican culinary delights, handcrafted with passion and the finest ingredients.
                    </motion.p>
                </div>

                {/* Category Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap justify-center mb-12 gap-2"
                >
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2 rounded-full font-bold transition-all duration-300 ${activeCategory === cat
                                ? 'bg-primary-darkred text-white shadow-lg scale-105'
                                : 'bg-white text-gray-700 hover:bg-primary-terracotta hover:text-white border border-gray-200'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </motion.div>

                {/* Menu Grid */}
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {filteredItems.map((item) => (
                            item.available && (
                                <motion.div
                                    key={item._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col group"
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-30 transition-all duration-300"></div>
                                        {(item.isVegan || item.isVegetarian) && (
                                            <span className="absolute top-4 left-4 bg-primary-darkgreen text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                                {item.isVegan ? 'Vegan' : 'Vegetarian'}
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-6 flex-grow flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-heading text-2xl font-bold text-gray-900 group-hover:text-primary-darkred transition-colors flex-1 pr-4">
                                                    {item.name}
                                                </h3>
                                                <span className="font-heading text-xl font-bold text-primary-terracotta shrink-0">
                                                    ${item.price.toFixed(2)}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 font-body mb-6 text-sm">
                                                {item.description}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleAddToCart(item)}
                                            className="w-full flex items-center justify-center bg-gray-100 hover:bg-primary-darkred text-gray-800 hover:text-white py-3 rounded-xl font-bold transition-colors duration-300"
                                        >
                                            <FaCartPlus className="mr-2" /> Add to Order
                                        </button>
                                    </div>
                                </motion.div>
                            )
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredItems.length === 0 && (
                    <div className="text-center py-20 text-gray-500 font-body text-xl">
                        No items found in this category.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Menu;
