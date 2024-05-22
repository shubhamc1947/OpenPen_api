import express from "express";
// import con from './db.js';
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.Routes.js";
import postsRoutes from "./routes/posts.Routes.js";
import multer from "multer";
import dotevn from 'dotenv';
dotevn.config();

const app = express();

// middlewares

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL, // Replace with your frontend URL
  credentials: true, // This allows cookies to be sent and received
};

app.use(cors(corsOptions));

// app.use(cors())
app.use(cookieParser());
app.use(express.json());


//upload image fun here for blog post

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../website/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });

app.post("/api/upload", upload.single("file"), function (req, res) {
  const file = req.file;
  res.status(200).json(file.filename);//returning file name for Storing in db
  
});

// upload image function for users profile pic

const storage2 = multer.diskStorage({
  
  destination: function (req, file, cb) {
    cb(null, "../website/public/profile");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload2 = multer({ storage:storage2 });

app.post("/api/profile", upload2.single("profile"), function (req, res) {
  const file = req.file;
  res.status(200).json({filename:file.filename});//returning file name for Storing in db
  // console.log("hello");
});





//routes define here 


app.use("/api/", authRoutes);
app.use("/api/posts", postsRoutes);

const PORT=process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log("Server is Running pn "+ PORT );
});
