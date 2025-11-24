// backend/controllers/categoryController.js
import pool from "../config/db.js";

export const listCategories = async (req, res) => {
  try {
    const userId = req.user?.id;
    const [rows] = await pool.query("SELECT * FROM categories WHERE userId = ? ORDER BY id DESC", [userId]);
    res.json(rows);
  } catch (err) {
    console.error("listCategories error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Name required" });
    const userId = req.user?.id;
    const [result] = await pool.query("INSERT INTO categories (name, userId) VALUES (?, ?)", [name, userId]);
    const [rows] = await pool.query("SELECT * FROM categories WHERE id = ?", [result.insertId]);
    res.json(rows[0]);
  } catch (err) {
    console.error("createCategory error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user?.id;
    // optionally check ownership before delete
    await pool.query("DELETE FROM categories WHERE id = ? AND userId = ?", [id, userId]);
    res.json({ success: true });
  } catch (err) {
    console.error("deleteCategory error:", err);
    res.status(500).json({ message: err.message });
  }
};