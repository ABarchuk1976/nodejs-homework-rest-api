const Joi = require('joi');

const dataValidator = (data) => {

	const schema = Joi.object({
		name: Joi.string().min(3).max(30).required(),
		email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
		phone: Joi.string().required(),
	});

	return schema.validate(data)
}

module.exports = dataValidator;

