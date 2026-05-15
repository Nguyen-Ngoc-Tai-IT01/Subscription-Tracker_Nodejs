const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

const authMiddleware = require('../middlewares/auth'); 

// đn
router.get("/sign_in", (req, res) => res.render("sign_in"));
// đk
router.get("/sign_up", (req, res) => res.render("sign_up"));

// Xử lý gửi form đn 
router.post("/sign_in", userController.loginUser);
// đk
router.post("/sign_up", userController.createUser);

// hồ sơ
router.get("/profile", authMiddleware.requireLogin, (req, res) => res.render("profile"));

// dăng xuất
router.post('/logout', authMiddleware.requireLogin, userController.logoutUser);

// cập nhập hồ sơ
router.put("/api/profile", authMiddleware.requireLogin, userController.updateProfile);


module.exports = router;