import { Router } from "express";
import {
  createMovie,
  getAllMovie,
  getMovieByID,
  updateMovie,
  deleteMovie,
} from "../controllers/movie";
import { authenticated } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authenticated, createMovie);
router.get("/all", getAllMovie);
router.get("/:id", getMovieByID);
router.put("/:id", authenticated, updateMovie);
router.delete("/:id", authenticated, deleteMovie);

export default router;
