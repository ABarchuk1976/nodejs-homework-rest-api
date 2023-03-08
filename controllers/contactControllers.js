const fsPromises = require('fs').promises;
const shortid = require('shortid');

exports.listContacts = async (req, res) => {
  try {
    const bufferData = await fsPromises.readFile('./models/contacts.json');
    const contacts = JSON.parse(bufferData);

    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { contact } = req;

    res.status(200).json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeContact = async (req, res) => {
  try {
    const { id } = req.params;

    const bufferData = await fsPromises.readFile('./models/contacts.json');
    const updatedContactList = JSON.parse(bufferData).filter(
      (item) => item.id !== id
    );

    await fsPromises.writeFile(
      './models/contacts.json',
      JSON.stringify(updatedContactList)
    );

    res.status(200).json({ message: 'contact deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateContact = async (req, res) => {
  try {
    const {
      contact,
      body: { name, email, phone },
    } = req;

    const updatedContact = { ...contact };
    if (name) updatedContact.name = name;
    if (email) updatedContact.email = email;
    if (phone) updatedContact.phone = phone;

    const bufferData = await fsPromises.readFile('./models/contacts.json');
    const updatedContactList = JSON.parse(bufferData).map((item) =>
      item.id === contact.id ? updatedContact : contact
    );

    fsPromises.writeFile(
      './models/contacts.json',
      JSON.stringify(updatedContactList)
    );
    res.status(200).send(updatedContact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addContact = async (req, res) => {
  try {
    const { body } = req;
    const bufferData = await fsPromises.readFile('./models/contacts.json');
    const updatedContactList = JSON.parse(bufferData);

    body.id = shortid.generate();

    updatedContactList.push(body);

    await fsPromises.writeFile(
      './models/contacts.json',
      JSON.stringify(updatedContactList)
    );

    res.status(201).send(body);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
