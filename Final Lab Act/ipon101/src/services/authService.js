// src/services/authService.js
import api from "./api";

export default {
  // POST http://localhost:3000/api/auth/register -> { token, user }
  register(payload) {
    return api.post("/api/auth/register", payload).then(r => r.data);
  },

  // POST http://localhost:3000/api/auth/login -> { token, user }
  login(payload) {
    return api.post("/api/auth/login", payload).then(r => r.data);
  },

  // GET http://localhost:3000/api/auth/me -> { user }
  me() {
    return api.get("/api/auth/me").then(r => r.data);
  },

  logout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  }
};