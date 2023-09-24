const Joi = require('joi');

exports.contactDataValidator = (data) =>
    Joi
        .object()
        .options({ abortEarly: false })
        .keys({
            name: Joi.string().min(2).max(20).required(),
            email: Joi.string().email().required(),
            phone: Joi.number().required()
        })
        .validate(data);

exports.statusContactValidator = (data) =>
        Joi
            .object()
            .options({ abortEarly: false })
            .keys({
                favorite: Joi.boolean().required()
            })
            .validate(data);