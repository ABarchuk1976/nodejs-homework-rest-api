const contactsModel = require('../models/contactsModel');

exports.listContactsController = async (req, res) => {
  try {
    const { id } = req.user;
    const contacts = await contactsModel.listContacts(id, req.query);

    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await contactsModel.getById(id);

    res.status(200).json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeContactController = async (req, res) => {
  try {
    const { id } = req.params;

    await contactsModel.removeContact(id);

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

    const updatedContact = await contactsModel.updateContact(id, body);

    res.status(200).send(updatedContact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addContactController = async (req, res) => {
  try {
    const { body, user } = req;

    console.log('Body: ', body, 'User: ', user);

    const addedContact = await contactsModel.addContact(body, user);

    res.status(201).send(addedContact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStatusContactController = async (req, res) => {
  try {
    const {
      params: { id },
      body,
    } = req;

    const updatedStatusContact = await contactsModel.updateStatusContact(
      id,
      body
    );

    console.log(updatedStatusContact);

    res.status(200).send(updatedStatusContact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
