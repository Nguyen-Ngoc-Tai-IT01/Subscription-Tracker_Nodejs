const express = require("express");

const router = express.Router();

// đn, đk, hs
const userRouter = require('./userRouter');

// trang chủ làm vc với dv
const siteRouter = require('./siteRouter');


// xửa lý khi vào link đn, đk
router.use('/', userRouter);

// sẽ sử lý khi vào link dv
router.use('/', siteRouter);


module.exports = router;