import axios from 'axios';
import toast from 'react-hot-toast';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:8080', // Replace with your actual backend URL if different
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global Error Handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (!error.response) {
      // Network Error
      toast.error('Server unreachable. Please check your network connection.');
      return Promise.reject(error);
    }

    const status = error.response.status;

    switch (status) {
      case 400:
        // Bad Request - often validation errors
        const message = error.response.data?.message || 'Invalid request. Please check your data.';
        toast.error(message);
        break;
      case 401:
        // Unauthorized - Invalid or expired token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Only redirect if not already on login page
        if (window.location.pathname !== '/login') {
            toast.error('Session expired. Please log in again.');
            window.location.href = '/login';
        }
        break;
      case 403:
        // Forbidden
        toast.error('Access Denied. You do not have permission.');
        break;
      case 404:
        // Not Found
        toast.error(error.response.data?.message || 'Resource not found.');
        break;
      case 500:
        // Internal Server Error
        const serverErrorMsg = error.response.data?.message || 'Something went wrong on the server.';
        toast.error(serverErrorMsg);
        break;
      case 503:
        toast.error(error.response.data?.message || 'Service unavailable. Try again later.');
        break;
      default:
        const defaultMsg = error.response.data?.message || 'An unexpected error occurred.';
        toast.error(defaultMsg);
    }

    return Promise.reject(error);
  }
);

export default api;
