const { AppError, catchAsync, contactValidator } = require('../utils');
const { checkContactExistsById, checkBody, checkStatusBody } = require('../services/contactService');


exports.checkContactId = catchAsync(async (req, res, next) => {
    await checkContactExistsById(req.params.id);

    next();
});

exports.checkCreateContactData = catchAsync(async (req, res, next) => {
    checkBody(req.body);

    const {error, value} = contactValidator.createContactDataValidator(req.body);

    if (error) {
        const requiredFields = ['name', 'email', 'phone'];
        for (const field of requiredFields) {
            if (!value[field]) throw new AppError(400, `Missing required ${field} field`);
        }

        throw new AppError(400, `${error.message}`);
    }

    req.body = value;
    
    next();
});

exports.checkUpdateContactData = catchAsync(async (req, res, next) => {
    checkBody(req.body);

    const {error, value} = contactValidator.updateContactDataValidator(req.body);

    if (error) throw new AppError(400, `${error.message}`);

    req.body = value;

    next();
});

exports.checkStatusContact = catchAsync(async (req, res, next) => {
    checkStatusBody(req.body);

    const {error, value} = contactValidator.updateStatusContactValidator(req.body);

    if (error) throw new AppError(400, `${error.message}`);

    req.body = value;

    next();
});