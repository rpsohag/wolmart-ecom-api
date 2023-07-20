import express from "express";
import {
  login,
  logout,
  register,
  loggedInUser,
} from "../controllers/AuthController.js";
import tokenVerify from "../middlewares/verifyToken.js";
const router = express.Router();

router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/register").post(register);
router.route("/me").get(tokenVerify, loggedInUser);

export default router;
