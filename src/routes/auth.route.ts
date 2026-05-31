import {Router} from "express"
import {signup,login,me} from "../controllers/auth"
import { authenticated } from "../middleware/authMiddleware"

const router=Router()


router.post("/signup",signup)
router.post("/login",login)
router.get("/me",authenticated,me)



export default router;