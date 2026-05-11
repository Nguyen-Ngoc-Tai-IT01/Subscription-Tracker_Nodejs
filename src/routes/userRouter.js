const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");


// đn
router.get("/sign_in", (req, res) => res.render("sign_in"));

// đk
router.get("/sign_up", (req, res) => res.render("sign_up"));

router.get("/profile", (req, res) => res.render("profile"));


// sửa lý đn, đk
router.post("/sign_in", userController.loginUser);
router.post("/sign_up", userController.createUser);

// đăng xuất
router.post('/logout', userController.logoutUser);

// cập nhập hồ sơ
router.put("/api/profile", userController.updateProfile);

// đóng gói
module.exports = router;