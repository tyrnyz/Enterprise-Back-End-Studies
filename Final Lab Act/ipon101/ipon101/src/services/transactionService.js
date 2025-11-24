// src/services/transactionService.js
import api from "./api";

export default {
  list: (params = {}) => api.get("/transactions", { params }).then(r => r.data),
  create: (payload) => api.post("/transactions", payload).then(r => r.data),
  remove: (id) => api.delete(`/transactions/${id}`).then(r => r.data),
};