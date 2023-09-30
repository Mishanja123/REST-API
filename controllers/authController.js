const { catchAsync } = require('../utils');
const { createUser, loginUser, logoutUser, updateSubscription } = require('../services/userService');

exports.register = catchAsync(async (req, res) => {
    const { user } = await createUser(req.body);

    res.status(201).json({
        user
     })
});

exports.login = catchAsync(async (req, res) => {
    const { user, token } = await loginUser(req.body);

    res.status(200).json({
        token,
        user
    })
});

exports.logout = catchAsync(async (req, res) => {
        

    res.status(204).send();
});

exports.getMe = (req, res) => {
    res.status(200).json (
      req.user 
    )
  };

exports.updateSubscription = catchAsync(async (req, res) => {
  const updatedUser = await updateSubscription(req.user, req.body);

  res.status(200).json(
    updatedUser
  );
});
  