import axios, { InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = process.env.API_BASE || 'http://192.168.100.14:8000/api';

console.log('=== API Initialized ===');
console.log('API BASE_URL:', BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    console.log('>>> Request START - URL:', config.url);
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('>>> Token found:', !!token);

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.log('>>> Error getting token:', e);
    }

    const fullUrl = (config.baseURL || '') + (config.url || '');
    console.log('>>> Full URL:', fullUrl);
    console.log('>>> Request END - Ready to send\n');
    return config;
  },
  (error) => {
    console.log('>>> Request interceptor error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('<<< Response received - Status:', response.status, '\n');
    return response;
  },
  (error) => {
    console.log('<<< Response error - Code:', error.code, 'Message:', error.message);
    console.log('<<< Has response?:', !!error.response, '\n');
    return Promise.reject(error);
  }
);

export default api;
