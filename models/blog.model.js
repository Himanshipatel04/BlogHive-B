import mongoose from "mongoose";

const blogSchema = mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
      validate: {
        validator: (value) => {
          return value.trim().split(/\s+/).length <= 100;
        },
        message: (props) => `${props.value} exceeds the limit of 100 words!`,
      },
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
