// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
// import { 
//   getCartsByUserId, 
//   createCartItem, 
//   updateCartItem, 
//   deleteCartItem,
//   formatCartDataForAPI 
// } from '../services/cart';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Load cart from localStorage based on user ID
  useEffect(() => {
    const loadCart = () => {
      if (!user?.id) {
        // No user logged in, clear cart
        setCartItems([]);
        console.log('🛒 No user, clearing cart');
        return;
      }

      // Load cart specific to this user
      const cartKey = `cart_user_${user.id}`;
      const savedCart = localStorage.getItem(cartKey);
      
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          setCartItems(parsed);
          console.log('🛒 Loaded cart for user:', user.id, 'Items:', parsed.length);
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
          setCartItems([]);
        }
      } else {
        // New user or no cart, set empty
        setCartItems([]);
        console.log('🛒 New user or empty cart for user:', user.id);
      }
    };

    loadCart();
  }, [user?.id]);

  // Save cart to localStorage based on user ID
  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const cartKey = `cart_user_${user.id}`;
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
    console.log('🛒 Saved cart for user:', user.id, 'Items:', cartItems.length);
  }, [cartItems, user?.id]);

  const addToCart = async (product, quantity = 1) => {
    // Use localStorage only (API disabled for demo)
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === product.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity, total: (product.price || 0) * (item.quantity + quantity) }
            : item
        );
      } else {
        return [...prevItems, {
          id: Date.now() + Math.random(), // Generate unique ID
          productId: product.id,
          userId: user?.id || 0,
          quantity: quantity,
          total: (product.price || 0) * quantity,
          product: product
        }];
      }
    });
  };

  const removeFromCart = async (cartItemId) => {
    // Use localStorage only (API disabled for demo)
    setCartItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
  };

  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(cartItemId);
      return;
    }

    // Use localStorage only (API disabled for demo)
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === cartItemId ? { ...item, quantity, total: (item.product?.price || 0) * quantity } : item
      )
    );
  };

  const clearCart = async () => {
    // Use localStorage only (API disabled for demo)
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.total || 0), 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    loading,
    error
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
