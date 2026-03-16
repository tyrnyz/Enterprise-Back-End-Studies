// src/services/api.js
import axios from "axios";

// If you have VITE_API_BASE in .env, use it. Otherwise fallback to localhost:3000
export const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:3000";

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach JWT token (if present)
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error("Token read error:", e);
    }
    return config;
  },
  (err) => Promise.reject(err)
);

export default api;