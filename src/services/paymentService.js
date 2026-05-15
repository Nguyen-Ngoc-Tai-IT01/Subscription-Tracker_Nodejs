const Service = require("../models/Service");

exports.processPayment = async (serviceId) => {
  const service = await Service.findById(serviceId);

  if (!service) {
    return res.status(404).json({ message: "Không tìm thấy dịch vụ." });
  }
  // đổi trạng  thái
  service.status = "paid";

  // sau khi đã thanh toán chu kì này xong tự động cộng thêm ngày cho chu kì kế  tiếp
  const currentNextDate = new Date(service.nextPaymentDate);
  if (service.billingCycle === "monthly") {
    currentNextDate.setMonth(currentNextDate.getMonth() + 1);
  } else if (service.billingCycle === "yearly") {
    currentNextDate.setFullYear(currentNextDate.getFullYear() + 1);
  }

  service.nextPaymentDate = currentNextDate;

  await service.save();
  return service;
};
