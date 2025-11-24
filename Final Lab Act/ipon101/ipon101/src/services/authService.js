// src/services/authService.js
import api from "./api";

export default {
  register: async (payload) => {
    const res = await api.post("/auth/register", payload);
    return res.data; // expect { token, user } (or user) — store handles both
  },

  login: async ({ email, password }) => {
    const res = await api.post("/auth/login", { email, password });
    return res.data; // expect { token, user }
  },

  me: async () => {
    const res = await api.get("/auth/me"); // optional if implemented
    return res.data;
  },

  logout: async () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  }
};