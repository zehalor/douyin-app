import { Router } from "express";
import {
  createVideo,
  getVideos,
  deleteVideo,
  updateVideo,
} from "../controllers/videoController";
import { upload } from "../utils/upload";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.get("/", getVideos);
router.post(
  "/",
  authMiddleware,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  createVideo
);
router.put("/:id", updateVideo);
router.delete("/:id", deleteVideo);

export default router;
