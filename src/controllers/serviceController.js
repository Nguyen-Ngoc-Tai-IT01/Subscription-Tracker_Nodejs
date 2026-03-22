const Service = require('../models/Servece')
const fs = require('fs')
const path = require('path')

// tạo mới 
exports.createService = async (req, res) => {
	const {serviceName, price, billingCycle, nextPaymentDate, status} = req.body

	try {
		// lấy tên file từ multer
		let finalQRCode = ""
		if(req.file){
			finalQRCode = req.file.filename
		}

		const newService = new Service({
			userId: req.session.user.id,
			serviceName: serviceName,
			price: price,
			billingCycle: billingCycle,
			nextPaymentDate: nextPaymentDate,
			QRCode: finalQRCode,
			status: status
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

// thay đổi trạng thái
exports.payService = async (req,res) => {
	try {
		const serviceId = req.params.id
		const service = await Service.findById(serviceId)

		if(!service){
			return res.status(404).json({message: 'Không tìm thấy dịch vụ.'})
		}

		// đổi trạng  thái
		service.status = 'paid'
		// sau khi đã thanh toán chu kì này xong tự động cộng thêm ngày cho chu kì kế  tiếp
		const currentNextDate = new Date(service.nextPaymentDate)
		if(service.billingCycle === 'monthly'){
			currentNextDate.setMonth(currentNextDate.getMonth() + 1)
		}else if(service.billingCycle === 'yearly'){
			currentNextDate.setFullYear(currentNextDate.getFullYear() + 1)
		}

		service.nextPaymentDate = currentNextDate

		await service.save()
		console.log(`Đã thanh toán thành công: ${service.serviceName}`)
		
		// trả về để F5
		res.status(200).json({message: 'Thành công'})
	} catch (error) {
		console.log("Lỗi khi gia hạn: ", error);
        res.status(500).json({ message: "Lỗi server" });
	}
}

// xóa dịch vụ
exports.deleteService = async (req, res) => {
	try {
		const serviceId = req.params.id
		const service = await Service.findById(serviceId)
		if(!service){
			return res.status(404).json({message: 'Không tìm thấy dịch vụ'})
		}

		if(service.QRCode){
			const imagePath = path.join(__dirname, '../public/images', service.QRCode)
			if(fs.existsSync(imagePath)){
				fs.unlinkSync(imagePath)
				console.log('Đã xóa file ảnh: ', service.QRCode)
			}
		}
		await Service.findByIdAndDelete(serviceId)
		console.log('Đã xóa dịch vụ: ', service.serviceName)

		res.status(200).json({message: 'Xóa thành công'})
	} catch (error) {
		console.log("Lỗi khi xóa dịch vụ: ", error);
        res.status(500).json({ message: "Lỗi server" });
	}
}