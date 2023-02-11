const { createPost } = require('../controllers/postController');
const photoUpload = require('../middlewares/photoUpload');
const validateObjectId = require('../middlewares/validateObjectId');
const {
  verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
  verifyToken,
  verifyTokenAndAuthorization,
} = require('../middlewares/verifyToken');
const router = require('express').Router();

// /api/posts
router.route('/').post(verifyToken, photoUpload.single('image'), createPost);

module.exports = router;
