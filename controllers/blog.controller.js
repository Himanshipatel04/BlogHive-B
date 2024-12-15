import asyncHandler from "../utils/asyncHandler.js";
import Blog from "../models/blog.model.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";

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

const getAllBlogs = asyncHandler(async (req, res) => {
  // Fetch all blogs from the database
  const blogs = await Blog.find().populate("author", "username");

  // Check if any blogs are found
  if (blogs.length === 0) {
    return res.status(404).json(new ApiResponse(404, "No blogs found!"));
  }

  // Return the blogs as a successful response
  res
    .status(200)
    .json(new ApiResponse(200, "Blogs found successfully!", blogs));
});

const getBlogsById = asyncHandler(async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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
  // console.log("hello i am here ");
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(404, "User not found!");
  }
  // console.log(req.user,"geyhsdf");

  const blogs = await Blog.find({ author: req.user?._id }).select(
    "title content author"
  );

  if (blogs.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, "No blogs found for this user!", []));
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

const getAuthor = asyncHandler(async (req, res) => {
  const author = await User.findById(req.params.id);
  if (!author) {
    throw new ApiError(404, "User not found!");
  }
  res.status(200).json(new ApiResponse(200, "Author fetched!", author));
});

export {
  createBlog,
  updateBlog,
  getBlogsById,
  getAuthor,
  getAllBlogs,
  getUserBlogs,
  deleteBlog,
};
