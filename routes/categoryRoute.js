const router = require('express').Router();
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken');
const validateObjectId = require('../middlewares/validateObjectId');
const {
  createCategory,
  getAllCategories,
  deleteCategory,
} = require('../controllers/categoryController');

// /api/categories
router
  .route('/')
  .post(verifyTokenAndAdmin, createCategory)
  .get(getAllCategories);

// /api/categories/:id
router
  .route('/:id')
  .delete(validateObjectId, verifyTokenAndAdmin, deleteCategory);

module.exports = router;
