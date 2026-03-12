const mongoose = require('mongoose')

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGODB_URI)
		console.log(`MongoBD đã kết nối thành công: ${conn.connection.host}`)
	} catch (error) {
		console.log(`Lỗi kết nối MongoDB: ${error.message}`)
		process.exit(1)
	}
}

module.exports = connectDB