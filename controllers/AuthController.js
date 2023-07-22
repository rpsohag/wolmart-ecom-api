import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if ((!email, !password)) {
    return res.status(404).json({
      message: "all fields are required",
    });
  }
  const loginUser = await User.findOne({ email });
  if (!loginUser) {
    return res.status(404).json({
      message: "User Not Found",
    });
  }

  const passwordCheck = await bcrypt.compare(password, loginUser.password);
  if (!passwordCheck) {
    return res.status(404).json({
      message: "Password Not Matched!",
    });
  }

  const token = jwt.sign(
    { email: loginUser.email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN,
    }
  );
  const refreshToken = jwt.sign(
    { email: loginUser.email },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN,
    }
  );

  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: process.env.APP_ENV == "development" ? true : false,
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    token,
    user: loginUser,
    message: "Login Successfull",
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken");
  res.status(200).json({
    message: "Logout successfull!",
  });
});
export const register = asyncHandler(async (req, res) => {
  const { name, email, mobile, password, gender } = req.body;
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
  const user = await User.create({ name, email, password: hashPass });
  res.status(201).json({ user, message: "Register Successfull" });
});

export const loggedInUser = asyncHandler(async (req, res) => {
  res.status(200).json(req.me);
});

export const updateAuthProfile = asyncHandler(async (req, res) => {
  const { id } = req.me;
  const user = await User.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      date_of_birth: req.body.date_of_birth,
      address: req.body.address,
      bio: req.body.bio,
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    message: "Profile Updated Successfully",
    user,
  });
});
