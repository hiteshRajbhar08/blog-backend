const {
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  getUsersCount,
  profilePhotoUpload,
  deleteUserProfile,
} = require('../controllers/userController');
const photoUpload = require('../middlewares/photoUpload');
const validateObjectId = require('../middlewares/validateObjectId');
const {
  verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
  verifyToken,
  verifyTokenAndAuthorization,
} = require('../middlewares/verifyToken');
const router = require('express').Router();

//  /api/users/profile
router.route('/profile').get(verifyTokenAndAdmin, getAllUsers);

//  /api/users/profile/:id
router
  .route('/profile/:id')
  .get(validateObjectId, getUserProfile)
  .put(validateObjectId, verifyTokenAndOnlyUser, updateUserProfile)
  .delete(validateObjectId, verifyTokenAndAuthorization, deleteUserProfile);

//  /api/users/profile/profile-photo-upload
router
  .route('/profile/profile-photo-upload')
  .post(verifyToken, photoUpload.single('image'), profilePhotoUpload);

//  /api/users/count
router.route('/count').get(verifyTokenAndAdmin, getUsersCount);

module.exports = router;
