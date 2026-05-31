import {Router} from "express"
import { createScreen, getAllScreens, getScreenByID, getScreensByTheater, updateScreen, deleteScreen } from "../controllers/screen"
import { authenticated } from "../middleware/authMiddleware";

const router=Router()


router.post("/",authenticated,createScreen)
router.get("/", getAllScreens)
router.get("/theater/:theaterId", getScreensByTheater)
router.get("/:id", getScreenByID)
router.put("/:id", authenticated, updateScreen)
router.delete("/:id", authenticated, deleteScreen)


export default router;
