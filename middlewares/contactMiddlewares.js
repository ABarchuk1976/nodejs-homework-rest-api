const { Types } = require('mongoose');
const contactValidators = require('../utils/contactValidators');
const contactsModel = require('../models/contactsModel');

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
  const {
    params: { id },
    user,
  } = req;

  const idIsValid = Types.ObjectId.isValid(id);

  if (!idIsValid) return res.status(404).json({ message: 'Not found' });

  const userExist = await contactsModel.isExist(id);

  if (!userExist) return res.status(404).json({ message: 'Not found' });

  const contact = await contactsModel.getById(id);

  console.log('CONTACT: ', contact.owner.id, 'USER: ', user.id);

  const isOwner = user._id.toString() === contact.owner._id.toString();

  if (!isOwner) return res.status(404).json({ message: 'Not found' });

  next();
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
