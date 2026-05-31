import { Router } from "express";
import {
  getShowSeatsByShow,
  lockShowSeat,
  releaseShowSeat,
} from "../controllers/showSeat";
import { authenticated } from "../middleware/authMiddleware";

const router = Router();

router.get("/show/:showId", getShowSeatsByShow);
router.post("/lock", authenticated, lockShowSeat);
router.post("/release", authenticated, releaseShowSeat);

export default router;
