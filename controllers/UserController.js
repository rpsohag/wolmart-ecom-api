import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { sendUserCreateEmail } from "../utils/sendEmail.js";

export const getAllUser = asyncHandler(async (req, res) => {
  const users = await User.find().populate("role");
  if (users.length === 0) {
    return res.status(404).json({
      message: "User data not found",
    });
  }
  return res.status(200).json(users);
});

/**
 * @DESC get single user
 * @ROUTE /api/v1/user
 * @METHOD GET
 * @ACCESS private
 */

export const getsingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({
      message: "user not found",
    });
  }
  res.status(200).json(user);
});

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, mobile, password, gender, role } = req.body;
  if ((!name, !email, !password)) {
    return res.status(404).json({
      message: "all fields are required",
    });
  }
  const userEmailCheck = await User.findOne({ email });
  if (userEmailCheck) {
    return res.status(404).json({
      message: "this email is already exists",
    });
  }

  const hashPass = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    mobile,
    password: hashPass,
    gender,
    role,
  });
  sendUserCreateEmail({
    to: email,
    subject: "Account access info",
    message: `Your account login access is Email: ${email} password: ${password}`,
  });
  res.status(201).json({ user, message: `${name} created successfully` });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  res.status(200).json(user);
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, mobile, password, gender } = req.body;
  if ((!name, !email, !mobile, !password, !gender)) {
    return res.status(404).json({
      message: "all fields are required",
    });
  }
  const user = await User.findByIdAndUpdate(
    id,
    { name, email, mobile, password, gender },
    { new: true }
  );
  res.status(201).json(user);
});
