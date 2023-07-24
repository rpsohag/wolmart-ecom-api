import express from "express";
import tokenVerify from "../middlewares/verifyToken.js";
import {
  createPermission,
  deletePermission,
  getAllPermission,
  getSinglePermission,
  updatePermission,
} from "../controllers/PermissionController.js";

const router = express.Router();

router.use(tokenVerify);

router.route("/").get(getAllPermission);
router.route("/:id").get(getSinglePermission);
router.route("/create").post(createPermission);
router.route("/:id").put(updatePermission);
router.route("/:id").delete(deletePermission);

export default router;
