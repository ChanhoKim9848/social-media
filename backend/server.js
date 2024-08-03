import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

// server starts, connect to DB
connectDB();
const app = express();

const PORT = process.env.PORT || 5000;

// connect to our cloudinary account and save image files on cloudinary database
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// to parse JSON data in the req.body
app.use(express.json());
// url encoded used to parse form data req.body
// extended: even if the request body has some nested object,
// it is still able to parse
app.use(express.urlencoded({ extended: true }));
// get cookie from the request and set the cookie inside response
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.listen(PORT, () =>
  console.log(`Server started at http://localhost:${PORT}`)
);
