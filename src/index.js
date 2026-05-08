require('dotenv').config(); 
const express = require('express');
const path = require('path');
const session = require('express-session');
const morgan = require('morgan');
const indexRouter = require('./routes/index');
const connectDB = require('./config/db');

const MongoDBStore = require('connect-mongodb-session')(session);

const app = express(); 
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

const store = new MongoDBStore({
    uri: 'mongodb://127.0.0.1:27017/subtracker_db',
    collection: 'sessions' 
});

store.on('error', function(error) {
    console.log("Lỗi kho lưu trữ Session:", error);
});
// cấu hình session
app.use(session({
    secret: 'ma-hoa-123',
    resave: false,
    saveUninitialized: true,
    store: store, 
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, 
        secure: false 
    }
}));

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

app.use('/', indexRouter);

module.exports = app;