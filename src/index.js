const express = require('express')
const http = require('http')
const path = require('path')

const morgan = require('morgan')
require('dotenv').config()

const indexouter  = require('./routes/index')
const connectDB = require('./config/db')

const app = express()

connectDB()

app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, 'public')))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/', indexouter)

module.exports = app