const fsPromises = require('fs').promises;
const path = require('path');

const CONTACTS_PATH = path.join(__dirname, 'contacts.json');

const listContacts = async () => {
	
	const buffer = await fsPromises.readFile(CONTACTS_PATH,'utf-8');
	const contacts = JSON.parse(buffer); 
	return contacts;
}

const getById = async (contactId) => {
	const contacts = await listContacts();
	
	const [contact] = contacts.filter(item => item.id === contactId);

	return contact ? {contact, status: 200} : {message: "Not found", status: 404};
}

const removeContact = async (contactId) => {}

const addContact = async (body) => {
	const contacts = await listContacts();
	contacts.push(body);
	console.log("contacts: ", contacts);

	await fsPromises.writeFile(CONTACTS_PATH, JSON.stringify(contacts));
}

const updateContact = async (contactId, body) => {}

module.exports = {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
}
