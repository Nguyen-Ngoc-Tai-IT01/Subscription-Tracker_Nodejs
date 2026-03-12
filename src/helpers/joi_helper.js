const joi = require('joi')

const service_add = joi.object({
	name: joi.string().require().min(0).max(100),
	price: joi.number().integer(),
	cycle: joi.string().min(0).max(100),
	payment_date: joi.date()
})

module.exports = {
	service_add
}