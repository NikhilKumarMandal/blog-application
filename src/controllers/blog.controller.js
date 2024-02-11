import mongoose, {isValidObjectId} from "mongoose"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Blog } from "../models/blog.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// TEST CASE PASS
const createBlog = asyncHandler(async(req,res) => {
    const { title,content } = req.body

    if (
        [title,content].some((field) => field?.trim() === "" )
    ) {
        throw new ApiError(400,"All fileds are requried")
    }

    let thumbnailLocalPath;
    if (req.files && Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0) {
        thumbnailLocalPath = req.files.thumbnail[0].path
    }

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail file is required")
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!thumbnail) {
        throw new ApiError(400, "Thumbnail file is required")
    }

    const blog = await Blog.create({
        title,
        content,
        thumbnail: thumbnail?.url,
        author: req.user?._id
    })

    if (!blog) {
        throw new ApiError(500,"Something went wrong while making your blog")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            blog,
            "Blog create successfully"
            )
        )

})

const updateBlog = asyncHandler(async(req,res) => {
    const { blogId } = req.params
    const {title,content} = req.body;
    const thumbnailLocalPath = req.file?.path

    try {
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
        console.log("thumbnail:",thumbnail);
        
        if (!title && !content && !thumbnail) {
            throw new ApiError( "At least one field is required")
        }
    
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $set: {
                    title,
                    content,
                    thumbnail: thumbnail?.url
                }
            },
            {
                new: true
            }
        )
    
        if (!blog) {
            throw new ApiError("Video not found")  
        }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            blog,
            "Blog updated successfully"
            )
        )
    } catch (error) {
        throw new ApiError(500,error?.message || "Internal Server Error")
    }
})

const deleteBlog = asyncHandler(async(req,res) => {
    const { blogId } = req.params

    if (!blogId || !isValidObjectId(blogId)) {
        throw new ApiError(400, "Invalid Blog id");
    }

    const blog = await Blog.findByIdAndDelete(blogId)

    if (!blog) {
        throw new ApiError(404, "Blog does not exist");
    }
    
    return res
        .status(200)
        .json(
        new ApiResponse(
            200,
            { deletedBlog: blog },
            "Blog deleted successfully"
            )
        );

})

const getBlogById = asyncHandler(async(req,res) => {
    const { blogId } = req.params

    if (!blogId || !isValidObjectId(blogId)) {
        throw new ApiError(400, "Invalid Blog id");
    }

    const blog = await Blog.findById(blogId)

    if (!blog) {
        throw new ApiError(404, "Blog does not exist");
    }

    return res
        .status(200)
        .json(
        new ApiResponse(
            200,
            blog,
            "Blog fetched successfully"
            )
        );
})

const getAllBlog = asyncHandler(async(req,res) => {
    const { query,} = req.query;

    const blogs = await Blog.aggregate([
    {
    $match: query?.length > 0
        ? 
            {
            title: {
                $regex: query.trim(),
                $options: "i",
            },
            }
        : {},
    },
    {
    $sort: {
        updatedAt: -1,
    },
    },
]);

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            blogs,
            "blogs fetched successfully"
            )
        );
})

export {
    createBlog,
    updateBlog,
    deleteBlog,
    getBlogById,
    getAllBlog
}