# Supplier & Product Management (MVC CRUD + Auth)
📌 Giới thiệu
Dự án này xây dựng ứng dụng quản lý **Nhà cung cấp (Supplier)** và **Sản phẩm (Product)** theo mô hình **MVC**.  
Ứng dụng hỗ trợ:
- Quản lý CRUD nhà cung cấp (tên, địa chỉ, số điện thoại).
- Quản lý CRUD sản phẩm (tên, giá, số lượng, tham chiếu đến nhà cung cấp).
- Chức năng tìm kiếm sản phẩm theo tên.
- Lọc sản phẩm theo nhà cung cấp.
- Xác thực người dùng (Đăng ký, Đăng nhập, Đăng xuất, Quên mật khẩu) bằng **cookie & session**.
- Chỉ cho phép thao tác CRUD khi đã đăng nhập.
- Giao diện sử dụng **Bootstrap 5**.
- API mô tả bằng **Swagger UI**.

⚙️ Công nghệ sử dụng
- [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/)
- [EJS](https://ejs.co/) làm view engine
- [Bootstrap 5](https://getbootstrap.com/) cho giao diện
- [Swagger UI](https://swagger.io/tools/swagger-ui/) mô tả API
- Session + Cookie để xác thực

🚀 Cài đặt & chạy thử
1. Clone repository
git clone https://github.com/hoangmkid12/22633181_BTH05_CRUD.git
cd 22633181_BTH05_CRUD

2. Cài đặt dependencies
npm install

3. Tạo file cấu hình môi trường .env
Trong thư mục gốc, tạo file .env với nội dung:
MONGO_URI=mongodb://127.0.0.1:27017/lab01_crud
SESSION_SECRET=your-secret-key
PORT=3000

4. Chạy ứng dụng
npm run dev
Mặc định server chạy tại: http://localhost:3000

🔑 Chức năng chính
Trang chủ: Danh sách sản phẩm + tìm kiếm + lọc theo nhà cung cấp.
Đăng ký / Đăng nhập / Đăng xuất / Quên mật khẩu.
CRUD Nhà cung cấp.
CRUD Sản phẩm.
Swagger API Docs: http://localhost:3000/api-docs

👨‍💻 Tác giả
Họ tên: Hoàng Mỹ
MSSV: 22633181
