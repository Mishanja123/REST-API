const fs = require('fs').promises;


exports.getContacts = (req, res) => {
  const contacts  = req.contacts   
   
  res.status(200).json(
      contacts
  );
};

exports.getContactById = (req, res) => {
  const contact = req.contact;
  
  res.status(200).json(
    contact
  );
};

exports.createContact =  (req, res) => {
  const newContact = req.newContact;

  res.status(201).json(
    newContact
  );
};

exports.deleteContact =  (req, res) => {

  res.status(200).json({
    message: "Contact deleted"
  });
};

exports.updateContact = (req, res) => {
  const updatedContact = req.updatedContact;
  
  res.status(200).json(
    updatedContact
  );
};

exports.updateStatusContact = (req, res) => {
  const updatedContact = req.updatedContact;

  res.status(200).json(
    updatedContact
  );
};
