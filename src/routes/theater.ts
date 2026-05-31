import { Router } from "express";
import {
  createTheater,
  getAllTheaters,
  getTheaterById,
  getTheatersByCity,
  updateTheater,
  deleteTheater,
} from "../controllers/theater";
import { authenticated } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authenticated, createTheater);
router.get("/", getAllTheaters);
router.get("/city/:city", getTheatersByCity);
router.get("/:id", getTheaterById);
router.put("/:id", authenticated, updateTheater);
router.delete("/:id", authenticated, deleteTheater);

export default router;
