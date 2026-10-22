import api from './api';

export const orderService = {
  async createOrder(orderPayload) {
    const res = await api.post('/orders', orderPayload);
    return res.data;
  },

  async getMyOrders() {
    const res = await api.get('/orders/my-orders');
    return res.data;
  },

  async getOrderById(id) {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  },

  async getAllOrders(params = {}) {
    const res = await api.get('/orders', { params });
    return res.data;
  },

  async updateOrderStatus(id, status, note = '') {
    const res = await api.put(`/orders/${id}/status`, { status, note });
    return res.data;
  }
};
