import { Router } from "express";
import { createShow } from "../controllers/show";
import { authenticated } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authenticated, createShow);



export default router;