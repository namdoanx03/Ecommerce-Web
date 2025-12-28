# Hướng Dẫn Debug Lỗi "Lỗi xử lý thanh toán"

## 🔍 Nguyên Nhân Có Thể

Lỗi "Lỗi xử lý thanh toán" có thể xảy ra do:

### 1. **Signature Verification Failed** (Chữ ký không khớp)
- VNPay secret key không đúng
- Query params bị thay đổi trên đường truyền

### 2. **Order Not Found** (Không tìm thấy đơn hàng)
- `vnp_TxnRef` (orderId) không khớp với order trong database
- Order đã bị xóa hoặc chưa được tạo

### 3. **Transaction Error** (Lỗi database transaction)
- MongoDB connection issue
- Transaction timeout
- Database operation failed

### 4. **Environment Variables** (Biến môi trường chưa cấu hình)
- `VNPAY_SECRET_KEY` chưa được set
- `MONGODB_URI` không đúng

---

## 🔧 Cách Debug

### Bước 1: Kiểm Tra Server Logs

Mở terminal chạy server và xem logs khi có lỗi:

```bash
cd server
npm run dev
```

Khi có lỗi, bạn sẽ thấy các log như:
```
[checkPaymentController] Query params: {...}
[checkPaymentController] Looking for order with orderId: ORD-xxx
[checkPaymentController] Error: ...
```

### Bước 2: Kiểm Tra Environment Variables

Đảm bảo file `.env` có đầy đủ:

```env
VNPAY_SECRET_KEY=your_secret_key_here
MONGODB_URI=mongodb://...
```

### Bước 3: Kiểm Tra Browser Console

Mở Developer Tools (F12) → Console tab, xem error message từ API response.

### Bước 4: Kiểm Tra Network Tab

1. Mở Developer Tools (F12)
2. Vào tab **Network**
3. Tìm request `check-payment`
4. Xem **Response** để biết lỗi cụ thể

---

## 🔍 Các Lỗi Phổ Biến và Giải Pháp

### Lỗi 1: "VNPay configuration không hợp lệ"

**Nguyên nhân**: `VNPAY_SECRET_KEY` chưa được set trong `.env`

**Giải pháp**:
1. Kiểm tra file `server/.env`
2. Đảm bảo có dòng: `VNPAY_SECRET_KEY=your_secret_key`
3. Restart server

---

### Lỗi 2: "Dữ liệu không hợp lệ - chữ ký không khớp"

**Nguyên nhân**: 
- Secret key không đúng
- Query params bị encode/decode sai

**Giải pháp**:
1. Kiểm tra `VNPAY_SECRET_KEY` trong `.env` có đúng không
2. Kiểm tra trong server logs:
   ```
   Expected: xxx
   Received: yyy
   ```
3. Đảm bảo secret key khớp với merchant account VNPay

---

### Lỗi 3: "Không tìm thấy đơn hàng"

**Nguyên nhân**: 
- Order chưa được tạo khi redirect đến VNPay
- `vnp_TxnRef` không khớp với `orderId` trong database

**Kiểm tra**:
1. Xem server logs: `[checkPaymentController] Looking for order with orderId: ORD-xxx`
2. Kiểm tra database xem có order với orderId đó không
3. Kiểm tra xem order có được tạo trong `createPaymentController` không

---

### Lỗi 4: "Lỗi khi xử lý thanh toán: [error message]"

**Nguyên nhân**: Lỗi trong quá trình xử lý (transaction, update order, clear cart, etc.)

**Kiểm tra**:
1. Xem server logs để biết error message cụ thể
2. Kiểm tra MongoDB connection
3. Kiểm tra xem có lỗi trong transaction không

---

## ✅ Checklist Debug

- [ ] Server đang chạy và không có lỗi startup
- [ ] File `.env` tồn tại và có đầy đủ biến môi trường
- [ ] `VNPAY_SECRET_KEY` được set và đúng
- [ ] `MONGODB_URI` đúng và database đang chạy
- [ ] Order được tạo trong database (kiểm tra trong MongoDB)
- [ ] Server logs hiển thị thông tin debug
- [ ] Browser console không có lỗi JavaScript
- [ ] Network tab hiển thị response từ API

---

## 🛠️ Test Thủ Công

### Test 1: Kiểm tra API trực tiếp

```bash
# Thay thế query params bằng params thực tế từ VNPay
curl "http://localhost:8080/api/order/check-payment?vnp_Amount=1000000&vnp_ResponseCode=00&vnp_TxnRef=ORD-xxx&..."
```

### Test 2: Kiểm tra Order trong Database

```javascript
// Trong MongoDB shell hoặc MongoDB Compass
db.orders.find({ orderId: "ORD-xxx" })
```

### Test 3: Kiểm tra Environment Variables

```bash
cd server
node -e "require('dotenv').config(); console.log('SECRET_KEY:', process.env.VNPAY_SECRET_KEY ? 'Set' : 'NOT SET')"
```

---

## 📞 Cần Giúp Đỡ?

Nếu vẫn gặp lỗi, cung cấp:
1. Server logs (từ terminal)
2. Browser console errors
3. Network response từ API `check-payment`
4. Nội dung file `.env` (ẩn secret keys!)



