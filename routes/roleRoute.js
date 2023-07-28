import express from "express";
import tokenVerify from "../middlewares/verifyToken.js";
import {
  createRole,
  deleteRole,
  getAllRole,
  getSingleRole,
  updateRole,
  updateRoleStatus,
} from "../controllers/RoleController.js";

const router = express.Router();

router.use(tokenVerify);

router.route("/roles").get(getAllRole);
router.route("/roles/:id").get(getSingleRole);
router.route("/roles/create").post(createRole);
router.route("/roles/:id").put(updateRole);
router.route("/roles/status/:id").patch(updateRoleStatus);
router.route("/roles/:id").delete(deleteRole);

export default router;
