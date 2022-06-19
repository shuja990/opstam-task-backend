import express from "express";
const router = express.Router();
import {
  getCarById,
  getCars,
  deleteCar,
  createCar,
  updateCar,
} from "../controllers/carController.js";
import { protect } from "../middleware/authMiddleware.js";

router.route("/").get(getCars).post(protect, createCar);
router
  .route("/:id")
  .get(getCarById)
  .delete(protect, deleteCar)
  .put(protect, updateCar);

export default router;
