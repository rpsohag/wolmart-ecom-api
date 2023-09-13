import express from "express";
import tokenVerify from "../middlewares/verifyToken.js";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  updateProductStatus,
} from "../controllers/ProductController.js";
import { ProductPhoto } from "../utils/multer.js";

const router = express.Router();

router.use(tokenVerify);

router.route("/products").get(getAllProduct);
router.route("/products/:id").get(getSingleProduct);
router.route("/products/create").post(ProductPhoto, createProduct);
router.route("/products/:id").patch(updateProduct);
router.route("/products/status/:id").patch(updateProductStatus);
router.route("/products/:id").delete(deleteProduct);

export default router;
