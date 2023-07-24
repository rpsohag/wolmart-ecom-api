import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateResetToken } from "../utils/generateResetToken.js";
import { sendResetEmail } from "../utils/sendResetEmail.js";

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
export const updateAuthPassword = asyncHandler(async (req, res) => {
  const { id } = req.me;
  const { old_password, new_password } = req.body;

  try {
    // Fetch the user from the database using their email
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the current password matches the one stored in the database
    const passwordMatch = await bcrypt.compare(old_password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ message: "Invalid current password." });
    }

    // Validate the new password (you can customize these criteria)
    if (new_password.length < 8) {
      res
        .status(400)
        .json({ message: "New password must be at least 8 characters long." });
    }

    // Hash the new password before storing it in the database
    const hashedNewPassword = await bcrypt.hash(new_password, 10);

    // Update the user's password in the database
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: "Password updated successfully.", user });
  } catch (error) {
    res.status(500).json(error);
  }
});

export const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const token = generateResetToken();
  const expirationTime = Date.now() + 3600000;

  // Save reset token and expiration time in the user's document
  const userCheck = await User.findOne({ email });

  if (!userCheck) {
    return res.status(404).json({
      message: "User Not found",
    });
  }

  const user = await User.findOneAndUpdate(
    { email },
    { resetToken: token, resetTokenExpiration: expirationTime },
    { new: true }
  );

  // Send reset email to the user's email address
  await sendResetEmail(email, token);

  return res.json({
    message: "Password reset email sent successfully.",
    user,
  });
});
export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // 6. Find the user by the token and check if it's valid
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() }, // Check if token is not expired
    });

    if (!user) {
      return res.status(404).json({
        message: "Invalid Token ",
      });
    }

    // Hash the new password before storing it in the database
    const hashedNewPassword = await bcrypt.hash(password, 10);
    // 7. Update the user's password and clear the reset token fields
    user.password = hashedNewPassword;
    user.resetToken = null;
    user.resetTokenExpiration = null;
    await user.save();

    res.json({ message: "Password reset successfully." });
  } catch (err) {
    console.error("Error while processing reset password:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
