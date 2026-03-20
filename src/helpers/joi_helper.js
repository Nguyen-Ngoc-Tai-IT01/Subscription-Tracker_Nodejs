const joi = require('joi')
const mongoose = require('mongoose')
// đăng kí
// const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/;
// const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const user_add = joi.object({
    username: joi.string().alphanum().min(3).max(100).required(),
    email: joi.string().min(3).max(100).required(),
    password: joi.string().min(3).max(100).required(),
    phone: joi.string().pattern(/^[0-9]+$/).min(10).max(15).allow('').optional(),
    birthDate: joi.date().allow('').optional()
})
const service_add = joi.object({
	serviceName: joi.string().required().min(0).max(100),
	price: joi.number().integer().required(),
	billingCycle: joi.string().min(0).max(100).required(),
	nextPaymentDate: joi.date().required(),
	image: joi.string(),
	status: joi.string().required()
	
})


module.exports = {
	user_add,
	service_add
}