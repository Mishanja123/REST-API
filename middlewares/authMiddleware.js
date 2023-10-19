const { AppError, catchAsync, userValidator,  } = require("../utils");
const { validatorError, checkUserExistsByEmail, getUser } = require('../services/userService');
const { checkBody } = require("../services/contactService");
const { checkToken } = require("../services/jwtService");
const ImageService = require('../services/imageService');
const User = require("../models/userModel");


exports.protect = catchAsync(async (req, res, next) => {
    const token = req.headers.authorization?.startsWith('Bearer') && req.headers.authorization.split(' ')[1];

    if (!token) throw new AppError(401, 'Not authorized')

    const userId = checkToken(token);

    const currentUser = await getUser(userId).select('-password');

    if (!currentUser) throw new AppError(401, 'Not authorized');
    

    req.user = currentUser;
    
    next();
});

exports.checkRegisterUserData = catchAsync(async (req, res, next) => {
    checkBody(req.body);

    const {error, value} = userValidator.createUserDataValidator(req.body)
    if (error) validatorError(value, error);

    await checkUserExistsByEmail(value.email)

    req.body = value;
    
    next();
})

exports.checkLoginUserData = catchAsync(async (req, res, next) => {
    checkBody(req.body)
    
    const {error, value} = userValidator.loginUserDataValidator(req.body)
    if (error) validatorError(value, error);
    
    req.body = value;
    
    next();
});

exports.verify = catchAsync(async (req, res, next) => {
    const {email} = req.body
    const user = await User.findOne({email})

    if (user.verify !== true) throw new AppError(404, 'Non authorize')

    next();
});

exports.checkSubscription = catchAsync(async (req, res, next) => {
    checkBody(req.body);

    const {error, value} = userValidator.updateSubscriptionValidator(req.body);

    if (error) throw new AppError(400, `${error.message}`);

    req.body = value;

    next();
});

exports.checkAvatar = catchAsync(async (req, res, next) => {
    checkBody(req.body);

    const {error, value} = userValidator.updateAvatarValidator(req.body);

    if (error) throw new AppError(400, `${error.message}`);

    req.body = value;

    next();
});

exports.checkEmail = catchAsync(async (req, res, next) => {
    checkBody(req.body);

    const {error, value} = userValidator.emailValidator(req.body);

    if (error) throw new AppError (400, `${error.message}`);

    req.body = value;

    next();
})

exports.uploadUserAvatar = ImageService.initUploadMiddleware('avatar');
