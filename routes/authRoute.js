import express from "express";
import {
  login,
  logout,
  register,
  loggedInUser,
  updateAuthProfile,
  updateAuthPassword,
  forgetPassword,
  resetPassword,
} from "../controllers/AuthController.js";
import tokenVerify from "../middlewares/verifyToken.js";
const router = express.Router();

router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/register").post(register);
router.route("/me").get(tokenVerify, loggedInUser);
router.route("/update-profile").put(tokenVerify, updateAuthProfile);
router.route("/update-password").put(tokenVerify, updateAuthPassword);
router.route("/forget-password").post(forgetPassword);
router.route("/reset-password/:token").put(resetPassword);

export default router;
