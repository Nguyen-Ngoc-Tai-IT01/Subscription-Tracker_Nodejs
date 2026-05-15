const Service = require("../models/Service"); 

exports.processDisplay = async (userId, searchQuery, page, limit) => {
  // lấy toàn bộ để tính thẻ thống kê
  const allServices = await Service.find({ userId: userId });

  const globalTotalExpense = allServices.reduce((sum, item) => sum + item.price, 0);
  const totalServices = allServices.length;

  const next3Days = new Date();
  next3Days.setHours(0, 0, 0, 0);
  next3Days.setDate(next3Days.getDate() + 3);

  const expiringCount = allServices.filter((item) =>
      item.status === "unpaid" &&
      item.nextPaymentDate &&
      new Date(item.nextPaymentDate) <= next3Days
  ).length;

  // tìm kiếm và phân trang
  let queryFilter = { userId: userId };
  if (searchQuery) {
    queryFilter.serviceName = { $regex: searchQuery, $options: "i" };
  }

  const totalMatching = await Service.countDocuments(queryFilter);

  // sắp xếp các gói
  const myService = await Service.find(queryFilter)
    .sort({ 
        status: -1,           // ưu tiên chưa thanh toán lên hàng đầu
        nextPaymentDate: 1,   // ưu tiên hạn thanh toán
        createdAt: -1         // nếu trùng đk gói nào tạo ra sau đưa lên trước
    })
    .skip((page - 1) * limit)
    .limit(limit);

  // đóng gói dữ liệu 
  return {
    services: myService,
    totalMatching: totalMatching,
    globalTotalExpense: globalTotalExpense,
    totalServices: totalServices,
    expiringCount: expiringCount,
  };
};