const express = require('express')
const router = express.Router()
const ctrl = require('../controller/users')
const authenticateToken = require('../middlewares/tokenVerification')
const upload = require('../middlewares/uploadHandler')
const resizeAvatar = require('../middlewares/resizeAvatarHandler')
const isFileExist = require('../middlewares/fileExistHadler')

// router.all('/avatars', authenticateToken);
// router.all('/avatars', resizeAvatar);
// router.all('/avatars', upload.single('avatar'));


// POST /users/register
router.post('/register', ctrl.register)

// POST /users/login
router.post('/login', ctrl.login)

// POST /users/logout
router.post('/logout', authenticateToken, ctrl.logout)

// GET /users/current
router.get('/current', authenticateToken, ctrl.getCurrentUser)

// PATCH /users/avatars
router.patch(
    '/avatars',
    authenticateToken,
    upload.single('avatar'),
    isFileExist,
    resizeAvatar,
    ctrl.avatarUpdate);

module.exports = router;
