# Giải Thích VNPay Configuration

## 🔑 Secret Key vs SecureSecret

### Code Mẫu (VNPay SDK):
```javascript
const vnpay = new VNPay({
    secureSecret: 'O6J4Z89F24EL7WDPFXJEJBX47AGBLQVO'  // Tên trong SDK
});
```

### Code Hiện Tại (Tự Implement):
```javascript
const secretKey = process.env.VNPAY_SECRET_KEY;  // Tên biến môi trường
```

## ✅ Kết Luận

**Đây là CÙNG MỘT GIÁ TRỊ**, chỉ khác tên:
- `secureSecret` = tên trong VNPay SDK
- `VNPAY_SECRET_KEY` = tên biến môi trường trong code hiện tại

## 📝 Cấu Hình

Trong file `.env`:
```env
VNPAY_TMN_CODE=your_tmn_code_from_vnpay
VNPAY_SECRET_KEY=your_secret_key_from_vnpay  # <-- Lấy từ merchant account VNPay
```

**Không cần sửa code!** Chỉ cần lấy Secret Key từ tài khoản VNPay và đặt vào `.env`.



