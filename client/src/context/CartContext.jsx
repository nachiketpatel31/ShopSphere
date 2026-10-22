import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    try {
      setLoading(true);
      const res = await cartService.getCart();
      if (res.success) {
        setCart(res.cart);
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Please log in to add items to your cart');
      return false;
    }
    try {
      const res = await cartService.addToCart(productId, quantity);
      if (res.success) {
        setCart(res.cart);
        toast.success('Added to bag');
        return true;
      }
    } catch (err) {
      toast.error(err.message || 'Could not add item to bag');
      return false;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await cartService.updateQuantity(productId, quantity);
      if (res.success) {
        setCart(res.cart);
      }
    } catch (err) {
      toast.error(err.message || 'Could not update quantity');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await cartService.removeFromCart(productId);
      if (res.success) {
        setCart(res.cart);
        toast.success('Item removed from bag');
      }
    } catch (err) {
      toast.error(err.message || 'Could not remove item');
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCart({ items: [], itemCount: 0, subtotal: 0, shippingFee: 0, tax: 0, total: 0 });
    } catch (err) {
      console.error('Clear cart error:', err.message);
    }
  };

  const value = {
    cart,
    loading,
    itemCount: cart?.itemCount || 0,
    subtotal: cart?.subtotal || 0,
    shippingFee: cart?.shippingFee || 0,
    tax: cart?.tax || 0,
    total: cart?.total || 0,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart: fetchCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
