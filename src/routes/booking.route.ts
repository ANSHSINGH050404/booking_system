import { Router } from "express";
import { createBooking, getUserBookings } from "../controllers/booking";
import { authenticated } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authenticated, createBooking);
router.get("/", authenticated, getUserBookings);

export default router;