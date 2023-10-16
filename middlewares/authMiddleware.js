const { AppError, catchAsync, userValidator,  } = require("../utils");
const { validatorError, checkUserExistsByEmail, getUser } = require('../services/userService');
const { checkBody } = require("../services/contactService");
const { checkToken } = require("../services/jwtService");
// const ImageService = require('../services/imageService');

const multer = require('multer');





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
});

const multerStorage = multer.diskStorage({
    destination: (req, file , cbk) => {
        cbk(null, 'tmp');
    },
    filename: (req, file, cbk) => {
        const extension = file.mimetype.split('/')[1];

        cbk(null, `${req.user.id}-${file.originalname.split('.')[0]}.${extension}`);
    },
});

const multerFilter = (req, file, cbk) => {
    if (file.mimetype.startsWith('image/')) {
        cbk(null, true);
    } else {
            cbk(new AppError(401, 'Not authorized'), false);
        }
};



exports.uploadUserAvatar = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: {
        fileSize: 2 * 1024 * 1024
    }
}).single('avatar');
