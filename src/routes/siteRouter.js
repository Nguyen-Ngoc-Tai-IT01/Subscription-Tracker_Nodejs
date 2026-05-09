const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const homeController = require('../controllers/homeController');
const upload = require('../helpers/multer_helper');

// Trang chủ
router.get("/", homeController.displayService);

// Thêm dịch vụ
router.get("/add-service", (req, res) => res.render("add-service"));
router.post('/add-service', upload.single('QRCode'), serviceController.createService);

// Thanh toán và Xóa
router.post('/service/pay/:id', serviceController.payService);
router.delete('/service/:id', serviceController.deleteService);

// Thông báo
router.get("/notification", (req, res) => res.render("notification"));

module.exports = router; // Đóng gói mang ra ngoài

// Xem chi tiết một dịch vụ dựa trên ID
router.get('/service/:id', serviceController.getServiceDetail);
router.put('/service/edit/:id', serviceController.updateService);