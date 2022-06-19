import express from "express";
const router = express.Router();
import {
  getCategories,
  updateCategories,
  deleteCategory,
  createCategory,
} from "../controllers/categoryController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").get(getCategories).post(protect, createCategory);
router
  .route("/:id")
  //   .get(getCarById)
  .delete(protect,admin, deleteCategory)
  .put(protect,admin, updateCategories);

export default router;
