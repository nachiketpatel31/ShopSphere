import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // Guarantees HTTP-only cookie JWT is sent automatically
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest' // Anti-CSRF header
  }
});

// Response interceptor for consistent error extraction
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customMessage =
      error.response?.data?.message ||
      (error.response?.status === 404 ? 'Resource not found' : error.message) ||
      'An unexpected error occurred';

    const enhancedError = new Error(customMessage);
    enhancedError.status = error.response?.status;
    enhancedError.data = error.response?.data;
    return Promise.reject(enhancedError);
  }
);

export default api;
