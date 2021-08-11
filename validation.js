const Joi = require('@hapi/joi');

//Register Validation
const registerValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().min(7).required().email(),
        password: Joi.string().min(6).required()
    });

    return schema.validate(data);

    // const { error } = schema.validate(req.body);
    // if (error) return res.status(400).send(error.details[0].message)
};

module.exports.registerValidation = registerValidation;

//Login Validation
const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(7).required().email(),
        password: Joi.string().min(6).required()
    });

    return schema.validate(data);
};

module.exports.loginValidation = loginValidation;