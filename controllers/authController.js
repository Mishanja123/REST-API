const { catchAsync } = require('../utils');
const { createUser, loginUser, updateSubscription, updateAvatar } = require('../services/userService');
const {addToBlacklist} = require('../services/jwtService');


exports.register = catchAsync(async (req, res) => {
    const { user } = await createUser(req.body);
    res.status(201).json({
        user
     })
});

exports.login = catchAsync(async (req, res) => {
    const { user, token } = await loginUser(req.body);
    const {email, subscription} = user

    res.status(200).json({
        token,
        user: {
          email,
          subscription
        }
    })
});

exports.logout = catchAsync(async (req, res) => {
  const token = req.headers.authorization?.startsWith('Bearer') && req.headers.authorization.split(' ')[1];
  
addToBlacklist(token)
  
  res.status(204).send();
});

exports.getMe = (req, res) => {
  const {email, subscription} = req.user;

    res.status(200).json ({
        email,
        subscription
    })
  };

exports.updateSubscription = catchAsync(async (req, res) => {
  const updatedUser = await updateSubscription(req.user, req.body);

  res.status(200).json(
    updatedUser
  );
});

exports.updateAvatar = catchAsync(async (req, res) => {
  const {avatarURL} = await updateAvatar(req.user, req.file);
  
  res.status(200).json({
    avatarURL
  });
});
  