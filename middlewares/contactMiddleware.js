const { Types } = require('mongoose');

const { AppError, catchAsync, contactValidator } = require('../utils');
const Contact = require('../models/contactModel');

exports.readFile = catchAsync(async (req, res, next) => {
    const contacts = await Contact.find();

    if(!contacts) {
        throw new AppError(404, "Not found");
    }
    
    req.contacts = contacts;
    
    next();
});

exports.checkContactId = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const idIsValid = Types.ObjectId.isValid(id);
    if (!idIsValid) throw new AppError(404, 'Not found');
   
    const contactExists = await Contact.exists({ _id: id });
    if(!contactExists) {
        throw new AppError(404, "Not found");
    }


    next();
});

// exports.findIndex = catchAsync(async (req, res, next) => {
//     const contacts = req.contacts
    
//     const contact = req.contact;
    
//     const contactIndex = contacts.findIndex(item => item.id === contact.id);
    
//     if (contactIndex === -1) {
//         throw new AppError(404, "Not found");
//     }

//     req.contactIndex = contactIndex;
            
//     next();
// });

exports.checkContactData = catchAsync(async (req, res, next) => {

    if (!req.body || Object.keys(req.body).length === 0) {
        throw new AppError(400, "Missing fields");
    }

    const {error, value} = contactValidator.contactDataValidator(req.body);

    if (error) {
        const requiredFields = ['name', 'email', 'phone'];

        for (const field of requiredFields) {
            if (!value[field]) throw new AppError(400, `Missing required ${field} field`);
        }

        throw new AppError(400, `${error.message}`);
    }

    // const contactExists = await Contact.exists({ phone: value.phone });

    // if(contactExists) throw new AppError(409, 'Contact with this phone number already exists');

    

    req.body = value;
    
    next();
});

exports.checkStatusContact = catchAsync(async (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        throw new AppError(400, "Missing field favorite");
    }

    const {error, value} = contactValidator.statusContactValidator(req.body);

    if (error) throw new AppError(400, `${error.message}`);

    req.body = value;

    next();
});

exports.getContactById = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const contact = await Contact.findById(id);
  
    req.contact = contact;

    next();
});

exports.createContact = catchAsync(async (req, res, next) => {
    const newContact = await Contact.create(req.body);

    newContact.favorite = undefined;
 
    req.newContact = newContact;
        
    next();
});

exports.deleteContact = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    await Contact.findByIdAndDelete(id)
    
    next();
});

exports.updateContact = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {new: true,});
   
    req.updatedContact = updatedContact;

    next();
});

exports.updateStatusContact = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    
    const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {new: true,});

    req.updatedContact = updatedContact;

    next();
});