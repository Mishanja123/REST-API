const Joi = require('joi');

exports.createContactDataValidator = (data) =>
    Joi
        .object()
        .options({ abortEarly: false })
        .keys({
            name: Joi.string().min(2).max(20).required(),
            email: Joi.string().email().required(),
            phone: Joi.number().required()
        })
        .validate(data);


exports.updateContactDataValidator = (data) =>
    Joi
        .object()
        .options({ abortEarly: false })
        .keys({
            name: Joi.string().min(2).max(20),
            email: Joi.string().email(),
            phone: Joi.number()
        })
        .validate(data);


exports.updateStatusContactValidator = (data) =>
    Joi
        .object()
        .options({ abortEarly: false })
        .keys({
            favorite: Joi.boolean().required()
        })
        .validate(data);