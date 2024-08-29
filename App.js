import cors from "cors";
import "dotenv/config";
import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
 
//express
const app = express(); 
 
//Middlewares
app.use(
  cors({
    origin: "http://localhost:3000",  // Allows requests from this specific origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Specifies allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'],  // Specifies allowed headers in requests
    credentials: true,  // Allows credentials like cookies to be sent in requests
  })
);


app.options('*', cors());

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
