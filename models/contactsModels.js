const fsPromises = require('fs').promises;
const path = require('path');
const shortid = require('shortid');

const contactsPath = path.join(__dirname, '', 'contacts.json');

exports.listContacts = async () => {
  try {
    const bufferData = await fsPromises.readFile(contactsPath);
    const contacts = JSON.parse(bufferData);

    return contacts;
  } catch (error) {
    console.log(error);
  }
};

exports.removeContact = async (contactID) => {
  try {
    const bufferData = await fsPromises.readFile(contactsPath);
    const updatedContactList = JSON.parse(bufferData).filter(
      (item) => item.id !== String(contactID)
    );

    await fsPromises.writeFile(
      contactsPath,
      JSON.stringify(updatedContactList)
    );
  } catch (error) {
    console.log(error);
  }
};

exports.updateContact = async (contactId, body) => {
  try {
    const { name, email, phone } = body;

    const bufferData = await fsPromises.readFile(contactsPath);
    const contacts = JSON.parse(bufferData);

    const updatedContact = contacts.find((item) => item.id === contactId);
    if (name) updatedContact.name = name;
    if (email) updatedContact.email = email;
    if (phone) updatedContact.phone = phone;

    const updatedContactList = contacts.map((item) => {
      return item.id === contactId ? updatedContact : item;
    });

    await fsPromises.writeFile(
      contactsPath,
      JSON.stringify(updatedContactList)
    );

    return updatedContact;
  } catch (error) {
    console.log(error);
  }
};

exports.addContact = async (body) => {
  try {
    const bufferData = await fsPromises.readFile(contactsPath);
    const contacts = JSON.parse(bufferData);

    body.id = shortid.generate();

    const updatedContactList = [body, ...contacts];

    await fsPromises.writeFile(
      contactsPath,
      JSON.stringify(updatedContactList)
    );

    return body;
  } catch (error) {
    console.log(error);
  }
};
