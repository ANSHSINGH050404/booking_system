import { Router } from "express";
import {
  createSeat,
  getSeatsByScreen,
  updateSeat,
  deleteSeat,
} from "../controllers/seat";
import { authenticated } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authenticated, createSeat);
router.get("/screen/:screenId", getSeatsByScreen);
router.put("/:id", authenticated, updateSeat);
router.delete("/:id", authenticated, deleteSeat);

export default router;
