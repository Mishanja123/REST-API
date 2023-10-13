const { Types } = require('mongoose');

const User = require('../models/userModel');
const { AppError, catchAsync } = require('../utils');
const { regToken } = require('./jwtService');
const ImageService = require('./imageService');


exports.createUser = async (userData) => {
    const newUser = await User.create(userData);

    newUser.password = undefined;
    
    const token = regToken(newUser._id);

    const {email, subscription} = newUser
    
    return { user: {email, subscription}};
};


exports.loginUser = async (userData) => {    
    const user = await User.findOne({ email: userData.email}).select('+password');

    if (!user) throw new AppError(401, 'Email or password is wrong');

    const passwordIsValid = await user.checkPassword(userData.password, user.password);

    if (!passwordIsValid) throw new AppError(401, 'Email or password is wrong');
    
    user.password = undefined;

    const token = regToken(user.id);

    return {user, token};
};


exports.getUser = (id) => User.findById(id);

exports.updateSubscription = async (user, updatedData) => {
    const updatedUser = await User.findByIdAndUpdate(user._id, updatedData, {new: true}).select('-password')

    return updatedUser;
};





exports.updateAvatar = async (user, updatedData, file) => {

    if (!file) throw new AppError(400, 'No file added');

    user.avatarURL = await ImageService.save(file, user.id, 'avatars');        

    Object.keys(updatedData).forEach((key) => {
        user[key] = updatedData[key];
    });

    return user.save();
};






exports.validatorError = (value, error) => {
    const requiredFields = ['email', 'password'];
    for (const field of requiredFields) {
        if (!value[field]) throw new AppError(400, `Missing required ${field} field`);
    }

    throw new AppError(400, `${error.message}`);
};


exports.checkUserExistsByEmail = async (newEmail) => {
    const userExists = await User.exists({email: newEmail});

    if(userExists) throw new AppError('409', "Email in use")
};

exports.checkSubscriptionBody = (body) => {
    if (!body || Object.keys(body).length === 0) throw new AppError(400, "Missing subscription status");
};

