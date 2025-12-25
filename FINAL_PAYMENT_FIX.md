# Fix cuối cùng: Xử lý lỗi 500 khi thanh toán thành công

## 🔍 Vấn đề

Backend trả về `500 Internal Server Error` khi xử lý callback từ VNPay, mặc dù thanh toán đã thành công.

## ✅ Các thay đổi đã thực hiện

### 1. Cải thiện Transaction Handling

**Trước:**
```javascript
const session = await mongoose.startSession();
session.startTransaction();
try {
    // validation
    if (!query.vnp_TxnRef) {
        await session.abortTransaction(); // Transaction chưa được start
        return response.status(400).json({...});
    }
}
```

**Sau:**
```javascript
let session = null;
try {
    // Validation trước khi start transaction
    if (!query.vnp_TxnRef) {
        return response.status(400).json({...}); // Không cần abort
    }
    
    // Start transaction chỉ sau khi validation pass
    session = await mongoose.startSession();
    session.startTransaction();
    // ... rest of code
}
```

### 2. Cải thiện Error Handling

- Kiểm tra `session` trước khi abort/end
- Đảm bảo session luôn được end trong finally block
- Thêm try-catch cho các operations liên quan đến session

### 3. Validation sớm

- Validate `vnp_TxnRef` trước khi start transaction
- Validate `VNPAY_SECRET_KEY` trước khi start transaction
- Tránh phải abort transaction khi có lỗi validation cơ bản

## 📝 Code Flow

1. **Validation cơ bản** (không cần transaction):
   - Kiểm tra `vnp_TxnRef`
   - Kiểm tra `VNPAY_SECRET_KEY`

2. **Start transaction** (chỉ sau khi validation pass):
   - `session = await mongoose.startSession()`
   - `session.startTransaction()`

3. **Xử lý thanh toán**:
   - Verify signature
   - Find order
   - Update order status
   - Clear cart
   - Commit transaction

4. **Error handling**:
   - Abort transaction nếu có lỗi
   - End session trong finally block

## 🔍 Debug

Kiểm tra server logs để xem:
- `[checkPaymentController] Query params:` - Query params nhận được
- `[checkPaymentController] Looking for order with orderId:` - Order ID đang tìm
- `[checkPaymentController] Order found:` - Order đã tìm thấy
- `[checkPaymentController] Payment successful, updating order...` - Bắt đầu update
- `[checkPaymentController] Order updated successfully:` - Update thành công
- `[checkPaymentController] Clearing cart for userId:` - Bắt đầu clear cart
- `[checkPaymentController] Transaction committed successfully` - Transaction đã commit

## ✅ Kết quả mong đợi

Sau khi fix:
- ✅ Không còn 500 error (trừ khi có lỗi thực sự từ database)
- ✅ Order được update thành `SUCCESS`
- ✅ Cart được clear
- ✅ Response trả về success cho frontend

## 🔧 Cần kiểm tra

1. **Restart server** sau khi thay đổi code
2. **Kiểm tra MongoDB connection** có hoạt động không
3. **Kiểm tra MongoDB version** có support transactions không (cần MongoDB >= 4.0 và replica set hoặc sharded cluster)
4. **Kiểm tra server logs** để xem error cụ thể nếu vẫn còn lỗi

