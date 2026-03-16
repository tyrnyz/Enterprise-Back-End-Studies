// src/services/transactionService.js
import api from "./api";

export default {
  list() {
    return api.get("/api/transactions").then(r => r.data);
  },
  create(payload) {
    return api.post("/api/transactions", payload).then(r => r.data);
  },
  remove(id) {
    return api.delete(`/api/transactions/${id}`).then(r => r.data);
  }
};