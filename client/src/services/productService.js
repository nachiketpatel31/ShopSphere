import api from './api';

export const productService = {
  async getProducts(params = {}) {
    const res = await api.get('/products', { params });
    return res.data;
  },

  async getProductById(id) {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },

  async createProduct(productData) {
    const res = await api.post('/products', productData);
    return res.data;
  },

  async updateProduct(id, productData) {
    const res = await api.put(`/products/${id}`, productData);
    return res.data;
  },

  async deleteProduct(id) {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  }
};
