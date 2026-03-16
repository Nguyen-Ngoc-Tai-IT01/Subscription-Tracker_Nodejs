const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // Đảm bảo không ai đăng ký trùng email
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6 // Mật khẩu ít nhất 6 ký tự
    }
}, {
    timestamps: true // Tự động ghi lại ngày giờ tạo tài khoản
});

module.exports = mongoose.model('User', userSchema);