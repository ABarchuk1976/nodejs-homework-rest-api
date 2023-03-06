const express = require('express');
const dataValidator = require('../../helpers/dataValidator');
const shortid = require('shortid');

const router = express.Router();

const {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
} = require('../../models/contacts');

router.get('/', async (req, res, next) => {
	const contacts = await listContacts();
  res.status(200).json({ contacts })
})

router.get('/:id', async (req, res, next) => {
	const {id} = req.params;

	const data = await getById(id);

	const {status} = data;

	if (status === 200) {
		const {contact} = data;
		res.json({status, contact})
	} 
	else {
		const {message} = data;
		res.json({status, message})
	}
})

router.post('/', async (req, res, next) => {

	if (!dataValidator(req.body)) {
		res.status(400).json({message: "missing required name field"});
		return;
	}
	const id = shortid.generate();
	const body = {id, ...req.body};
	addContact(body);

  res.status(201).send({...body});
})

router.delete('/:id', async (req, res, next) => {
	const {id} = req.params;

	const data = await removeContact(id);

	const {status, message} = data;

	res.json({status, message});
})

router.put('/:id', async (req, res, next) => {
	const {id} = req.params;
	const {body} = req;
  if (!dataValidator(body)) {
		res.status(400).json({ message: "missing fields"});
		return;
	}

	const data = await updateContact(id, body);

	const {status} = data;

	if (status === 200) {
		const {contact} = data;
		res.status(200).send(contact)
	} 
	else {
		const {message} = data;
		res.status(404).json({ message})
	}
})

module.exports = router;
