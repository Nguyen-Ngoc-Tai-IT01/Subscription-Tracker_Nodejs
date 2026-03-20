// const siteRouter = require('./siteRouter')
const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");

// function setupRouter(app) {
// 	app.use('/', siteRouter)
// }

// I

const userController = require("../controllers/userController");
const serviceController = require("../controllers/serviceController")

// 1. đăng nhập
router.get("/sign_in", (req, res) => {
  res.render("sign_in");
});
router.post("/sign_in", userController.loginUser);

// 2. đăng ký

router.get("/sign_up", (req, res) => {
  res.render("sign_up");
});

router.post("/sign_up", userController.createUser);

// dịch vụ mới
router.get("/add-service", (req, res) => {
  res.render("add-service");
});

router.post("/add-service", serviceController.createService);

// thông báo
router.get("/notification", (req, res) => {
  res.render("notification");
});

// thông tin cá nhân
router.get("/profile", (req, res) => {
  res.render("profile");
});
router.post("/profile/edit", userController.updateProfile);

router.get("/", serviceController.displayService);

module.exports = router;
