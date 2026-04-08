const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Đăng nhập
router.get("/sign_in", (req, res) => res.render("sign_in"));
router.post("/sign_in", userController.loginUser);

// Đăng ký
router.get("/sign_up", (req, res) => res.render("sign_up"));
router.post("/sign_up", userController.createUser);

// Đăng xuất
router.post('/logout', userController.logoutUser);

// Hồ sơ cá nhân
router.get("/profile", (req, res) => res.render("profile"));
router.post("/profile/edit", userController.updateProfile);

module.exports = router; // Đóng gói mang ra ngoài