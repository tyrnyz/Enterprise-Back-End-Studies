// backend/controllers/transactionController.js
import pool from "../config/db.js";

export const listTransactions = async (req, res) => {
  try {
    const userId = req.user?.id;
    const [rows] = await pool.query("SELECT * FROM transactions WHERE userId = ? ORDER BY createdAt DESC", [userId]);
    res.json(rows);
  } catch (err) {
    console.error("listTransactions error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { description, amount, categoryId, type, transactionDate } = req.body;
    const [result] = await pool.query(
      "INSERT INTO transactions (description, amount, categoryId, type, transactionDate, userId) VALUES (?, ?, ?, ?, ?, ?)",
      [description || "", amount || 0, categoryId || null, type || "expense", transactionDate || new Date(), userId]
    );
    const [rows] = await pool.query("SELECT * FROM transactions WHERE id = ?", [result.insertId]);
    res.json(rows[0]);
  } catch (err) {
    console.error("createTransaction error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user?.id;
    await pool.query("DELETE FROM transactions WHERE id = ? AND userId = ?", [id, userId]);
    res.json({ success: true });
  } catch (err) {
    console.error("deleteTransaction error:", err);
    res.status(500).json({ message: err.message });
  }
};