const express = require("express");
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const UserController = require('../controllers/users');

router.get('/', checkAuth, UserController.users_get_all);

router.post('/signup', UserController.users_create_user);

router.post('/login', UserController.users_login);

router.delete('/:userId', checkAuth, UserController.users_delete_user); 

module.exports = router;