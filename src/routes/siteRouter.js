const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const homeController = require('../controllers/homeController');
const upload = require('../helpers/multer_helper');



router.get("/", homeController.getHomePage); 

// trang + dv
router.get("/add-service", (req, res) => res.render("add-service"));

// xem chi tiết
router.get('/service/:id', serviceController.getServiceDetail);

// xửa lý dữ liệu

// tạo mới dv
router.post('/api/service', upload.single('QRCode'), serviceController.createService);

// cập nhập dv
router.put('/api/service/:id', serviceController.updateService);

// pay dv
router.put('/api/service/pay/:id', serviceController.payService);

// xóa dv
router.delete('/api/service/:id', serviceController.deleteService);

// đóng gói
module.exports = router;