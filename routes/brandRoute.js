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

const router = express.Router();

router.use(tokenVerify);

router.route("/brands").get(getAllBrand);
router.route("/brands/:id").get(getSingleBrand);
router.route("/brands/create").post(createBrand);
router.route("/brands/:id").put(updateBrand);
router.route("/brands/status/:id").patch(updateBrandStatus);
router.route("/brands/:id").delete(deleteBrand);

export default router;
