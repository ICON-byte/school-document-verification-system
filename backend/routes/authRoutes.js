const express = require('express');
const { login, register } = require('../controllers/authController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

router.post('/login', login);
router.post('/register', auth, roleCheck('admin'), register); // only admin can register new users

module.exports = router;