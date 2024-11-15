import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const tokenVerify = (req, res, next) => {
  // const authHeader = req.headers.authorization || req.headers.Authorization;
  // if (!authHeader) {
  //   return res.status(400).json({
  //     message: "you are unauthorized",
  //   });
  // }
  // const token = authHeader.split(" ")[1];

  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return res.status(400).json({
      message: "you are unauthorized",
    });
  }

  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    asyncHandler(async (err, decode) => {
      if (err) {
        return res.status(400).json({
          message: "Invalid token",
        });
      }
      const me = await User.findOne({ email: decode.email })
        .select("-password")
        .populate("role");
      req.me = me;
      next();
    })
  );
};

export default tokenVerify;
