// backend/routes/categories.js
import express from "express";
import { listCategories, createCategory, deleteCategory } from "../controllers/categoryController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", requireAuth, listCategories);
router.post("/", requireAuth, createCategory);
router.delete("/:id", requireAuth, deleteCategory);

export default router;