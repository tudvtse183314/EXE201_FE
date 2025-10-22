// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getCartsByUserId, 
  createCartItem, 
  updateCartItem, 
  deleteCartItem,
  formatCartDataForAPI 
} from '../services/cart';
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

  // Load cart from API when user is available
  useEffect(() => {
    const loadCart = async () => {
      if (!user?.id) {
        // If no user, load from localStorage as fallback
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          try {
            setCartItems(JSON.parse(savedCart));
          } catch (error) {
            console.error('Error loading cart from localStorage:', error);
            setCartItems([]);
          }
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const carts = await getCartsByUserId(user.id);
        setCartItems(Array.isArray(carts) ? carts : []);
      } catch (e) {
        console.error('Error loading cart from API:', e);
        setError(e.message);
        // Fallback to localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          try {
            setCartItems(JSON.parse(savedCart));
          } catch (error) {
            setCartItems([]);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [user?.id]);

  // Save cart to localStorage as backup
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (product, quantity = 1) => {
    if (!user?.id) {
      // Fallback to localStorage for non-logged in users
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
            productId: product.id,
            userId: 0, // Guest user
            quantity: quantity,
            total: (product.price || 0) * quantity,
            product: product
          }];
        }
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const existingItem = cartItems.find(item => item.productId === product.id);
      
      if (existingItem) {
        // Update existing item
        const newQuantity = existingItem.quantity + quantity;
        const updatedItem = await updateCartItem(existingItem.id, {
          ...existingItem,
          quantity: newQuantity,
          total: (product.price || 0) * newQuantity
        });
        
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.id === existingItem.id ? updatedItem : item
          )
        );
      } else {
        // Create new item
        const cartData = formatCartDataForAPI(product, quantity, user.id);
        const newItem = await createCartItem(cartData);
        
        setCartItems(prevItems => [...prevItems, { ...newItem, product }]);
      }
    } catch (e) {
      console.error('Error adding to cart:', e);
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartItemId) => {
    if (!user?.id) {
      // Fallback to localStorage for non-logged in users
      setCartItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await deleteCartItem(cartItemId);
      setCartItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
    } catch (e) {
      console.error('Error removing from cart:', e);
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(cartItemId);
      return;
    }

    if (!user?.id) {
      // Fallback to localStorage for non-logged in users
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === cartItemId ? { ...item, quantity, total: (item.product?.price || 0) * quantity } : item
        )
      );
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const item = cartItems.find(item => item.id === cartItemId);
      if (item) {
        const updatedItem = await updateCartItem(cartItemId, {
          ...item,
          quantity,
          total: (item.product?.price || 0) * quantity
        });
        
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.id === cartItemId ? updatedItem : item
          )
        );
      }
    } catch (e) {
      console.error('Error updating quantity:', e);
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user?.id) {
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      // Delete all cart items for the user
      const deletePromises = cartItems.map(item => deleteCartItem(item.id));
      await Promise.all(deletePromises);
      setCartItems([]);
    } catch (e) {
      console.error('Error clearing cart:', e);
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
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
