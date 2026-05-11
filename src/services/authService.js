const User = require("../models/User");
const bcrypt = require("bcrypt");

// đăng ký
exports.processRegister = async (username, email, password) => {
	// ktra email
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
        throw new Error("EMAIL_EXIST"); 
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    
    const newUser = new User({
        username: username,
        email: email,
        password: hashedPassword, 
    });

    await newUser.save();
    return newUser; 
};

// đăng nhập
exports.processLogin = async (email, password) => {

    const user = await User.findOne({ email: email });
    if (!user) {
        throw new Error("USER_NOT_FOUND");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("WRONG_PASSWORD");
    }

    return user; 
};