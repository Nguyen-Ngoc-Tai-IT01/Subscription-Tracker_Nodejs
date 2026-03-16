const http = require('http')
const app = require('../index')
const POST = 3000

const server = http.createServer(app)

server.listen(POST, () => {
	console.log(`Server đã khởi chạy thành công!`)
	console.log(`Server is running on http://localhost:${POST}`)
})
