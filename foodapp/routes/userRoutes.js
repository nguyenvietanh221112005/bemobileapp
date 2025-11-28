const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// Lấy thông tin người dùng theo id
router.get('/:id', UserController.getUserById);

router.put('/update/:id', UserController.updateUserById);

module.exports = router;
