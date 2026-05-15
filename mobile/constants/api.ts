import axios, { InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';

// Double-check this IP! Use 'ipconfig' and look for your Wi-Fi IPv4.
const BASE_URL = 'http://192.168.56.1:8000/api'; 

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // Good practice: stops the app from hanging forever on a bad connection
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await SecureStore.getItemAsync('userToken');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // This catches errors before the request is even sent
    return Promise.reject(error);
  }
);

export default api;