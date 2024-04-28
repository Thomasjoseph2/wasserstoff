import express from "express";
import multer from "multer";
import path from 'path'
const router = express.Router();

import {
  authUser,
  registerUser,
  logoutUser,
  addImage,
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";

const storage = multer.memoryStorage();
const allowedExtensions = [".jpg", ".jpeg", ".webp", ".png",".avif"];

const fileFilter = (req, file, cb) => {
  const extname = path.extname(file.originalname);
  if (allowedExtensions.includes(extname.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, WEBP,AVIF and PNG images are allowed!"), false);
  }
};

const upload = multer({ storage: storage, fileFilter,limits: { fileSize: 1000000 } });

router.post("/register", registerUser);
router.post("/auth", authUser);
router.post("/logout", logoutUser);
router.post(
  "/add-image",
  protect,
  upload.single("users-image"),
  addImage
);

export default router;
