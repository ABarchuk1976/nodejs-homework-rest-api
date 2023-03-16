const contactValidators = require('../utils/contactValidators');
const contactsModels = require('./contactsModels');

exports.checkContactData = (req, res, next) => {
  const { body } = req;

  const errorValidation = contactValidators.contactValidator(body).error;
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
  const { id } = req.params;

  const exist = await contactsModels.isExist(id);

  if (exist) {
    return next();
  }

  return res.status(404).json({ message: 'Not found' });
};

exports.checkContactFavorite = (req, res, next) => {
  const { body } = req;

  const errorValidation =
    contactValidators.contactFavoriteValidator(body).error;

  if (errorValidation || !Object.keys(body).length) {
    return res.status(400).json({ message: 'missing field favorite' });
  }

  next();
};
