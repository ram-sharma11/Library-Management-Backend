const joi = require('joi');

module.exports.registerValidations = joi.object({
    email : joi.string().required().email(),
    name : joi.string().min(3).max(20).required(),
    phone: joi.number().integer().min(9),
    password: joi.string().min(6).required(),
    role :joi.string()

})

module.exports.loginValidations = joi.object({
    email : joi.string().required().email(),
    password : joi.string().required().min(6)
})

