const Joi = require('joi');

exports.contactValidator = (data) =>
  Joi.object()
    .keys({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
      phone: Joi.string().required(),
    })
    .validate(data);

exports.contactFavoriteValidator = (favorite) => {
  Joi.object()
    .keys({
      favorite: Joi.boolean.allow(true, false),
    })
    .validate(favorite);
};
