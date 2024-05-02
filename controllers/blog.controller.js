import asyncHandler from "../utils/asyncHandler";
import Blog from "../models/blog.model";
import ApiError from "../utils/ApiError";
import { User } from "../models/user.model";
import ApiResponse from "../utils/ApiResponse";

const createBlog = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  if (!(title && content)) {
    throw new ApiError(401, "Title and content are required field!");
  }
 
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  const createdBlog = await Blog.create({
    author: req.user._id,
    title,
    content,
  });

  await createdBlog.save();

  res
    .status(200)
    .json(new ApiResponse(200, "Blog created successfully!", createdBlog));
});

const updateBlog = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  const blogExists = await Blog.findById(req.params.id);

  if (!blogExists) {
    throw new ApiError(404, "Blog doesn't exists!");
  }

  const isTitleChanged = title && title !== blogExists.title;
  const isContentChanged = content && content !== blogExists.content;

  if (!isTitleChanged && !isContentChanged) {
    throw new ApiError(400, "No content is changed!");
  }

  const updatedBlog = {};

  if (isTitleChanged) {
    updatedBlog.title = title;
  }
  if (isContentChanged) {
    updatedBlog.content = content;
  }

  const newBlog = await Blog.findByIdAndUpdate(req.params.id, updatedBlog, {
    new: true,
  });

  res
    .status(200)
    .json(new ApiResponse(200, "Fields updated successfully!", newBlog));
});

const getUserBlogs = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  const blogs = await Blog.find({ author: req.user?._id }).select(
    "title content author"
  );

  if (blogs.length === 0) {
    throw new ApiError(404, "No blogs found for this user!");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Blogs found successfully!", blogs));
});

const deleteBlog = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  await Blog.findByIdAndDelete(req.params.id);

  res.status(200).json(new ApiResponse(200, "Blog deleted successfully!"));
});

export { createBlog, updateBlog, getUserBlogs, deleteBlog };
