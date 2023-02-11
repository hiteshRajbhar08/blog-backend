const router = require('express').Router();
const {
  createComment,
  getAllComments,
  deleteComment,
} = require('../controllers/commentController');
const {
  verifyTokenAndAdmin,
  verifyToken,
} = require('../middlewares/verifyToken');
const validateObjectId = require('../middlewares/validateObjectId');

// /api/comments
router
  .route('/')
  .post(verifyToken, createComment)
  .get(verifyTokenAndAdmin, getAllComments);

// /api/comments/:id
router.route('/:id').delete(validateObjectId, verifyToken, deleteComment);

module.exports = router;