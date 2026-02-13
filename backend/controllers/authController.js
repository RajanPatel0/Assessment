import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"
import { setCache, getCache } from "../config/redis.js";

import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/Token/userToken.js";

export const register = async(req, res)=>{
    try{
        const {fullName, email, password, role} = req.body;

        const userExists = await User.findOne({ email });
        if(userExists){
            return res.status(400).json({
                success: false,
                message: "Someone Already Exists with this email"
            });
        }

        const user = await User.create({
            fullName,
            email,
            password,
            role
        });
        await user.save();

        res.status(201).json({
            success: true,
            message: 'Registered successfully',
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.log("Error Registering User", error);
        return res.status(500).json({
            success: false,
            message : "Internal Server Error"
        });
    }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if(!email || !password ){
            return res.status(400).json({
                success: false,
                message: "Email and Password are required"
            });
        };

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const accessToken = generateAccessToken(user._id);   //generating access token
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;  //storing refresh token in db
    await user.save({ validateBeforeSave: false });

    await setCache(`user:${user._id}`, {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    }, 3600);

    const loggedInUser = {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
    };

    const isProd = process.env.NODE_ENV === "production";
        const options = {   //sending refresh token in httpOnly cookie
        httpOnly: true,
        secure: isProd, // secure cookies only in production
        sameSite: isProd ? "None" : "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        };

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            success: true,
            message: "Logged in successfully",           
            accessToken,
            user: loggedInUser,
            role: user.role
        });
    }catch(err){
        console.log("Error Logging User", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            err: err.message
        });
    }
};

//Profile
export const getUser = async (req, res) => {
    try{
        const userId = req.user?.id;

        if (!userId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized user",
        });
        }

        const user = await User.findById( userId ).select(
        "-password -refreshToken"
        );

        if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
        }

        return res.status(200).json({
        success: true,
        message: "Fetched successfully",
        user,
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({
        success: false,
        message: "Error fetching user",
        });
    }
};

export const logout = async (req, res) => {
  try {
    await setCache(`user:${req.user.id}`, null, 1);
    
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error("Error in LogOut:", error);
        return res.status(500).json({
        success: false,
        message: "Error logging out user",
        });
  }
};

export const refreshAccessToken = async(req, res)=>{
    try{
        const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;    //taking refresh token from httpOnly cookie or from request body

        if(!refreshToken){  //if no refresh token provided
            return res.status(400).json({message: "Refresh Token Missing"});
        }

        const decode = verifyRefreshToken(refreshToken) //if refresh token found verify it

        const user = await User.findById(decode._id).select("-password");   //if valid refresh token get user details from it

        if(!user){    //if no user found for id in refresh token
            return res.status(404).json({message: "User Not Found"});
        }

        const newAccessToken = generateAccessToken(user); //for user found generate new access token
        res.status(200).json({  //& return it in response as of access token
            status: "success",
            accessToken: newAccessToken
        });
    }catch (err){
        res.status(401).json({message: err.message});
    }
};