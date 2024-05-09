import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { createBlog, deleteBlog, getAllBlogs, getAuthor, getBlogsById, getUserBlogs, updateBlog } from "../controllers/blog.controller";

const router = Router() 

router.route("/createBlog").post(verifyJWT,createBlog)

router.route("/updateBlog/:id").post(verifyJWT,updateBlog)

router.route("/allBlogs").post(verifyJWT,getUserBlogs)

router.route("/deleteBlog/:id").post(verifyJWT,deleteBlog)

router.route("/getAllBlogs").post(getAllBlogs)

router.route("/getBlogsById/:id").post(verifyJWT,getBlogsById)

router.route("/getAuthor/:id").post(verifyJWT,getAuthor)


export default router