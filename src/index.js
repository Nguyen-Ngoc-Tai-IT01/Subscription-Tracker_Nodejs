require('dotenv').config(); // Đưa lên đầu tiên
const express = require('express');
const path = require('path');
const session = require('express-session');
const morgan = require('morgan');
const indexouter = require('./routes/index');
const connectDB = require('./config/db');

const app = express(); // KHỞI TẠO APP TRƯỚC KHI SỬ DỤNG

// Kết nối Database
connectDB();

// Cấu hình View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware cơ bản
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// CẤU HÌNH SESSION (Phải đặt sau khi khởi tạo app và trước route)
app.use(session({
    secret: 'ma-hoa-123',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        secure: false
    }
}));

// Middleware để truyền biến user vào tất cả file EJS
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Routes
app.use('/', indexouter);

module.exports = app;