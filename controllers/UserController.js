import asyncHandler from "express-async-handler";
import User from "../models/User.js";

export const getAllUser = asyncHandler(async (req, res) => {
    const users = await User.find();
    if(users.length === 0){
        return res.status(404).json({
            message: "User data not found"
        })
    }
   return res.status(200).json({
        data: users
    })
})

/**
 * @DESC get single user
 * @ROUTE /api/v1/user
 * @METHOD GET
 * @ACCESS private
 */

export const getsingleUser = asyncHandler ( async (req, res) => {
    const {id} = req.params;
    const user = await User.findById(id);
    if(!user){
        return res.status(404).json({
            message: "user not found"
        })
    }
    res.status(200).json(user)
})

export const createUser = asyncHandler (async (req, res) => {
    const {name, email, mobile, password, gender } = req.body;
    if(!name, !email, !mobile, !password, !gender ){
        return res.status(404).json({
            message: "all fields are required"
        })
    }
    const user = await User.create({name, email, mobile, password, gender})
    res.status(201).json(user)
    
})

export const deleteUser = asyncHandler( async (req, res) => {
    const {id } = req.params;
    const user = await User.findByIdAndDelete(id);
    res.status(200).json(user)
})

export const updateUser = asyncHandler( async (req, res) => {
    const {id} = req.params;
    const {name, email, mobile, password, gender } = req.body;
    if(!name, !email, !mobile, !password, !gender ){
        return res.status(404).json({
            message: "all fields are required"
        })
    }
    const user = await User.findByIdAndUpdate(id, {name, email, mobile, password, gender}, {new: true})
    res.status(201).json(user)

})