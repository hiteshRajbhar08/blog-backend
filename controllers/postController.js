const {
  Post,
  validateCreatePost,
  validateUpdatePost,
} = require('../models/postModel');
const fs = require('fs');
const path = require('path');
const asyncHandler = require('express-async-handler');
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} = require('../utils/cloudinary');

/**-----------------------------------------------
 * @desc    Create New Post
 * @route   /api/posts
 * @method  POST
 * @access  private (only logged in user)
 ------------------------------------------------*/
const createPost = asyncHandler(async (req, res) => {
  //  Validation for image
  if (!req.file) {
    return res.status(400).json({
      message: 'no image provided',
    });
  }

  //  Validation for data
  const { error } = validateCreatePost(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  //  Upload photo
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(imagePath);

  //  Create new post and save it to DB
  const post = await Post.create({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    user: req.user.id,
    image: {
      url: result.secure_url,
      publicId: result.public_id,
    },
  });

  res.status(201).json(post);

  // Remove image from the server
  fs.unlinkSync(imagePath);
});

/**-----------------------------------------------
 * @desc    Get All Posts
 * @route   /api/posts
 * @method  GET
 * @access  public
 ------------------------------------------------*/
const getAllPosts = asyncHandler(async (req, res) => {
  const POST_PER_PAGE = 3;
  const { pageNumber, category } = req.query;
  let posts;

  if (pageNumber) {
    posts = await Post.find()
      .skip((pageNumber - 1) * POST_PER_PAGE)
      .limit(POST_PER_PAGE)
      .sort({ createdAt: -1 })
      .populate('user', ['-password']);
  } else if (category) {
    posts = await Post.find({ category })
      .sort({ createdAt: -1 })
      .populate('user', ['-password']);
  } else {
    posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('user', ['-password']);
  }

  res.status(200).json(posts);
});

module.exports = {
  createPost,
  getAllPosts,
};