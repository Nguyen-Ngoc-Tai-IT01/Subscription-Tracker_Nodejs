const http = require('http')
const app = require('../index')
const PORT = 3000

const server = http.createServer(app)

server.listen(PORT, () => {
	console.log(`Server đã khởi chạy thành công!`)
	console.log(`Server is running on http://localhost:${PORT}`)
})
