import express from 'express';
import { createUser, deleteUser, getAllUser, getsingleUser, updateUser } from '../controllers/UserController.js';

const router = express.Router();

router.route("/").get(getAllUser).post(createUser);
router.route("/:id").get(getsingleUser).delete(deleteUser).put(updateUser)

export default router;