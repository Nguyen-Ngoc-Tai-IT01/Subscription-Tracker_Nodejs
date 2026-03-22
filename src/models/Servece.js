const { required } = require('joi')
const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
	// lưu ID người tạo ra
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	serviceName: {
		type: String,
		required: true,
		trim: true
	},
	price: {
		type: Number,
		require: true,
		trim: true
	},
	billingCycle: {
		type: String,
		required: true,
		enum: ['monthly', 'yearly'],
		default: 'monthly'
	},
	nextPaymentDate: {
		type: Date,
		required: true
	},
	QRCode:{
		type: String,
		default: ''
	},
	status:{
		type: String,
		required: true,
		enum: ['paid', 'unpaid'],
		default: 'unpaid'
	}

}, {
	timestamps: true
})

module.exports = mongoose.model('Service', serviceSchema)
