const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const User = require('../models/user');

router.post('/signup', signup);
router.post('/login', login);

module.exports = router;
