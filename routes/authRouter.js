const { Router } = require('express');


const {authMiddleware} = require('../middlewares');
const {authController} = require('../controllers');

const router = Router();

router.post('/register', authMiddleware.checkRegisterUserData, authController.register);
router.post('/login', authMiddleware.checkLoginUserData, authController.login);

router.use(authMiddleware.protect)
    router.post('/logout', authController.logout);
    router.get('/current', authController.getMe);
    router.patch('/', authMiddleware.checkSubscription, authController.updateSubscription);
    router.patch('/avatars', authMiddleware.uploadUserAvatar, authController.updateAvatar);

module.exports = router;