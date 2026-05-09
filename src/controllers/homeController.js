const displayService = require('../services/displayService')

exports.getHomePage = (req, res) => {
	res.render('home')
}

exports.displayService = async (req, res) => {
	try {
		if (!req.session || !req.session.user) return res.render("home");
		// lấy thông tin yêu cầu
		const userId = req.session.user.id;
		const searchQuery = req.query.search || "";
		const page = parseInt(req.query.page) || 1;
		const limit = 5;

		const data = await displayService.processDisplay(userId, searchQuery, page, limit);

		res.render("home", {
			user: req.session.user,
			searchQuery: searchQuery,
			currentPage: page,
			totalPages: Math.ceil(data.totalMatching / limit),
			
			// lấy dữ liệu
			services: data.services,
			globalTotalExpense: data.globalTotalExpense,
			totalServices: data.totalServices,
			expiringCount: data.expiringCount,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send("Lỗi tải dữ liệu");
	}
};