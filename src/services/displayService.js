const Service = require("../models/Servece"); 

exports.processDisplay = async (userId, searchQuery, page, limit) => {
  // Lấy toàn bộ để tính thẻ thống kê
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

  // Tìm kiếm và phân trang
  let queryFilter = { userId: userId };
  if (searchQuery) {
    queryFilter.serviceName = { $regex: searchQuery, $options: "i" };
  }

  const totalMatching = await Service.countDocuments(queryFilter);
  const myService = await Service.find(queryFilter)
    .sort({ createdAt: -1 })
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