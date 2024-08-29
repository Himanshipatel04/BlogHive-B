import cors from "cors";
import "dotenv/config";
import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
 
//express
const app = express(); 
 
//Middlewares
app.use(
  cors({
    origin: [ 
      "http://localhost:3000",
      "https://bloghive-lovat.vercel.app",
      "https://bloghive-git-main-himanshipatel0409gmailcoms-projects.vercel.app",
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

//routes
import userRoutes from "./routes/user.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import likeRoutes from "./routes/like.routes.js";

app.use("/api/v1/users", userRoutes);

app.use("/api/v1/blogs", blogRoutes);

app.use("/api/v1/likes", likeRoutes);

// sendEmail()

export { app };
