import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const SignatureDishes = () => {
    const [dishes, setDishes] = useState([]);
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

    const mockDishes = [
        {
            _id: '1',
            name: 'Quesabirria Tacos',
            description: 'Slow-cooked braised beef in crispy corn tortillas filled with melted cheese, served with rich, savory consommé for dipping, topped with fresh cilantro and onions.',
            price: 16.50,
            image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        },
        {
            _id: '2',
            name: 'Ceviche de Camarón',
            description: 'Fresh shrimp marinated in lime juice with cucumber, red onion, jalapeño, and avocado, served with crispy house-made tostadas.',
            price: 14.99,
            image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        },
        {
            _id: '3',
            name: 'Corazón Margarita',
            description: 'Our award-winning house margarita made with premium reposado tequila, fresh lime juice, agave nectar, and a smoky tajín rim.',
            price: 12.00,
            image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        },
        {
            _id: '4',
            name: 'Sizzling Fajitas Mixtas',
            description: 'A smoking platter of grilled skirt steak and chicken served over perfectly blistered peppers and onions, with warm tortillas and guacamole.',
            price: 24.50,
            image: 'https://images.unsplash.com/photo-1577906096429-f73c2c312435?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        }
    ];

    useEffect(() => {
        const fetchDishes = async () => {
            try {
                const { data } = await api.get('/menu');
                if (data.length > 0) {
                    setDishes(data.slice(0, 4)); // Render Top 4
                } else {
                    setDishes(mockDishes);
                }
            } catch (error) {
                setDishes(mockDishes);
            } finally {
                setLoading(false);
            }
        };
        fetchDishes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) return null;

    return (
        <section className="py-24 bg-[#FAF7F2]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-2xl text-left">
                        <motion.h4
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-primary-terracotta font-bold tracking-[0.2em] uppercase mb-4 text-sm"
                        >
                            Chef's Selection
                        </motion.h4>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-heading font-extrabold text-gray-900 leading-tight"
                        >
                            Our Signature <span className="text-primary-darkred italic">Dishes</span>
                        </motion.h2>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Link
                            to="/menu"
                            className="bg-black text-white font-heading tracking-widest uppercase text-sm font-bold px-8 py-4 rounded-full hover:bg-primary-darkred hover:shadow-xl hover:-translate-y-1 transition-all duration-300 inline-block"
                        >
                            Explore Full Menu
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {dishes.map((dish, index) => (
                        <motion.div
                            key={dish._id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            className="group flex flex-col h-full bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100"
                        >
                            <div className="relative h-72 overflow-hidden bg-gray-200">
                                <img
                                    src={dish.image}
                                    alt={dish.name}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                                {(dish.isVegan || dish.isVegetarian) && (
                                    <span className="absolute top-4 left-4 bg-primary-darkgreen text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-md backdrop-blur-sm bg-opacity-90">
                                        {dish.isVegan ? 'Vegan' : 'Vegetarian'}
                                    </span>
                                )}
                                <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end">
                                    <span className="bg-white/95 text-primary-darkred font-bold text-lg px-4 py-2 rounded-xl shadow-lg font-heading">
                                        ${dish.price.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="font-heading text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-terracotta transition-colors leading-snug">
                                    {dish.name}
                                </h3>
                                <p className="text-gray-500 text-sm mb-6 font-body leading-relaxed flex-grow">
                                    {dish.description}
                                </p>

                                <button
                                    onClick={() => handleAddToCart(dish)}
                                    className="w-full mt-auto py-3 rounded-xl font-bold text-sm tracking-widest uppercase text-gray-400 border-2 border-gray-100 group-hover:border-primary-terracotta group-hover:bg-primary-terracotta group-hover:text-white transition-all duration-300"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SignatureDishes;
