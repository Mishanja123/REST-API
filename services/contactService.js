const { Types } = require('mongoose');

const Contact = require('../models/contactModel');
const { AppError } = require('../utils');


exports.getContacts = () => Contact.find();

exports.getContact = (id) => Contact.findById(id);

exports.createContact = async (contactData) => {
    const newContact = await Contact.create(contactData)

    newContact.favorite = undefined;

    return newContact;
};

exports.updateContact = async (id, contactData) => {

    const contact = await Contact.findById(id);

    Object.keys(contactData).forEach((key) => {
        contact[key] = contactData[key]
    })

    return contact.save();
};

exports.updateStatusContact = async (id, contactData) => {
    const updatedContact = await Contact.findByIdAndUpdate(id, contactData, {new: true,}).select('+favorite');

    return updatedContact;
};

exports.deleteContact = async (id) => Contact.findByIdAndDelete(id);

exports.checkContactExistsById = async (id) => {
    const idIsValid = Types.ObjectId.isValid(id);
    if (!idIsValid) throw new AppError(404, 'Not found');
   
    const contactExists = await Contact.exists({ _id: id });
    if (!contactExists) throw new AppError(404, "Not found");
};

exports.checkBody = (body) => {
    if (!body || Object.keys(body).length === 0) throw new AppError(400, "Missing fields");
};

exports.checkStatusBody = (body) => {
    if (!body || Object.keys(body).length === 0) throw new AppError(400, "Missing field favorite");
};