const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const { User, validateRegisterUser } = require('../models/userModel');

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

module.exports = {
  registerUser,
};
