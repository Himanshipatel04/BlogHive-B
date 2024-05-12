import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { getLikes, toggleLike } from "../controllers/like.controller.js";


const router = Router()

router.route("/createLike").post(verifyJWT,toggleLike)
router.route("/getLikes").post(verifyJWT,getLikes)
export default router