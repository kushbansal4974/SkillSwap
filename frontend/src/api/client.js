import axios from 'axios';

/**
 * Centralized Axios HTTP Client
 * 
 * Configured with base URL from environment variable VITE_API_URL.
 * Defaults to http://localhost:5000/api
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');


export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach Bearer token to all outgoing requests
apiClient.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Ignore localStorage access issues
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Standardize API error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      message:
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Something went wrong. Please try again later.',
      status: error.response?.status,
      data: error.response?.data,
    };

    return Promise.reject(customError);
  }
);

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export default apiClient;
