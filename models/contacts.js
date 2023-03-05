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

const removeContact = async (contactId) => {
	const contacts = await listContacts();

	const needDelete = contacts.some(contact => contact.id === contactId);

	if (needDelete) {
		const deletedContacts = contacts.filter(contact => contact.id !== contactId);
		await fsPromises.writeFile(CONTACTS_PATH, JSON.stringify(deletedContacts));
	};

	const res = needDelete ? {status: 200, message: "contact deleted"} : {status: 404, message: "Not found"};

	return res;
}

const addContact = async (body) => {
	const contacts = await listContacts();
	contacts.push(body);
	console.log("contacts: ", contacts);

	await fsPromises.writeFile(CONTACTS_PATH, JSON.stringify(contacts));
}

const updateContact = async (contactId, body) => {
	const res = await getById(contactId);

	if (res.status === 404) {
		return res;
	};

	res.contact = {...body};

	const {name, email, phone} = res.contact;

	const contacts = await listContacts();

	const contactsUpdated = contacts.map(contact => contact.id === contactId ? {...contact, name, email, phone} : contact);

	fsPromises.writeFile(CONTACTS_PATH, JSON.stringify(contactsUpdated));
	
	return res;
}

module.exports = {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
}
