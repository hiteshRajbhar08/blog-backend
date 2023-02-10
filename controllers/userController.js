const asyncHandler = require('express-async-handler');
const { User } = require('../models/userModel');

/**-----------------------------------------------
 * @desc    Get All Users Profile
 * @route   /api/users/profile
 * @method  GET
 * @access  private (only admin)
 ------------------------------------------------*/
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  res.status(200).json(users);
});

/**-----------------------------------------------
 * @desc    Get User Profile
 * @route   /api/users/profile/:id
 * @method  GET
 * @access  public
 ------------------------------------------------*/
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return res.status(404).json({
      message: 'User not found',
    });
  }

  res.status(200).json(user);
});

module.exports = {
  getAllUsers,
  getUserProfile,
};
