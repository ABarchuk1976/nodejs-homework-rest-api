const contactValidators = require('../utils/contactValidators');

const Contact = require('../models/contactsModels');

exports.checkContactData = (req, res, next) => {
  const errorValidation = contactValidators.contactValidator(req.body).error;
  if (errorValidation) {
    const fieldName = errorValidation.details[0].context.key;

    return res
      .status(400)
      .json({ message: `missing required '${fieldName}' field` });
  }

  next();
};

exports.checkContactBody = (req, res, next) => {
  if (!Object.keys(req.body).length) {
    return res.status(400).json({ message: 'missing fields' });
  }

  next();
};

exports.checkContactId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contact = Contact.findById(id);

    if (contact) {
      req.contact = contact;
      return next();
    }

    return res.status(404).json({ message: 'Not found' });
  } catch (err) {
    next(err);
  }
};

exports.checkContactFavorite = async (req, res, next) => {
  const { body } = req;
  const errorValidation =
    contactValidators.contactFavoriteValidator(body).error;

  if (errorValidation || !body.length) {
    return res.status(400).json({ message: 'missing field favorite' });
  }

  next();
};
