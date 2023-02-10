const router = require('express').Router();
const { registerUser } = require('../controllers/authController');

//  /api/auth/register
router.post('/register', registerUser);

module.exports = router;
