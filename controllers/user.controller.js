import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import { User } from "../models/user.model";
import Blog from "../models/blog.model"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ApiResponse from "../utils/ApiResponse";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    // console.log(user);
    const accessToken = user.generateAccessToken();
    // console.log(accessToken);

    const refreshToken = user.generateRefreshToken();
    // console.log(refreshToken);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens!"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, password, username } = req.body;

  if (email === "" || password === "" || username === "") {
    throw new ApiError(400, "Required field empty!");
  }

  const userExists = await User.findOne({ $or: [{ username }, { email }] });

  if (userExists) {
    throw new ApiError(409, "User already exits!");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    password: hashedPassword,
    email,
  });

  res
    .status(201)
    .json(new ApiResponse(201, "User created successfully!", user));
});

const loginUser = asyncHandler(async (req, res) => {
  //email and password
  //check if empty
  //check in database
  //cookies add

  const { password, username } = req.body;

  if (!username || username === "") {
    throw new ApiError(400, "Username is required to login!");
  }

  if (password === "") {
    throw new ApiError(400, "Password is required to login!");
  }

  const user = await User.findOne({ username })

  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Password is incorrect!");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  // console.log(accessToken, refreshToken);

  const loggedInUser = await User.findById(user._id).select(
    " -password -refreshToken "
  );

  const options = {
    httpOnly: true, 
    secure: true,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, "User logged In successfully!", {
        user:{accessToken,
        refreshToken,
        loggedInUser},
      })
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpsOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User logout successfully!", {}));
}); 

const getTotalUserBlogs = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  const totalBlogs = await Blog.countDocuments({ author: req.user?._id });

  res.status(200).json(new ApiResponse(200, "Total blogs fetched successfully!", { totalBlogs }));
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (oldPassword === "" || newPassword === "") {
    throw new ApiError(400, "Password is required!");
  }

  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(402, "Password is incorrect!");
  }
 
  const newHashedPassword = await bcrypt.hash(newPassword,10)

  user.password = newHashedPassword;

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, "User password changed successfully!"));
});

const getUser = asyncHandler(async(req,res) => {
  const user = await req.user
  if(!user){
    throw new ApiError(404,"User not found!")
  }

  return res.status(200).json(new ApiResponse(200,"User fetched successfully!",user))
})


const changeUsername = asyncHandler(async(req,res) => {
  const {username,oldUsername} = req.body;

  if(!username || !oldUsername){
    throw new ApiError(402,"Username is required!")
  }

  const user = await User.findById(req.user._id)


  if(!user){
    throw new ApiError(404,"User not found!")
  }

  if(oldUsername !== user.username ){
    throw new ApiError(402,"Incorrect Old Username!")
  }

  user.username = username

  await user.save({validateBeforeSave:false})

  res.status(200).json(new ApiResponse(200,"Username changed successfully!"))

})

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized Request!");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh Token!");
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh Token is expired!");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newrefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newrefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newrefreshToken },
          "Access Token Refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(400, error?.message || "Invalid Rrefresh Token!");
  }
});


export { registerUser, getTotalUserBlogs , loginUser, logoutUser, getUser, changePassword,changeUsername,refreshAccessToken };
