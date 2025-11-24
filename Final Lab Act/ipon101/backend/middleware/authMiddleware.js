// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const requireAuth = async (req, res, next) => {
  const auth = req.headers.authorization || req.headers.Authorization;
  if (!auth || !auth.startsWith("Bearer ")) return res.status(401).json({ message: "Unauthorized" });
  const token = auth.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // fetch user from DB to ensure it exists and attach minimal info
    const [rows] = await pool.query("SELECT id, fullName, email FROM users WHERE id = ?", [payload.id]);
    if (!rows.length) return res.status(401).json({ message: "Invalid token" });
    req.user = rows[0];
    next();
  } catch (err) {
    console.error("authMiddleware error:", err?.message || err);
    return res.status(401).json({ message: "Invalid token" });
  }
};