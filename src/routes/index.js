const express = require("express");
const router = express.Router();

const userRouter = require('./userRouter');
const siteRouter = require('./siteRouter');

// Bất cứ link nào khách gõ, đưa cho cả 2 xem, ai xử lý được thì xử lý
router.use('/', userRouter);
router.use('/', siteRouter);

module.exports = router;