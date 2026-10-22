import api from './api';

export const cartService = {
  async getCart() {
    const res = await api.get('/cart');
    return res.data;
  },

  async addToCart(productId, quantity = 1) {
    const res = await api.post('/cart/items', { productId, quantity });
    return res.data;
  },

  async updateQuantity(productId, quantity) {
    const res = await api.put(`/cart/items/${productId}`, { quantity });
    return res.data;
  },

  async removeFromCart(productId) {
    const res = await api.delete(`/cart/items/${productId}`);
    return res.data;
  },

  async clearCart() {
    const res = await api.delete('/cart');
    return res.data;
  }
};
