const Service = require("../models/Service");
const fs = require("fs");
const path = require("path");

// gọi service
const paymentService = require("../services/paymentService");
const deleteService = require('../services/deleteService');


exports.createService = async (req, res) => {
  const { serviceName, price, billingCycle, nextPaymentDate, status } = req.body;

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


exports.getServiceDetail = async (req, res) => {
    try {
        const serviceId = req.params.id;
        const service = await Service.findById(serviceId);

        if (!service) {
            return res.status(404).send("Không tìm thấy dịch vụ này!");
        }

        res.render("service-detail", {
            user: req.session.user,
            service: service
        });
    } catch (error) {
        console.log("Lỗi xem chi tiết: ", error);
        res.status(500).send("Lỗi hệ thống");
    }
};


exports.updateService = async (req, res) => {
    try {
        const serviceId = req.params.id;
        const { serviceName, price } = req.body;
        const updatedService = await Service.findByIdAndUpdate(
            serviceId, 
            { serviceName: serviceName, price: price }, 
            { new: true } 
        );

        if (!updatedService) {
            return res.status(404).json({ message: 'Không tìm thấy dịch vụ để cập nhật.' });
        }

        console.log(`Đã cập nhật thành công: ${updatedService.serviceName}`);
        res.status(200).json({ message: 'Cập nhật thành công' });
    } catch (error) {
        console.log("Lỗi khi cập nhật dịch vụ: ", error);
        res.status(500).json({ message: "Lỗi server khi cập nhật" });
    }
};


exports.payService = async (req, res) => {
  try {
    const serviceId = req.params.id;
    await paymentService.processPayment(serviceId);
    res.status(200).json({ message: "Thành công" });
  } catch (error) {
    console.log("Lỗi khi gia hạn: ", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};


exports.deleteService = async (req, res) => {
  try {
    const serviceId = req.params.id;
    await deleteService.processDelete(serviceId);
    res.status(200).json({ message: "Xóa thành công" });
  } catch (error) {
    console.log("Lỗi khi xóa dịch vụ: ", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};