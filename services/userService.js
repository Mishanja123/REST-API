const Jimp = require('jimp');
const path = require('path');
const uuid = require('uuid').v4;
const fse = require('fs-extra');
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY || 'key-yourkeyhere'});

const User = require('../models/userModel');
const { AppError } = require('../utils');
const { regToken } = require('./jwtService');
const ImageService = require('../services/imageService');





const sendVerificationEmail = (email, verificationToken) => {
    mg.messages.create('sandbox89cf6ec81e87487bb750084e6226849a.mailgun.org', {
        from: "Excited User <mailgun@sandbox-123.mailgun.org>",
        to: ['shevchenkom606@gmail.com'],
        //to: [email]
        subject: "Hello",
        text: `Testing some Mailgun awesomeness!`,
        html: `<h1>Veify your email(just put the text below this text to input in postman)</h1><p>/users/verify/${verificationToken}</p>`
    })
    .then(msg => console.log(msg))
    .catch(err => console.log(err));
  };



exports.createUser = async (userData) => {
    const newUser = await User.create(userData);

    newUser.password = undefined;
    
    const token = regToken(newUser._id);

    const {email, subscription, verificationToken} = newUser
    
    await sendVerificationEmail(email, verificationToken)

    return { user: {email, subscription}};
};




exports.verifyUser = async (verificationToken) => {
    const user = await User.findOne({ verificationToken });


    if (!user) {
      throw new AppError(404, 'User not found');
    }
  
    user.verificationToken = null;
    user.verify = true;
    await user.save();

}

exports.secondVerify = async (email) => {
    
      const user = await User.findOne({ email });
    
      if (!user) throw new AppError(404, 'User not found')
    
      if (user.verify) throw new AppError(400, 'Verification has already been passed')
    
      if (!user.verificationToken) throw new AppError(400, 'No verification token found')
    
      const verificationToken = user.verificationToken;
      await sendVerificationEmail(user.email, verificationToken);
    
}

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



exports.updateAvatar = async (user, file) => {

    if (!file) throw new AppError(400, 'No file added');

    const userAvatarFilePath = await ImageService.findUserAvatarFile(user.id);

    if (userAvatarFilePath) {
        const fullAvatarPath = path.join(process.cwd(), 'public', 'avatars', `${user.id}-${uuid()}.jpeg`);

        await fse.move(userAvatarFilePath, fullAvatarPath);

        const image = await Jimp.read(fullAvatarPath);
        await image.resize(250, 250).quality(90).write(fullAvatarPath);

        user.avatarURL = path.join('avatars', path.basename(fullAvatarPath));

        await user.save();

        return user;
    } else {
        throw new AppError(404, 'User avatar file not found');
    }
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

