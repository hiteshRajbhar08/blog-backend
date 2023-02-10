const {
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  getUsersCount,
} = require('../controllers/userController');
const validateObjectId = require('../middlewares/validateObjectId');
const {
  verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
} = require('../middlewares/verifyToken');

const router = require('express').Router();

//  /api/users/profile
router.route('/profile').get(verifyTokenAndAdmin, getAllUsers);

//  /api/users/profile/:id
router
  .route('/profile/:id')
  .get(validateObjectId, getUserProfile)
  .put(validateObjectId, verifyTokenAndOnlyUser, updateUserProfile);

//  /api/users/count
router.route('/count').get(verifyTokenAndAdmin, getUsersCount);

module.exports = router;
