const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const homeController = require('../controllers/homeController');
const upload = require('../helpers/multer_helper');
const authMiddleware = require('../middlewares/auth');

// trang chủ

router.get("/", homeController.getHomePage); 

// dịch vụ
router.get("/add-service", authMiddleware.requireLogin, (req, res) => res.render("add-service"));

// chi tiết một dv
router.get('/service/:id', authMiddleware.requireLogin, serviceController.getServiceDetail);

// sửa lý dữ liệu

// tạo mới dv
router.post('/api/service', authMiddleware.requireLogin, upload.single('QRCode'), serviceController.createService);

// Cập nhật dịch vụ
router.put('/api/service/:id', authMiddleware.requireLogin, serviceController.updateService);

// Thanh toán dịch vụ
router.put('/api/service/pay/:id', authMiddleware.requireLogin, serviceController.payService);

// Xóa dịch vụ
router.delete('/api/service/:id', authMiddleware.requireLogin, serviceController.deleteService);


module.exports = router;