const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const {
  User,
  validateRegisterUser,
  validateLoginUser,
} = require('../models/userModel');

/**-----------------------------------------------
 * @desc    Register New User
 * @route   /api/auth/register
 * @method  POST
 * @access  public
 ------------------------------------------------*/
const registerUser = asyncHandler(async (req, res) => {
  const { error } = validateRegisterUser(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({
      message: 'User already exists',
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });

  await user.save();

  res.status(201).json({
    message: 'User Register Successfully, Please log in',
  });
});

/**-----------------------------------------------
 * @desc    Login User
 * @route   /api/auth/login
 * @method  POST
 * @access  public
 ------------------------------------------------*/
const loginUser = asyncHandler(async (req, res) => {
  const { error } = validateLoginUser(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({
      message: 'Invalid email or password',
    });
  }

  const isPasswordMatch = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isPasswordMatch) {
    return res.status(400).json({
      message: 'Invalid email or password',
    });
  }

  const token = user.generateAuthToken();

  res.status(200).json({
    _id: user._id,
    isAdmin: user.isAdmin,
    profilePhoto: user.profilePhoto,
    token,
  });
});

module.exports = {
  registerUser,
  loginUser,
};
