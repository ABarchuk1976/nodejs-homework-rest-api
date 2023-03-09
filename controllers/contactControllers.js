const contactModels = require('../models/contactsModels');

exports.listContactsController = async (_, res) => {
  try {
    const contacts = await contactModels.listContacts();

    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getByIdController = (req, res) => {
  const { contact } = req;

  res.status(200).json(contact);
};

exports.removeContactController = async (req, res) => {
  try {
    const { id } = req.params;

    await contactModels.removeContact(id);

    res.status(200).json({ message: 'contact deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateContactController = async (req, res) => {
  try {
    const {
      params: { id },
      body,
    } = req;

    const updatedContact = await contactModels.updateContact(id, body);

    res.status(200).send(updatedContact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addContactController = async (req, res) => {
  try {
    const { body } = req;

    const addedContact = await contactModels.addContact(body);

    res.status(201).send(addedContact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
