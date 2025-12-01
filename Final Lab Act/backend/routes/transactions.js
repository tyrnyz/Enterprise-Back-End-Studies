// backend/routes/transactions.js
import express from "express";
import { listTransactions, createTransaction, deleteTransaction } from "../controllers/transactionController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", requireAuth, listTransactions);
router.post("/", requireAuth, createTransaction);
router.delete("/:id", requireAuth, deleteTransaction);

export default router;