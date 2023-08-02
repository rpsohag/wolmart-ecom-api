import express from "express";
import {
  createUser,
  deleteUser,
  getAllUser,
  getsingleUser,
  updateUser,
} from "../controllers/UserController.js";
import tokenVerify from "../middlewares/verifyToken.js";

const router = express.Router();

router.use(tokenVerify);

router.route("/").get(getAllUser);
router.route("/create").post(createUser);
router.route("/:id").get(getsingleUser).delete(deleteUser).put(updateUser);

export default router;
