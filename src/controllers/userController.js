const User = require("../models/User");
const authService = require("../services/authService"); 
// đk
exports.createUser = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/;

  if (!passwordRegex.test(password)) {
    return res.render("sign_up", {
      errorMessage: "Mật khẩu phải từ 8-30 ký tự, bao gồm ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt.",
      oldUsername: username, oldEmail: email,
    });
  }
  if (password !== confirmPassword) {
    return res.render("sign_up", {
      errorMessage: "Mật khẩu xác nhận không khớp.",
      oldUsername: username, oldEmail: email,
    });
  }

  // phần auth service
  try {
    const newUser = await authService.processRegister(username, email, password);
    console.log("Tạo tài khoản thành công:", newUser.username);
    res.redirect("/sign_in");
  } catch (error) {
    // bắt lỗi
    if (error.message === "EMAIL_EXIST") {
        return res.render("sign_up", {
            errorMessage: "Email này đã tồn tại trong hệ thống!",
            oldUsername: username, oldEmail: email,
        });
    }
    console.log("Lỗi hệ thống:", error);
    res.render("sign_up", { errorMessage: "Đăng ký thất bại!", oldUsername: username, oldEmail: email });
  }
};

// đn
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {

	const user = await authService.processLogin(email, password);

    // lấy thẻ session
    req.session.user = {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        phone: user.phone,
        birthDate: user.birthDate
    }

    console.log("Đăng nhập thành công.", user.username);
    res.redirect("/");

  } catch (error) {
	//bắt lỗi
    let message = "Lỗi hệ thống, vui lòng thử lại sau!";
    if (error.message === "USER_NOT_FOUND") message = "Email chưa được đăng ký!";
    if (error.message === "WRONG_PASSWORD") message = "Mật khẩu không chính xác!";

    res.render("sign_in", { errorMessage: message, oldEmail: email });
  }
};

// cập nhật 
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.session.user.id; 
        const { username, phone, birthDate } = req.body; // Dữ liệu từ form

        // cập nhập vào mongoDB
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, phone, birthDate },
            { new: true } 
        );

        req.session.user.username = updatedUser.username;
        req.session.user.phone = updatedUser.phone;
        req.session.user.birthDate = updatedUser.birthDate;

        req.session.save((err) => {
            if (err) {
                console.error("Lỗi lưu session:", err);
                return res.status(500).json({ message: "Lỗi đồng bộ dữ liệu" });
            }
            
            return res.status(200).json({ message: "Cập nhật thành công!" });
        });

    } catch (error) {
        console.log("Lỗi cập nhật hồ sơ:", error);
        res.status(500).json({ message: "Lỗi hệ thống!" });
    }
};
// đăng xuất
exports.logoutUser = (req, res) => {
	// hủy session hiện tại
	req.session.destroy((err) => {
		if(err){
			console.log("Lỗi khi đăng xuất, ", err)
			return res.redirect("/")
		}

		res.clearCookie('connect.sid')

		res.redirect('/')
	})
}