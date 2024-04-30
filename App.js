import cors from "cors";
import "dotenv/config";
import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";


//express
const app = express()

//Middlewares
app.use(cors())
app.use(urlencoded({extended:true}))
app.use(express.json())
app.use(cookieParser())
app.use(express.static("public"))

//routes
import userRoutes from "./routes/user.routes.js"
import blogRoutes from "./routes/blog.routes.js"


app.use("/api/v1/users",userRoutes)

app.use("/api/v1/blogs",blogRoutes)


export {app}
