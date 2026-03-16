// src/services/categoryService.js
import api from "./api";

export default {
  list() {
    return api.get("/api/categories").then(r => r.data);
  },
  create(payload) {
    return api.post("/api/categories", payload).then(r => r.data);
  },
  remove(id) {
    return api.delete(`/api/categories/${id}`).then(r => r.data);
  }
};