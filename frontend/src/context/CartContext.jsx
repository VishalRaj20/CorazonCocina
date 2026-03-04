import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // Initialize state synchronously from localStorage to prevent flash of empty cart
    // which then triggers the save effect and overwrites the saved cart.
    const [cart, setCart] = useState(() => {
        try {
            const storedCart = localStorage.getItem('corazonCartItems');
            return storedCart ? JSON.parse(storedCart) : [];
        } catch (error) {
            console.error('Failed to parse cart from local storage', error);
            return [];
        }
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    // Save to localStorage whenever cart changes
    useEffect(() => {
        try {
            localStorage.setItem('corazonCartItems', JSON.stringify(cart));
        } catch (error) {
            console.error('Failed to save cart to local storage', error);
        }
    }, [cart]);

    const addToCart = (item) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((i) => i._id === item._id);
            if (existingItem) {
                return prevCart.map((i) =>
                    i._id === item._id ? { ...i, qty: i.qty + 1 } : i
                );
            }
            return [...prevCart, { ...item, qty: 1 }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (id) => {
        setCart((prevCart) => prevCart.filter((item) => item._id !== id));
    };

    const updateQuantity = (id, newQty) => {
        if (newQty < 1) return removeFromCart(id);
        setCart((prevCart) =>
            prevCart.map((item) => (item._id === id ? { ...item, qty: newQty } : item))
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartTotal = cart.reduce((total, item) => total + item.price * item.qty, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartTotal,
                isCartOpen,
                setIsCartOpen,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
