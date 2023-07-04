import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'



export const login = asyncHandler (async (req, res) => {
    const { email, password } = req.body;
    if(!email, !password ){
        return res.status(404).json({
            message: "all fields are required"
        })
    }
    const loginUser = await User.findOne({ email })
    if(!loginUser){
        return res.status(404).json({
            message: "User Not Found"
        })
    }

    const passwordCheck = await bcrypt.compare(password, loginUser.password);
    if(!passwordCheck){
        return res.status(404).json({
            message: "Password Not Matched!"
        })
    }

    const token = jwt.sign({email: loginUser.email}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN,
    })
    const refreshToken = jwt.sign({email: loginUser.email}, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN,
    })

    res.cookie("accessToken", token)


    res.status(201).json({
        token,
        refreshToken,
        user: loginUser
    })
    
})