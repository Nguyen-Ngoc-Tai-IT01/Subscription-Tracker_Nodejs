const Service = require("../models/Servece");
const fs = require("fs");
const path = require("path");

// gọi service
const paymentService = require("../services/paymentService");
const deleteService = require('../services/deleteService')

// tạo mới
exports.createService = async (req, res) => {
  const { serviceName, price, billingCycle, nextPaymentDate, status } =
    req.body;

  try {
    // lấy tên file từ multer
    let finalQRCode = "";
    if (req.file) {
      finalQRCode = req.file.filename;
    }

    const newService = new Service({
      userId: req.session.user.id,
      serviceName: serviceName,
      price: price,
      billingCycle: billingCycle,
      nextPaymentDate: nextPaymentDate,
      QRCode: finalQRCode,
      status: status,
    });

    // lưu dữ liệu
    await newService.save();

    console.log("Saved successfully", newService);

    res.redirect("/");
  } catch (error) {
    console.log("Error: ", error);
    res.render("add-service", {
      errorMessage: "Thêm mới dịch vụ thất bại, vui lòng kiểm tra thông tin",
      oldServiceName: serviceName,
    });
  }
};

// hiển thị dịch vụ đã lưu
exports.displayService = async (req, res) => {
    try {
        if (!req.session || !req.session.user) {
            return res.render("home");
        }

        const userId = req.session.user.id;

        // Phân trang
        const page = parseInt(req.query.page) || 1;
        const limit = 5; 
        const skip = (page - 1) * limit;

        const allServices = await Service.find({ userId: userId });

        // Tính Tổng tiền tất cả các gói của User
        const globalTotalExpense = allServices.reduce((sum, item) => sum + item.price, 0);

        // Đếm tổng số lượng gói
        const totalServices = allServices.length;

        // Đếm tổng số gói sắp hết hạn (trên toàn bộ danh sách)
        let expiringCount = 0;
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const next3Days = new Date(today); next3Days.setDate(today.getDate() + 3);

        allServices.forEach(item => {
            if (item.status === 'unpaid' && item.nextPaymentDate) {
                const payDate = new Date(item.nextPaymentDate);
                if (payDate <= next3Days) expiringCount++;
            }
        });

        // Tính số lượng trang hiển thị
        const totalPages = Math.ceil(totalServices / limit); 

        const myService = await Service.find({ userId: userId })
            .sort({ createdAt: -1 })
            .skip(skip)   
            .limit(limit); 

        // Gửi kết quả cuối cùng ra giao diện
        res.render("home", {
            user: req.session.user,
            services: myService,           
            currentPage: page,     
            totalPages: totalPages,
            globalTotalExpense: globalTotalExpense, 
            totalServices: totalServices,           
            expiringCount: expiringCount           
        });
    } catch (error) {
        console.log("Lỗi tải trang chủ: ", error);
        res.status(500).send("Đã xảy ra lỗi khi tải dữ liệu");
    }
};

// thay đổi trạng thái
exports.payService = async (req, res) => {
  try {
    const serviceId = req.params.id;
    await paymentService.processPayment(serviceId);
    //console.log(`Đã thanh toán thành công: ${service.serviceName}`)

    // trả về để F5
    res.status(200).json({ message: "Thành công" });
  } catch (error) {
    console.log("Lỗi khi gia hạn: ", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// xóa dịch vụ
exports.deleteService = async (req, res) => {
  try {
    const serviceId = req.params.id;
    await deleteService.processDelete(serviceId)

    res.status(200).json({ message: "Xóa thành công" });
  } catch (error) {
    console.log("Lỗi khi xóa dịch vụ: ", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
