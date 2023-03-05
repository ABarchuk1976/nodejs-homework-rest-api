const express = require('express')
const dataValidator = require('../../helpers/dataValidator');
const shortid = require('shortid');

const router = express.Router()

const {
  listContacts,
  getById,
  // removeContact,
  addContact,
  // updateContact,
} = require('../../models/contacts')

router.get('/', async (req, res, next) => {
	const contacts = await listContacts();
  res.json({ status: 200, contacts })
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
	
	console.log('req.body: ', req.body);

	if (!dataValidator(req.body)) {
		res.json({status: 400, message: "missing required name field"});
		return;
	}
	const id = shortid.generate();
	const body = {id, ...req.body};
	addContact(body);

  res.json({status: 201, body})
})

router.delete('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

router.put('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

module.exports = router
