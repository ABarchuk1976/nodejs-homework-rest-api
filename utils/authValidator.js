const Joi = require('joi');

const PASSWD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,128})/;

exports.authUserDataValidator = (data) =>
  Joi.object()
    .keys({
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
      password: Joi.string().regex(PASSWD_REGEX).required(),
    })
    .validate(data);

exports.authSubscriptionValidator = (data) =>
  Joi.object()
    .keys({
      subscription: Joi.any().valid('starter', 'pro', 'business'),
    })
    .validate(data);
