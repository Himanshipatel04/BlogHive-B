import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.body?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    //  console.log("Cookies:", req.cookies?.accessToken);
    // console.log("Body:", req.body?.accessToken);
    // console.log("Header:", req.header("Authorization"));

    if (!token) {
      return new ApiResponse(401, "Unauthorized Access!");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token!");
    }

    req.user = user;

    // console.log("before next",req.user);

    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token!");
  }
});
