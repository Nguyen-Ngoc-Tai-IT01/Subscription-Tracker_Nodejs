const displayService = require('../services/displayService');

exports.getHomePage = async (req, res) => {
    try {
        if (!req.session || !req.session.user) {
            return res.render("introduce"); 
        }

        // đã đn
        const userId = req.session.user.id;
        const searchQuery = req.query.search || "";
        const page = parseInt(req.query.page) || 1;
        const limit = 5;

        // lấy dữ liệu
        const data = await displayService.processDisplay(userId, searchQuery, page, limit);

        // trả kq
        res.render("home", {
            user: req.session.user,
            searchQuery: searchQuery,
            currentPage: page,
            totalPages: Math.ceil(data.totalMatching / limit),
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