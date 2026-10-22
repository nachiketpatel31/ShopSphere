import React, { createContext, useContext, useState, useEffect } from 'react';
import { wishlistService } from '../services/wishlistService';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { refreshCart } = useCart();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }
    try {
      setLoading(true);
      const res = await wishlistService.getWishlist();
      if (res.success) {
        setWishlist(res.products || []);
      }
    } catch (err) {
      console.error('Failed to fetch wishlist:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated]);

  const isInWishlist = (productId) => {
    return wishlist.some((p) => (p._id || p).toString() === productId?.toString());
  };

  const toggleWishlist = async (product) => {
    if (!isAuthenticated) {
      toast.error('Please log in to save items to your wishlist');
      return;
    }
    const productId = product._id || product;
    const exists = isInWishlist(productId);

    try {
      if (exists) {
        const res = await wishlistService.removeFromWishlist(productId);
        if (res.success) {
          setWishlist(res.products);
          toast.success('Removed from wishlist');
        }
      } else {
        const res = await wishlistService.addToWishlist(productId);
        if (res.success) {
          setWishlist(res.products);
          toast.success('Saved to wishlist');
        }
      }
    } catch (err) {
      toast.error(err.message || 'Could not update wishlist');
    }
  };

  const moveToCart = async (productId) => {
    try {
      const res = await wishlistService.moveToCart(productId);
      if (res.success) {
        toast.success('Moved item to bag');
        await fetchWishlist();
        await refreshCart();
      }
    } catch (err) {
      toast.error(err.message || 'Could not move item to bag');
    }
  };

  const value = {
    wishlist,
    loading,
    count: wishlist.length,
    isInWishlist,
    toggleWishlist,
    moveToCart,
    refreshWishlist: fetchWishlist
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
