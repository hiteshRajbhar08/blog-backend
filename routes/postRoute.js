const {
  createPost,
  getAllPosts,
  getSinglePost,
  getPostCount,
} = require('../controllers/postController');
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
router
  .route('/')
  .post(verifyToken, photoUpload.single('image'), createPost)
  .get(getAllPosts);

// /api/posts/count
router.route('/count').get(getPostCount);

// /api/posts/:id
router.route('/:id').get(validateObjectId, getSinglePost);

module.exports = router;
