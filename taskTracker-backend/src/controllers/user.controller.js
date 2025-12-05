import { User } from "../models/user.model.js";
import APIError from "../utils/API_Error.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import { APIResponse } from "../utils/API_Response.js";
import jwt from "jsonwebtoken";

const generateAccessandRefrsehToken = async (userID) => {
    try {
        const user = await User.findById(userID);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
    
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})
    
        return {accessToken, refreshToken};
    } catch (error) {
        throw new APIError(500, 'Error generating tokens');
    }
}

const registerUser = asyncHandler( async (req, res) => {
    const {fullname, username, email, password} = req.body;

    if(!fullname || !username || !email || !password) {
        throw new APIError(400, "All fields are required");
    }

    const existing = await User.findOne({$or: [ {email} , {username} ]});
    if(existing){
        throw new APIError (409, "User with this email or username already exists");
    }

    const user = await User.create({
        fullname, 
        username: username.toLowerCase(),
        email, 
        password
    })

    const created_user = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!created_user){
        throw new APIError(500, "error registering user");
    }
    return res.status(201).json(
        new APIResponse(
            200,
            created_user,
            "User registered successfully"
        )
    );
})

const loginUser = asyncHandler(async (req, res)=>{
    const {email, username, password} = req.body;
    if(!(email || username)){
        throw new APIError(400, "email or username required");
    }
    const user = await User.findOne({$or: [ {email}, {username} ] });
    if(!user){
        throw new APIError(404, "User do not exist");
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if(!isPasswordCorrect){
        throw new APIError(401, "Invalid password");
    }
    const {accessToken, refreshToken} =  await generateAccessandRefrsehToken(user._id)

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000 
    }
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new APIResponse( 
            200,
            {
                user: loggedInUser, 
                accessToken, 
                refreshToken
            },
            "User logged in successfully"
        )
    )
})

const logoutUser = asyncHandler(async (req, res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        { 
            $set : {
                refreshToken: undefined
            }},
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new APIResponse(
            200,
            null,
            "User logged out successfully"
        )
    )
})

const changePassword = asyncHandler(async (req, res)=>{
    const {oldPassword, newPassword} = req.body

    const user = await User.findById(req.user?._id)
    
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if(!isPasswordCorrect){
        throw new APIError(400 , "Invalid Password")
    }
    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new APIResponse(200, {}, "Password changed Succesfully."))
})

export {generateAccessandRefrsehToken, registerUser, loginUser, logoutUser, changePassword}; 