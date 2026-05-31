import { Router } from "express";
import { createMovie,getAllMovie,getMovieByID } from "../controllers/movie";
import { authenticated } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authenticated,createMovie);
router.get("/all", getAllMovie);
router.get("/:id",getMovieByID);



export default router;
