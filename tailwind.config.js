/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/views/**/*.ejs", // Quét toàn bộ file EJS trong thư mục views
    "./src/public/javascripts/**/*.js" // Quét cả file JS phía client nếu có dùng class
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}