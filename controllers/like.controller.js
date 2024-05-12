import Blog from "../models/blog.model.js";
import Like from "../models/like.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const toggleLike = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  const userId = req.user.id;

  if (!blogId) {
    throw new ApiError(400, "Blog id is required!");
  }

  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(404, "Blog not found!");
  }
  const existingLike = await Like.findOne({ likedBy: userId, blog: blogId });

  let likeCount = await Like.countDocuments({ blog: blogId });

  if (existingLike) {
    await Like.deleteOne({ likedBy: userId, blog: blogId });
    likeCount -= 1;
    res
    .status(200)
    .json(new ApiResponse(200, "Like removed successfully!", { likeCount }));
  } else {
    try {
    const newLike = Like.create({ likedBy: userId, blog: blogId });
      likeCount += 1;
      res
      .status(200)
      .json(new ApiResponse(200, "Liked successfully!", { likeCount }));
    } catch (error) {
      throw new ApiError(500, "Error occurred while saving like.");
    }
  }

});

const getLikes = asyncHandler(async (req, res) => {
  const { blogId } = req.body;

  if (!blogId) {
    throw new ApiError(400, "Blog id is required!");
  }

  const likeCount = await Like.countDocuments({ blog: blogId });

  res.status(200).json(new ApiResponse(200, "Like count retrieved successfully!", { likeCount }));
});

export { toggleLike, getLikes };


