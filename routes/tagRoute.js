import express from "express";
import tokenVerify from "../middlewares/verifyToken.js";
import {
  createTag,
  deleteTag,
  getAllTag,
  getSingleTag,
  updateTag,
  updateTagStatus,
} from "../controllers/TagController.js";

const router = express.Router();

router.use(tokenVerify);

router.route("/tags").get(getAllTag);
router.route("/tags/:id").get(getSingleTag);
router.route("/tags/create").post(createTag);
router.route("/tags/:id").put(updateTag);
router.route("/tags/status/:id").patch(updateTagStatus);
router.route("/tags/:id").delete(deleteTag);

export default router;
