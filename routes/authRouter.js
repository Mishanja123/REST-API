const { Router } = require('express');


const {authMiddleware} = require('../middlewares');
const {authController} = require('../controllers');

const router = Router();

router.post('/register', authMiddleware.checkRegisterUserData, authController.register);
router.post('/login', authMiddleware.checkLoginUserData, authMiddleware.verify, authController.login);
router.get('/verify/:verificationToken', authController.verify);
router.post('/verify', authMiddleware.checkEmail, authController.secondEmail);

router.use(authMiddleware.protect)
    router.post('/logout', authController.logout);
    router.get('/current', authController.getMe);
    router.patch('/', authMiddleware.checkSubscription, authController.updateSubscription);
    router.patch('/avatars', authMiddleware.uploadUserAvatar, authController.updateAvatar);

module.exports = router;