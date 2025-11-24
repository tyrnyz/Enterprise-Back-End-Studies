// backend/controllers/transactionController.js
import pool from "../config/db.js";

export const listTransactions = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM transactions ORDER BY createdAt DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const { description, amount, categoryId, type, transactionDate } = req.body;
    const [result] = await pool.query(
      "INSERT INTO transactions (description, amount, categoryId, type, transactionDate) VALUES (?, ?, ?, ?, ?)",
      [description || "", amount || 0, categoryId || null, type || "expense", transactionDate || new Date()]
    );
    const [rows] = await pool.query("SELECT * FROM transactions WHERE id = ?", [result.insertId]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const id = req.params.id;
    await pool.query("DELETE FROM transactions WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};