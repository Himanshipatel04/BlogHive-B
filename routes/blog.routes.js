import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { createBlog, deleteBlog, getUserBlogs, updateBlog } from "../controllers/blog.controller";

const router = Router() 

router.route("/createBlog").post(verifyJWT,createBlog)

router.route("/updateBlog/:id").post(verifyJWT,updateBlog)

router.route("/allBlogs").post(verifyJWT,getUserBlogs)

router.route("/deleteBlog/:id").post(verifyJWT,deleteBlog)

export default router