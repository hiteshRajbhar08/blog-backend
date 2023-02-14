const asyncHandler = require('express-async-handler');
const { User, validateUpdateUser } = require('../models/userModel');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
  cloudinaryRemoveMultipleImage,
} = require('../utils/cloudinary');
const { Post } = require('../models/postModel');
const { Comment } = require('../models/commentModel');

/**-----------------------------------------------
 * @desc    Get All Users Profile
 * @route   /api/users/profile
 * @method  GET
 * @access  private (only admin)
 ------------------------------------------------*/
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').populate('posts');
  res.status(200).json(users);
});

/**-----------------------------------------------
 * @desc    Get User Profile
 * @route   /api/users/profile/:id
 * @method  GET
 * @access  public
 ------------------------------------------------*/
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('-password')
    .populate('posts');

  if (!user) {
    return res.status(404).json({
      message: 'User not found',
    });
  }

  res.status(200).json(user);
});

/**-----------------------------------------------
 * @desc    Update User Profile
 * @route   /api/users/profile/:id
 * @method  PUT
 * @access  private (only user himself)
 ------------------------------------------------*/
const updateUserProfile = asyncHandler(async (req, res) => {
  const { error } = validateUpdateUser(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        username: req.body.username,
        password: req.body.password,
        bio: req.body.bio,
      },
    },
    {
      new: true,
    }
  )
    .select('-password')
    .populate('posts');

  res.status(200).json(updatedUser);
});

/**-----------------------------------------------
 * @desc    Get Users Count
 * @route   /api/users/count
 * @method  GET
 * @access  private (only admin)
 ------------------------------------------------*/
const getUsersCount = asyncHandler(async (req, res) => {
  const count = await User.count();
  res.status(200).json(count);
});

/**-----------------------------------------------
 * @desc    Profile Photo Upload
 * @route   /api/users/profile/profile-photo-upload
 * @method  POST
 * @access  private (only logged in user)
 ------------------------------------------------*/
const profilePhotoUpload = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: 'no file provided',
    });
  }

  // get the path to the image
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);

  // upload to cloudinary
  const result = await cloudinaryUploadImage(imagePath);

  // get user from the database
  const user = await User.findById(req.user.id);

  // change the profilephoto filled in database
  user.profilePhoto = {
    url: result.secure_url,
    publicId: result.public_id,
  };

  await user.save();

  res.status(200).json({
    message: 'Your profile photo uploaded successfully ',
    profilePhoto: {
      url: result.secure_url,
      publicId: result.public_id,
    },
  });

  // remove image from the server
  fs.unlinkSync(imagePath);
});

/**-----------------------------------------------
 * @desc    Delete User Profile (Account)
 * @route   /api/users/profile/:id
 * @method  DELETE
 * @access  private (only admin or user himself)
 ------------------------------------------------*/
const deleteUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({
      message: 'user not found',
    });
  }

  // Get all posts from DB
  const posts = await Post.find({ user: user._id });

  //  Get the public ids from the posts
  const publicIds = posts?.map((post) => post.image.publicId);

  //  Delete all posts image from cloudinary that belong to this user
  if (publicIds?.length > 0) {
    await cloudinaryRemoveMultipleImage(publicIds);
  }

  // delete profile photo
  if (user.profilePhoto.publicId !== null) {
    await cloudinaryRemoveImage(user.profilePhoto.publicId);
  }

  //  Delete user posts & comments
  await Post.deleteMany({ user: user._id });
  await Comment.deleteMany({ user: user._id });

  // delete the user himself
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    message: 'your profile has been deleted',
  });
});

module.exports = {
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  getUsersCount,
  profilePhotoUpload,
  deleteUserProfile,
};
