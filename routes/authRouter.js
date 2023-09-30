const { Router } = require('express');


const {authMiddleware} = require('../middlewares');
const {authController} = require('../controllers');

const router = Router();

router.post('/register', authMiddleware.checkRegisterUserData, authController.register);
router.post('/login', authMiddleware.checkLoginUserData, authController.login);
router.post('/logout', authMiddleware.protect, authController.logout);

router.get('/current', authMiddleware.protect, authController.getMe);
router.patch('/', authMiddleware.protect, authMiddleware.checkSubscription, authController.updateSubscription);

// router.delete('/logout')

module.exports = router;