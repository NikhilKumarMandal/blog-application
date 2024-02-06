import { Router } from "express";
import passport from "passport";
import {
     registerUser,
     loginUser,
     logoutUser
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()



router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]),
    registerUser
    )

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT,  logoutUser)




// SSO routes
router.route("/google").get(
    passport.authenticate("google", {
      scope: ["profile", "email"],
    }),
    (req, res) => {
      res.send("redirecting to google...");
    }
  );
  

export default router