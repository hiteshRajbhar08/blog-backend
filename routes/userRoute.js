const { getAllUsers } = require('../controllers/userController');
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require('../middlewares/verifyToken');

const router = require('express').Router();

//  /api/users/profile
router.route('/profile').get(verifyTokenAndAdmin, getAllUsers);

module.exports = router;
