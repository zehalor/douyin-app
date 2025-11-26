import { Router } from "express";
import {
  createVideo,
  getVideos,
  deleteVideo,
  updateVideo,
} from "../controllers/videoController";
import { upload } from "../utils/upload";

const router = Router();

router.get("/", getVideos);
router.post("/", upload.single("video"), createVideo);
router.put("/:id", updateVideo);
router.delete("/:id", deleteVideo);

export default router;
