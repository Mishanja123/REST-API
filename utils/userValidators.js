const Joi = require('joi');

const { userSubEnum } = require('../constants');

exports.createUserDataValidator = (data) =>
    Joi
        .object()
        .options({ abortEarly: false })
        .keys({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            // subscription: Joi.string().valid(...Object.values(userSubEnum)),
        })
        .validate(data);

exports.loginUserDataValidator = (data) => 
        Joi
            .object()
            .options({ abortEarly: false })
            .keys({
                email: Joi.string().email().required(),
                password: Joi.string().required(),
            })
            .validate(data);

exports.updateSubscriptionValidator = (data) =>
    Joi
        .object()
        .options({ abortEarly: false })
        .keys({
            subscription: Joi.string().valid(...Object.values(userSubEnum))
        })
        .validate(data);