// const siteRouter = require('./siteRouter')
const express = require('express')
const router = express.Router()
const homeController = require('../controllers/homeController')

// function setupRouter(app) {
// 	app.use('/', siteRouter)
// }
router.get('/sign_in', (req, res) => {
	res.render('sign_in')
})

router.get('/sign_up', (req, res) => {
	res.render('sign_up')
})
router.get('/', homeController.getHomePage)

module.exports = router