import { Router } from "express";
import {
  changePassword,
  changeUsername,
  getTotalUserBlogs,
  getUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/user.controller";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/changePassword").post(verifyJWT, changePassword);

router.route("/changeUsername").post(verifyJWT, changeUsername);

router.route("/refreshToken").post(verifyJWT,refreshAccessToken)

router.route("/getUser").post(verifyJWT,getUser)

router.route("/getTotalBlogs").post(verifyJWT,getTotalUserBlogs)

export default router;
