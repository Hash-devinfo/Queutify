import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  getGenerations,
  getPosts,
  schedulePost,
} from "../controllers/postController.js";
import { upload } from "../config/multer.js";

const postRouter = express.Router();

postRouter.get("/", protect, getPosts);
postRouter.get("/generations", protect, getGenerations);
postRouter.post("/", protect, upload.single("media"), schedulePost);
postRouter.post("/", protect, upload.single("media"), schedulePost);

export default postRouter;
