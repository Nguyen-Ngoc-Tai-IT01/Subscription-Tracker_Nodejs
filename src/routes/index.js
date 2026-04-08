const express = require("express");
const router = express.Router();

// 1. Tuyển dụng 2 Lễ tân phụ
const userRouter = require('./userRouter');
const siteRouter = require('./siteRouter');

// 2. Phân luồng công việc
// Bất cứ link nào khách gõ, đưa cho cả 2 xem, ai xử lý được thì xử lý
router.use('/', userRouter);
router.use('/', siteRouter);

module.exports = router;