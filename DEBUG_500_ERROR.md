# Debug: Backend 500 Error khi thanh toán thành công

## 🔍 Vấn đề

Backend trả về `500 Internal Server Error` khi frontend gọi `/api/order/check-payment`, mặc dù VNPay đã báo thanh toán thành công (`ResponseCode: 00`).

## 🔎 Cách Debug

### 1. Kiểm tra Server Logs

Mở terminal chạy server và xem logs khi có lỗi. Bạn sẽ thấy:

```
[checkPaymentController] Error in try block: [error details]
[checkPaymentController] Error message: [message]
[checkPaymentController] Error stack: [stack trace]
```

### 2. Các lỗi có thể xảy ra

#### Lỗi 1: Missing VNPAY_SECRET_KEY
```
[checkPaymentController] Missing VNPAY_SECRET_KEY in environment
```
**Giải pháp**: Kiểm tra file `.env` có `VNPAY_SECRET_KEY` chưa

#### Lỗi 2: Database Connection Error
```
MongooseError: ...
```
**Giải pháp**: Kiểm tra MongoDB connection

#### Lỗi 3: Transaction Error
```
TransactionError: ...
```
**Giải pháp**: Kiểm tra MongoDB transaction support

#### Lỗi 4: Order Not Found
```
[checkPaymentController] Order not found with orderId: ...
```
**Giải pháp**: Kiểm tra `vnp_TxnRef` có khớp với `orderId` trong database không

### 3. Kiểm tra Code

Đảm bảo code đã được restart sau khi thay đổi:
```bash
# Dừng server (Ctrl+C)
# Sau đó chạy lại
cd server
npm run dev
```

## ✅ Bước tiếp theo

1. **Kiểm tra server logs** trong terminal chạy server
2. **Copy error message và stack trace** từ logs
3. **Gửi lại cho tôi** để tôi có thể fix chính xác

## 📝 Checklist

- [ ] Server đã được restart sau khi thay đổi code
- [ ] File `.env` có `VNPAY_SECRET_KEY`
- [ ] MongoDB đang chạy và kết nối được
- [ ] Server logs hiển thị error message cụ thể
- [ ] Order với `orderId` tương ứng tồn tại trong database

