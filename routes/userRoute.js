const {
  getAllUsers,
  getUserProfile,
} = require('../controllers/userController');
const validateObjectId = require('../middlewares/validateObjectId');
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require('../middlewares/verifyToken');

const router = require('express').Router();

//  /api/users/profile
router.route('/profile').get(verifyTokenAndAdmin, getAllUsers);

//  /api/users/profile/:id
router.route('/profile/:id').get(validateObjectId, getUserProfile);

module.exports = router;
