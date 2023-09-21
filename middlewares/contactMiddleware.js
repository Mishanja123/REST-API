const fs = require('fs').promises;
const { nanoid } = require('nanoid');

const { AppError, catchAsync, contactValidator } = require('../utils');

exports.readFile = catchAsync(async (req, res, next) => {
    const contactsDB = await fs.readFile('contacts.json');
    
    const contacts = JSON.parse(contactsDB); 

    if(!contacts) {
        throw new AppError(404, "Not found");
    }
    
    req.contacts = contacts;
    
    next();
});

exports.checkContactId = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if(id.length < 21){
        throw new AppError(400, "Invalid ID")
    }

    const contacts = req.contacts
       
    const contact = contacts.find((contact) => contact.id === id);
  
    if(!contact) {
        throw new AppError(404, "Not found");
    }
  
    req.contact = contact;
  
    next();
});

exports.findIndex = catchAsync(async (req, res, next) => {
    const contacts = req.contacts
    
    const contact = req.contact;
    
    const contactIndex = contacts.findIndex(item => item.id === contact.id);
    
    if (contactIndex === -1) {
        throw new AppError(404, "Not found");
    }

    req.contactIndex = contactIndex;
            
    next();
});

exports.createContact = catchAsync(async (req, res, next) => {
    const {error, value} = contactValidator.createContactDataValidator(req.body);

    if (error) {
        throw new AppError(404, `Invalid data ${error.message}`);
    }

    const {name, email, phone} = value;

    const newContact = {
        id: nanoid(),
        name,
        email,
        phone
    };

    const contacts = req.contacts

    contacts.push(newContact);
    
    await fs.writeFile('contacts.json',  JSON.stringify(contacts));
    
    req.newContact = newContact;
        
    next();
});

exports.updateContact = catchAsync(async (req, res, next) => {
    const { name, email, phone } = req.body;
    const contactToUpdate = req.contactIndex

    if (!contactToUpdate) {
        throw new AppError(404, "Contact not found");
    }

    if (contactToUpdate.name === name && contactToUpdate.email === email && contactToUpdate.phone === phone) {
        throw new AppError(400, "New data is the same as existing data");
    }

    const contacts = req.contacts

    const updatedContact = { name, email, phone };

    contacts[contactToUpdate] = {
        ...contacts[contactToUpdate],
        ...updatedContact
    };

    req.updatedContact = updatedContact

    next()
});