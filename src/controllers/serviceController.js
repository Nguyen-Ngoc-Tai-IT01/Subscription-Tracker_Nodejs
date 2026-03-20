const Service = require('../models/Servece')

// tạo mới 
exports.createService = async (req, res) => {
	const {serviceName, price, billingCycle, nextPaymentDate} = req.body

	try {
		const newService = new Service({
			userId: req.session.user.id,
			serviceName: serviceName,
			price: price,
			billingCycle: billingCycle,
			nextPaymentDate: nextPaymentDate
		})

		// lưu dữ liệu
		await newService.save()

		console.log("Saved successfully", newService)

		res.redirect("/")
	} catch (error) {
		console.log("Error: ", error)
		res.render("add-service", {
			errorMessage: "Thêm mới dịch vụ thất bại, vui lòng kiểm tra thông tin",
			oldServiceName: serviceName,
		})
	}
}

// hiển thị dịch vụ đã lưu
exports.displayService = async (req, res) => {
    try {
        // nếu chưa đăng nhập gọi file home
        if (!req.session || !req.session.user) {
            return res.render('home'); 
        }

        // nếu đăng nhập rồi thì lấy Id và tìm dịch vụ
        const userId = req.session.user.id;
        const myService = await Service.find({ userId: userId }).sort({ createdAt: -1 });

        res.render('home', {
            user: req.session.user,
            services: myService
        });

    } catch (error) {
        console.log("Lỗi tải trang chủ: ", error);
        res.status(500).send("Đã xảy ra lỗi khi tải dữ liệu");
    }
}