const express = require('express')
const router = express.Router()
const ctrl = require('../controller/users')
const ctrlVerify = require('../controller/userVerify')
const authenticateToken = require('../middlewares/tokenVerification')
const upload = require('../middlewares/uploadHandler')
const resizeAvatar = require('../middlewares/resizeAvatarHandler')
const isFileExist = require('../middlewares/fileExistHadler')
const validateVerify = require('../middlewares/userVerifyHandler')

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
    ctrl.avatarUpdate
);

// POST /users/verify
router.post(
    '/verify',
    validateVerify.userVerifyHandler,
    ctrlVerify.verify
)

// GET /users/verify/:verificationToken
router.get(
    '/verify/:verificationToken',
    validateVerify.userVerificationTokenHandler,
    ctrlVerify.getVerificationToken
)


module.exports = router;
