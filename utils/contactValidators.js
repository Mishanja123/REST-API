const Joi = require('joi');

exports.contactDataValidator = (data) =>
    Joi
        .object()
        .options({ abortEarly: false })
        .keys({
            name: Joi.string().min(2).max(20).required(),
            email: Joi.string().min(12).max(25).required(),
            phone: Joi.number().required()
        })
        .validate(data);