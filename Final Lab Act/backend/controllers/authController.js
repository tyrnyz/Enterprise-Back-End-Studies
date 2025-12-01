// backend/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) return res.status(400).json({ message: "Missing fields" });

    const [exists] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (exists.length) return res.status(400).json({ message: "Email already registered" });

    const hashed = bcrypt.hashSync(password, 10);
    const [result] = await pool.query("INSERT INTO users (fullName, email, password) VALUES (?, ?, ?)", [fullName, email, hashed]);

    const user = { id: result.insertId, fullName, email };
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Return token and user so frontend can store and auto-login
    res.json({ token, user });
  } catch (err) {
    console.error("register error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Missing fields" });

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (!rows.length) return res.status(401).json({ message: "Invalid credentials" });

    const user = rows[0];
    if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user.id, fullName: user.fullName, email: user.email } });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Optional: a protected route to return current user
export const me = async (req, res) => {
  try {
    // requireAuth must have set req.user
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};