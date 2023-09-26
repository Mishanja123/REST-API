const { getContacts, getContact, createContact, updateContact, deleteContact, updateStatusContact } = require('../services/contactService');
const { catchAsync } = require('../utils');

exports.getContacts = catchAsync(async (req, res) => {
  const contacts = await getContacts();

  res.status(200).json(
      contacts
  );
});

exports.getContactById = catchAsync(async (req, res) => {
  const contact = await getContact(req.params.id)

  res.status(200).json(
    contact
  );
});

exports.createContact =  catchAsync(async (req, res) => {
  const newContact = await createContact(req.body);

  res.status(201).json(
    newContact
  );
});

exports.updateContactById = catchAsync(async (req, res) => {
  const updatedContact = await updateContact(req.params.id, req.body);

  res.status(200).json(
    updatedContact
  );
});

exports.updateStatusContactById = catchAsync(async (req, res) => {
  const updatedContact = await updateStatusContact(req.params.id, req.body);

  res.status(200).json(
    updatedContact
  );
});

exports.deleteContactById = catchAsync(async (req, res) => {
  await deleteContact(req.params.id);

  res.status(200).json({
    message: "Contact deleted"
  });
});
