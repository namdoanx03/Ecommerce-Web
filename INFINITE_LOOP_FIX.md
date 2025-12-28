# Fix: Server bị gọi lại liên tục (Infinite Loop)

## 🔍 Vấn đề

Server đang bị gọi API `/api/order/check-payment` liên tục, gây ra infinite loop.

## 🔎 Nguyên nhân

Trong `CheckPayment.jsx`, `useEffect` có dependencies gây re-render liên tục:

1. **`searchParams` được tạo mới mỗi lần render**: 
   ```javascript
   const searchParams = new URLSearchParams(useLocation().search);
   ```
   - Object mới mỗi lần render → reference thay đổi → trigger useEffect

2. **`fetchCartItem` và `fetchOrder` có thể có reference mới**:
   - Nếu các functions này không được memoized trong context, chúng sẽ có reference mới mỗi lần context re-render
   - Khi gọi `fetchCartItem()` và `fetchOrder()` trong useEffect, nếu chúng trigger state update → context re-render → functions có reference mới → useEffect chạy lại

3. **Dependencies không stable**:
   ```javascript
   }, [searchParams, dispatch, fetchCartItem, fetchOrder]);
   ```
   - `searchParams` là object mới mỗi lần
   - `fetchCartItem` và `fetchOrder` có thể có reference mới

## ✅ Giải pháp

### 1. Sử dụng `useRef` để đảm bảo chỉ chạy một lần

```javascript
const hasProcessed = useRef(false);
```

### 2. Sử dụng `location.search` trực tiếp thay vì tạo `searchParams` object

```javascript
const location = useLocation();
// Tạo searchParams bên trong useEffect, không phải ở component level
const searchParams = new URLSearchParams(location.search);
```

### 3. Chỉ phụ thuộc vào `location.search` trong dependencies

```javascript
useEffect(() => {
    // Reset flag khi location.search thay đổi (query params mới)
    hasProcessed.current = false;
}, [location.search]);

useEffect(() => {
    // Chỉ chạy một lần cho mỗi location.search
    if (hasProcessed.current) {
        return;
    }
    hasProcessed.current = true;
    
    // ... logic xử lý ...
    
}, [location.search]); // Chỉ phụ thuộc vào location.search
```

## 🔧 Thay đổi chi tiết

### Trước:
```javascript
const searchParams = new URLSearchParams(useLocation().search);

useEffect(() => {
    // ... logic ...
}, [searchParams, dispatch, fetchCartItem, fetchOrder]);
```

### Sau:
```javascript
const location = useLocation();
const hasProcessed = useRef(false);

useEffect(() => {
    hasProcessed.current = false;
}, [location.search]);

useEffect(() => {
    if (hasProcessed.current) {
        return;
    }
    hasProcessed.current = true;
    
    const searchParams = new URLSearchParams(location.search);
    // ... logic ...
}, [location.search]);
```

## 📝 Lưu ý

- `location.search` là string, nên reference ổn định (chỉ thay đổi khi query params thay đổi)
- `hasProcessed.current` được reset khi `location.search` thay đổi, đảm bảo query params mới được xử lý
- Không đưa `fetchCartItem` và `fetchOrder` vào dependencies để tránh infinite loop
- Sử dụng `eslint-disable-next-line react-hooks/exhaustive-deps` để tắt warning (đã xử lý đúng bằng `useRef`)

## ✅ Kết quả

- API chỉ được gọi **một lần** cho mỗi `location.search`
- Không còn infinite loop
- Vẫn xử lý được query params mới khi `location.search` thay đổi



