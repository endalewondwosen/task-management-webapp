import axios, { AxiosError, type AxiosRequestConfig } from 'axios';

// Get API URL from environment variable or fallback to local development
const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  
  // Always use VITE_API_URL if set (required for production)
  if (envUrl) {
    return envUrl;
  }
  
  // Only use hostname-based detection for local development
  // Check if we're in development mode (localhost or 127.0.0.1)
  const isLocalDev = 
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.startsWith('192.168.');
  
  if (isLocalDev) {
    // For local network IP addresses, use that IP for API
    if (window.location.hostname.startsWith('192.168.')) {
      return `http://${window.location.hostname}:4000/api`;
    }
    // Default to localhost for local development
    return 'http://localhost:4000/api';
  }
  
  // For production (Vercel), VITE_API_URL must be set
  console.error('VITE_API_URL is not set. Please configure it in Vercel environment variables.');
  throw new Error('API URL is not configured. Please set VITE_API_URL environment variable.');
};

const API_URL = getApiUrl();

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies (for refresh token)
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Response interceptor to handle errors and refresh tokens
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;
    
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't retry login/refresh/logout requests
      if (
        originalRequest.url?.includes('/auth/login') || 
        originalRequest.url?.includes('/auth/refresh') ||
        originalRequest.url?.includes('/auth/logout')
      ) {
        const isOnLoginPage = window.location.pathname === '/login';
        if (!isOnLoginPage) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh the token
        const response = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { token } = response.data;
        localStorage.setItem('token', token);

        // Update the original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }

        processQueue(null, token);

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear token and redirect to login
        processQueue(refreshError as AxiosError, null);
        localStorage.removeItem('token');
        
        const isOnLoginPage = window.location.pathname === '/login';
        if (!isOnLoginPage) {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

