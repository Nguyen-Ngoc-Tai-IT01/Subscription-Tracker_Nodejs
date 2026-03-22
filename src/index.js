require('dotenv').config(); 
const express = require('express');
const path = require('path');
const session = require('express-session');
const morgan = require('morgan');
const indexouter = require('./routes/index');
const connectDB = require('./config/db');

const app = express(); // khởi tạo

// kết nối database
connectDB();

// cấu hình view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middleware cơ bản
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// cấu hình session
app.use(session({
    secret: 'ma-hoa-123',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        secure: false
    }
}));

// middleware để truyền biến user vào tất cả file EJS
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});


// routes
app.use('/', indexouter);

module.exports = app;