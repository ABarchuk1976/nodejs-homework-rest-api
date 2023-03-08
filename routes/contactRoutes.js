const express = require('express');
const router = express.Router();

const contactControllers = require('../controllers/contactControllers');
const contactMiddlewares = require('../middlewares/contactMiddlewares');

router
  .route('/')
  .get(contactControllers.listContacts)
  .post(contactMiddlewares.checkContactData, contactControllers.addContact);

router.use('/:id', contactMiddlewares.checkContactId);

router
  .route('/:id')
  .get(contactControllers.getById)
  .put(contactMiddlewares.checkContactBody, contactControllers.updateContact)
  .delete(contactControllers.removeContact);

module.exports = router;
