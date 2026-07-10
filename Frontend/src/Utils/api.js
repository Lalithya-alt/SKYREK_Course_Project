//axios interceptor to add token to every request
import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL 
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`✅ Token added to request: [${config.method?.toUpperCase()}] ${config.url}`);
    } else {
      console.warn(`⚠️ No token in localStorage for: [${config.method?.toUpperCase()}] ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api
