import {Router} from "express"
import {Theater} from "../controllers/theater"

const router=Router()


router.post("/",Theater)

 


export default router;