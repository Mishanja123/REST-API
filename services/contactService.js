const { Types } = require('mongoose');

const Contact = require('../models/contactModel');
const { AppError } = require('../utils');


exports.getContacts = async (query, user) => {
    const findOptions = query.favorite  ? {
        favorite: query.favorite
    } : {};

    if (query.favorite) {
        findOptions.owner = user;
    }
    if (!query.favorite) {
        findOptions.owner = user;
    }

    const contactsQuery = Contact.find(findOptions)

    const paginationPage = query.page ? +query.page : 1;
    const paginationLimit = query.limit ? +query.limit : 20;
    const docsToSkip = (paginationPage - 1) * paginationLimit;

    contactsQuery.skip(docsToSkip).limit(paginationLimit);

    const contacts = await contactsQuery;
    const onPage = contacts.length;
    const total =  await Contact.count(findOptions);

    return { contacts, total, onPage};
} 

 
exports.createContact = async (contactData, owner) => {
     
    const newContact = await Contact.create({
        ...contactData,
        owner
    })

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

exports.validatorErrorCheck = (value, error) => {
    const requiredFields = ['name', 'email', 'phone'];
    for (const field of requiredFields) {
        if (!value[field]) throw new AppError(400, `Missing required ${field} field`);
    }

    throw new AppError(400, `${error.message}`);
}