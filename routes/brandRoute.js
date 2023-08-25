import express from "express";
import tokenVerify from "../middlewares/verifyToken.js";
import {
  createBrand,
  deleteBrand,
  getAllBrand,
  getSingleBrand,
  updateBrand,
  updateBrandStatus,
} from "../controllers/BrandController.js";
import { brandLogo } from "../utils/multer.js";

const router = express.Router();

router.use(tokenVerify);

router.route("/brands").get(getAllBrand);
router.route("/brands/:id").get(getSingleBrand);
router.route("/brands/create").post(brandLogo, createBrand);
router.route("/brands/:id").patch(brandLogo, updateBrand);
router.route("/brands/status/:id").patch(updateBrandStatus);
router.route("/brands/:id").delete(deleteBrand);

export default router;
