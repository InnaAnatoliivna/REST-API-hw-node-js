const express = require('express')
const router = express.Router()
const ctrl = require('../controller/users')
const authenticateToken = require('../middlewares/tokenVerification')
const upload = require('../middlewares/uploadHandler')

// router.all('/avatars', authenticateToken);

// POST /users/register
router.post('/register', ctrl.register)

// POST /users/login
router.post('/login', ctrl.login)

// POST /users/logout
router.post('/logout', authenticateToken, ctrl.logout)

// GET /users/current
router.get('/current', authenticateToken, ctrl.getCurrentUser)

// PATCH /users/avatar
router.patch('/avatars', upload.single('avatar'), ctrl.avatarUpdate);

module.exports = router;
