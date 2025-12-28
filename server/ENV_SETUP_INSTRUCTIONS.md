# Hướng Dẫn Cấu Hình File .env

## 📝 Các Bước Tạo File .env

### Bước 1: Tạo file .env trong thư mục `server/`

Bạn có thể:
- **Cách 1**: Copy từ `.env.example` (nếu có) → đổi tên thành `.env`
- **Cách 2**: Tạo file mới tên `.env` trong thư mục `server/`

### Bước 2: Copy nội dung dưới đây vào file `.env`

```env
# ============================================
# ECOMMERCE WEB - ENVIRONMENT VARIABLES
# ============================================

# ============================================
# SERVER CONFIGURATION
# ============================================
PORT=8080
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:8080

# ============================================
# DATABASE CONFIGURATION
# ============================================
# MongoDB Connection URI
# Format: mongodb://username:password@host:port/database_name
# Example local: mongodb://localhost:27017/ecommerce_db
# Example Atlas: mongodb+srv://username:password@cluster.mongodb.net/database_name
MONGODB_URI=mongodb://localhost:27017/ecommerce_db

# ============================================
# JWT TOKEN SECRETS
# ============================================
# Generate strong random strings for these secrets
# You can generate using: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
SECRET_KEY_ACCESS_TOKEN=your_access_token_secret_key_here_change_this
SECRET_KEY_REFRESH_TOKEN=your_refresh_token_secret_key_here_change_this

# ============================================
# CLOUDINARY CONFIGURATION (Image Upload)
# ============================================
# Get these from: https://cloudinary.com/console
CLODINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLODINARY_API_KEY=your_cloudinary_api_key
CLODINARY_API_SECRET_KEY=your_cloudinary_api_secret

# ============================================
# EMAIL CONFIGURATION (Resend)
# ============================================
# Get API key from: https://resend.com/api-keys
RESEND_API=your_resend_api_key_here

# ============================================
# VNPAY CONFIGURATION
# ============================================
# Get these from VNPay merchant account: https://sandbox.vnpayment.vn/
# Sandbox credentials (for testing):
VNPAY_TMN_CODE=your_vnpay_tmn_code
VNPAY_SECRET_KEY=your_vnpay_secret_key
VNPAY_RETURN_URL=http://localhost:5173/check-payment
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html

# Production VNPay (uncomment when deploying):
# VNPAY_URL=https://www.vnpayment.vn/paymentv2/vpcpay.html

# ============================================
# MOMO CONFIGURATION
# ============================================
# Get these from MoMo merchant account
# Test environment credentials:
MOMO_ACCESS_KEY=your_momo_access_key
MOMO_SECRET_KEY=your_momo_secret_key
MOMO_PARTNER_CODE=MOMO
MOMO_REDIRECT_URL=http://localhost:5173/check-payment-momo
MOMO_IPN_URL=http://localhost:8080/api/order/momo-callback
MOMO_HOST=test-payment.momo.vn

# Production MoMo (uncomment when deploying):
# MOMO_HOST=payment.momo.vn

# ============================================
# CHAT AI CONFIGURATION (Google Gemini)
# ============================================
# Get API key from: https://makersuite.google.com/app/apikey
# Optional - Only needed if you want to use AI chat
GOOGLE_GEMINI_API_KEY=your_google_gemini_api_key_here
```

### Bước 3: Điền các giá trị thực tế

Thay thế tất cả `your_xxx_here` bằng giá trị thực tế của bạn:

#### 🔑 Bắt Buộc (Must Have):
1. **MONGODB_URI**: Connection string MongoDB của bạn
2. **SECRET_KEY_ACCESS_TOKEN**: Random string (dùng để ký JWT access token)
3. **SECRET_KEY_REFRESH_TOKEN**: Random string (dùng để ký JWT refresh token)
4. **VNPAY_TMN_CODE**: Lấy từ tài khoản VNPay merchant
5. **VNPAY_SECRET_KEY**: Lấy từ tài khoản VNPay merchant

#### 📦 Nên có (Recommended):
6. **CLODINARY_CLOUD_NAME, CLODINARY_API_KEY, CLODINARY_API_SECRET_KEY**: Để upload hình ảnh
7. **RESEND_API**: Để gửi email (verify email, forgot password)

#### 🔵 Tùy chọn (Optional):
8. **MOMO_ACCESS_KEY, MOMO_SECRET_KEY**: Chỉ cần nếu dùng MoMo payment
9. **GOOGLE_GEMINI_API_KEY**: Chỉ cần nếu dùng AI chat

### Bước 4: Generate JWT Secrets

Chạy lệnh sau để tạo random secrets cho JWT:

```bash
node -e "console.log('ACCESS_TOKEN:', require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('REFRESH_TOKEN:', require('crypto').randomBytes(32).toString('hex'))"
```

Copy kết quả vào `SECRET_KEY_ACCESS_TOKEN` và `SECRET_KEY_REFRESH_TOKEN`

---

## 🔍 Lấy Credentials

### VNPay:
1. Đăng ký tài khoản tại: https://sandbox.vnpayment.vn/ (test) hoặc https://www.vnpayment.vn/ (production)
2. Đăng nhập vào merchant account
3. Lấy **TMN Code** và **Secret Key** từ dashboard

### MoMo:
1. Đăng ký tài khoản MoMo merchant
2. Lấy **Access Key** và **Secret Key** từ merchant account

### Cloudinary:
1. Đăng ký tại: https://cloudinary.com/
2. Vào Dashboard → Settings
3. Copy **Cloud Name**, **API Key**, **API Secret**

### Resend (Email):
1. Đăng ký tại: https://resend.com/
2. Vào API Keys section
3. Tạo API key mới và copy

---

## ⚠️ Lưu Ý Quan Trọng

1. **KHÔNG commit file .env vào Git** (đã có trong .gitignore)
2. **Đổi tất cả giá trị mặc định** - đừng dùng "your_xxx_here"
3. **Sử dụng secrets mạnh** cho JWT (random strings dài)
4. **Test environment** khác với **Production** - nhớ đổi URLs khi deploy
5. **Bảo mật** - không chia sẻ file .env với ai

---

## ✅ Kiểm Tra

Sau khi cấu hình, kiểm tra:
```bash
cd server
npm run dev
```

Nếu không có lỗi về missing environment variables, bạn đã cấu hình đúng! 🎉



