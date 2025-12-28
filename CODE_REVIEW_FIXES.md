# Code Review - Những Điểm Cần Sửa

## ✅ Đã Sửa

1. **MoMo Error Handling**: 
   - ✅ Đã thêm check `resultCode !== 0` từ MoMo response
   - ✅ Đã thêm timeout cho MoMo request (10 seconds)
   - ✅ Đã thêm check `payUrl` tồn tại trước khi return
   - ✅ Đã xóa temporary order nếu MoMo fail

2. **Error Handling trong createPaymentController**:
   - ✅ Đã thêm logic xóa temporary order nếu payment creation fail

## ⚠️ Cần Lưu Ý (Không Bắt Buộc Sửa Ngay)

### 1. Order Model - VoucherId Field

**Hiện tại**: Order model không có field `voucherId`, nhưng code đã có logic xử lý voucher (đang comment).

**Nếu muốn sử dụng voucher**:
```javascript
// Thêm vào server/models/order.model.js
voucherId: {
    type: mongoose.Schema.ObjectId,
    ref: 'voucher',
    default: null
}
```

**Hiện tại**: Code voucher đang comment nên không ảnh hưởng. Có thể bỏ qua nếu chưa cần dùng voucher.

---

### 2. Environment Variables

**Cần cấu hình** các biến môi trường sau trong `.env`:

```env
# VNPay (bắt buộc nếu dùng VNPay)
VNPAY_TMN_CODE=your_code
VNPAY_SECRET_KEY=your_secret

# MoMo (bắt buộc nếu dùng MoMo)
MOMO_ACCESS_KEY=your_access_key
MOMO_SECRET_KEY=your_secret_key
MOMO_PARTNER_CODE=MOMO

# URLs (có default nhưng nên cấu hình)
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:8080
VNPAY_RETURN_URL=http://localhost:5173/check-payment
MOMO_REDIRECT_URL=http://localhost:5173/check-payment-momo
MOMO_IPN_URL=http://localhost:8080/api/order/momo-callback
```

---

### 3. Frontend Updates

**Cần cập nhật frontend** để:
- Hỗ trợ chọn payment method (vnpay/momo) 
- Pass `typePayment` trong request body
- Handle MoMo callback redirect

---

### 4. Optional Improvements (Không bắt buộc)

1. **Voucher Validation**: Nếu uncomment voucher code, nên thêm validation:
   - Check voucher tồn tại
   - Check voucher chưa hết hạn
   - Check usage_limit
   - Check min_purchase_amount

2. **MoMo Signature Verification**: Hiện tại MoMo callback chưa verify signature. Có thể thêm nếu cần tăng security.

3. **Logging**: Có thể thêm logging chi tiết hơn cho production.

---

## ✅ Kết Luận

**Code hiện tại đã ổn và sẵn sàng sử dụng!**

Những điểm trên là **tùy chọn** hoặc **cần làm khi tích hợp với frontend**. Không có lỗi nghiêm trọng cần sửa ngay.

### Các bước tiếp theo:
1. ✅ Cấu hình environment variables
2. ⚠️ Test với sandbox/test environment  
3. ⚠️ Cập nhật frontend để hỗ trợ MoMo
4. ⚠️ (Optional) Thêm voucherId vào OrderModel nếu cần dùng voucher



