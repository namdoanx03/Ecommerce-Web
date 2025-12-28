# Giải Quyết Lỗi VNPay "Website này chưa được phê duyệt"

## ❌ Lỗi Hiện Tại

VNPay trả về lỗi: **"Website này chưa được phê duyệt"** khi:
- Return URL là `localhost` chưa được đăng ký
- IP address là IPv6 (`::1`) thay vì IPv4

## ✅ Giải Pháp

### Giải Pháp 1: Đăng Ký Return URL trong VNPay Sandbox (Khuyến Nghị cho Development)

1. **Đăng nhập vào VNPay Sandbox**:
   - Truy cập: https://sandbox.vnpayment.vn/
   - Đăng nhập với tài khoản merchant của bạn

2. **Đăng ký Return URL**:
   - Vào phần **"Cấu hình"** hoặc **"Settings"**
   - Tìm mục **"Return URL"** hoặc **"URL Callback"**
   - Thêm URL: `http://localhost:5173/check-payment`
   - Lưu cấu hình

3. **Lưu ý**: 
   - Sandbox có thể không hỗ trợ localhost
   - Nếu không được, dùng Giải Pháp 2

---

### Giải Pháp 2: Sử Dụng Ngrok (Tốt nhất cho Development)

1. **Cài đặt Ngrok**:
   ```bash
   # Download từ: https://ngrok.com/download
   # Hoặc dùng npm:
   npm install -g ngrok
   ```

2. **Tạo tunnel cho frontend**:
   ```bash
   ngrok http 5173
   ```
   
   Bạn sẽ nhận được URL như: `https://abc123.ngrok.io`

3. **Cập nhật file .env**:
   ```env
   FRONTEND_URL=https://abc123.ngrok.io
   VNPAY_RETURN_URL=https://abc123.ngrok.io/check-payment
   ```

4. **Đăng ký URL trong VNPay**:
   - Vào VNPay merchant account
   - Đăng ký Return URL: `https://abc123.ngrok.io/check-payment`

---

### Giải Pháp 3: Sử Dụng IP Address Thực (Nếu có)

1. **Tìm IP public của máy bạn**:
   - Truy cập: https://whatismyipaddress.com/
   - Hoặc chạy: `curl ifconfig.me`

2. **Cấu hình router port forwarding** (nếu cần):
   - Forward port 5173 từ router ra internet

3. **Cập nhật .env với IP thực**:
   ```env
   FRONTEND_URL=http://YOUR_PUBLIC_IP:5173
   VNPAY_RETURN_URL=http://YOUR_PUBLIC_IP:5173/check-payment
   ```

---

## 🔧 Code Đã Được Sửa

Code đã được cập nhật để:
- ✅ Chuyển IPv6 `::1` thành IPv4 `127.0.0.1`
- ✅ Xử lý IPv6 prefix `::ffff:`

---

## ⚠️ Lưu Ý Quan Trọng

1. **VNPay Sandbox**:
   - Có thể không hỗ trợ `localhost`
   - Nên dùng ngrok hoặc public URL

2. **Production**:
   - Phải đăng ký Return URL thực trong merchant account
   - Phải dùng HTTPS
   - URL phải khớp chính xác (không có trailing slash)

3. **Testing**:
   - Ngrok là cách tốt nhất để test local với VNPay
   - URL ngrok thay đổi mỗi lần restart (free plan)

---

## 📝 Checklist

- [ ] Đã sửa code để xử lý IPv6 → IPv4
- [ ] Đã cài đặt và cấu hình ngrok (nếu dùng)
- [ ] Đã đăng ký Return URL trong VNPay merchant account
- [ ] Đã cập nhật `.env` với URL đúng
- [ ] Đã test lại payment flow

---

## 🚀 Quick Start với Ngrok

```bash
# Terminal 1: Start frontend
cd client
npm run dev

# Terminal 2: Start ngrok
ngrok http 5173

# Terminal 3: Update .env
# Copy URL từ ngrok (ví dụ: https://abc123.ngrok.io)
# Update FRONTEND_URL và VNPAY_RETURN_URL

# Terminal 4: Restart backend
cd server
npm run dev
```

Sau đó đăng ký ngrok URL trong VNPay merchant account!



