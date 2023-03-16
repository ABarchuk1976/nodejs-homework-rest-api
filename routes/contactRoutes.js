const express = require('express');

const router = express.Router();

const contactControllers = require('../controllers/contactControllers');
const contactMiddlewares = require('../middlewares/contactMiddlewares');

router
  .route('/')
  .get(contactControllers.listContactsController)
  .post(
    contactMiddlewares.checkContactData,
    contactControllers.addContactController
  );

router.use('/:id', contactMiddlewares.checkContactId);

router
  .route('/:id')
  .get(contactControllers.getByIdController)
  .put(
    contactMiddlewares.checkContactBody,
    contactControllers.updateContactController
  )
  .delete(contactControllers.removeContactController);

router
  .route('/:id/favorite')
  .put(
    contactMiddlewares.checkContactFavorite,
    contactControllers.updateStatusContactController
  );

module.exports = router;
