const Service = require("../models/Servece");
const path = require('path')
const fs = require('fs')

exports.processDelete = async (serviceId) => {
  const service = await Service.findById(serviceId);
  if (!service) {
    return res.status(404).json({ message: "Không tìm thấy dịch vụ" });
  }

  if (service.QRCode) {
    const imagePath = path.join(__dirname, "../public/images", service.QRCode);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      console.log("Đã xóa file ảnh: ", service.QRCode);
    }
  }
  await Service.findByIdAndDelete(serviceId);
  console.log("Đã xóa dịch vụ: ", service.serviceName);
  return service
};
