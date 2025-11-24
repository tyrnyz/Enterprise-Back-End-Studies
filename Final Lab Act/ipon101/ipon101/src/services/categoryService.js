// src/services/categoryService.js
import api from "./api";

export default {
  list: (params = {}) => api.get("/categories", { params }).then(r => r.data),
  create: (payload) => api.post("/categories", payload).then(r => r.data),
  remove: (id) => api.delete(`/categories/${id}`).then(r => r.data),
};