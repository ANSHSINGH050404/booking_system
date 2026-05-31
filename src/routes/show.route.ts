import { Router } from "express";
import {
  createShow,
  getAllShows,
  getShowByID,
  getShowsByMovie,
  getShowsByScreen,
  updateShow,
  deleteShow,
} from "../controllers/show";
import { authenticated } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authenticated, createShow);
router.get("/", getAllShows);
router.get("/movie/:movieId", getShowsByMovie);
router.get("/screen/:screenId", getShowsByScreen);
router.get("/:id", getShowByID);
router.put("/:id", authenticated, updateShow);
router.delete("/:id", authenticated, deleteShow);

export default router;
