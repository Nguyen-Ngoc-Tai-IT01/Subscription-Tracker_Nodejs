const User = require("../models/User");

// đăng kí
exports.createUser = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/;

  if (!passwordRegex.test(password)) {
    return res.render("sign_up", {
      errorMessage:
        "Mật khẩu phải từ 8-30 ký tự, bao gồm ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt (@$!%*?&).",
      oldUsername: username,
      oldEmail: email,
    });
  }
  if (password !== confirmPassword) {
    return res.render("sign_up", {
      errorMessage: "Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại.",
      oldUsername: username,
      oldEmail: email,
    });
  }
  try {
    const newUser = new User({
      username: username,
      email: email,
      password: password,
    });

    // lưu dữ liệu vào mongoDB
    await newUser.save();

    console.log("Saved successfully", newUser);

    res.redirect("/");
  } catch (error) {
    console.log("Error: ", error);
    res.render("sign_up", {
      errorMessage: "Đăng ký thất bại vui lòng kiểm tra lại thông tin",
      oldUsername: username,
      oldEmail: email,
    });
  }
};

// đăng nhập
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.render("sign_in", {
        errorMessage: "Email chưa được đăng ký!.",
        oldEmail: email,
      });
    }

    if (user.password !== password) {
      return res.render("sign_in", {
        errorMessage: "Mật khẩu không chính xác!",
        oldEmail: email,
      });
    }

	// dùng để lấy user name
	req.session.user = {
		id: user._id,
		username: user.username,
		email: user.email,
		phone: user.phone,
		birthDate: user.birthDate
	}

    console.log("Đăng nhập thành công.", user.username);

    res.redirect("/");
  } catch (error) {
    console.log("Error: ", error);
    res.render("sign_in", {
      errorMessage: "Lỗi hệ thống, vui lòng thử lại sau!",
      oldEmail: email,
    });
  }
};

// cập nhật 
exports.updateProfile = async (req, res) => {
	const {username, phone, birthDate} = req.body
	try {
		const userId = req.session.user.id

		await User.findByIdAndUpdate(userId, {
			username: username,
			phone: phone,
			birthDate: birthDate,
		})

		req.session.user.username = username
		req.session.user.phone = phone
		req.session.user.birthDate = birthDate

		res.redirect('/profile')
	} catch (error) {
		console.log(error);
        res.render('profile', { errorMessage: 'Không thể cập nhật hồ sơ' });
	}
}
