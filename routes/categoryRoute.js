import express from "express";
import tokenVerify from "../middlewares/verifyToken.js";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getSingleCategory,
  updateCategory,
  updateCategoryStatus,
} from "../controllers/CategoryController.js";
import { categoryPhoto } from "../utils/multer.js";

const router = express.Router();

router.use(tokenVerify);

router.route("/categories").get(getAllCategory);
router.route("/categories/:id").get(getSingleCategory);
router.route("/categories/create").post(categoryPhoto, createCategory);
router.route("/categories/:id").put(categoryPhoto, updateCategory);
router.route("/categories/status/:id").patch(updateCategoryStatus);
router.route("/categories/:id").delete(deleteCategory);

export default router;
