import { Router } from 'express';
import {
   createBlog,
   updateBlog,
   deleteBlog,
   getAllBlog,
   getBlogById
} from "../controllers/blog.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"

const router = Router();
router.use(verifyJWT); 

router
    .route("/")
    .get(getAllBlog)
    .post(
        upload.fields([
            {
                name: "thumbnail",
                maxCount: 1,
            }, 
        ]),
        createBlog
    );

router
    .route("/:BlogId")
    .get(getBlogById)
    .delete(deleteBlog)
    .patch(upload.single("thumbnail"), updateBlog);

export default router