# Phân Tích Luồng Hoạt Động và Thuật Toán Chức Năng Chatbot AI

## 📋 Tổng Quan

Chatbot AI được xây dựng để hỗ trợ khách hàng trên website bán rau củ, sử dụng Google Gemini API (gemini-2.5-flash) để tạo phản hồi thông minh dựa trên danh sách sản phẩm hiện có.

---

## 🏗️ Kiến Trúc Hệ Thống

### 1. **Frontend (React)**
- **Component**: `client/src/components/Chat.jsx`
- **UI**: Chat widget dạng floating button ở góc dưới bên phải
- **State Management**: React hooks (useState, useEffect, useRef)

### 2. **Backend (Node.js/Express)**
- **Controller**: `server/controllers/chat.controller.js`
- **Model**: `server/models/chatMessage.model.js`
- **Route**: `server/route/chat.route.js`
- **API**: Google Gemini 2.5 Flash

### 3. **Database (MongoDB)**
- **Collection**: `chatMessage`
- **Schema**: Lưu trữ tin nhắn của user và bot với user_id hoặc guest_token

---

## 🔄 Luồng Hoạt Động Chi Tiết

### **A. Luồng Khởi Tạo Chat (Load Messages)**

```
1. User click vào icon chat (IoChatbubbleEllipses)
   ↓
2. Component Chat.jsx: setIsOpen(true)
   ↓
3. useEffect trigger khi isOpen = true
   ↓
4. Gọi loadMessages()
   ↓
5. Frontend gửi GET request: /api/chat/messages
   ↓
6. Backend: fetchMessagesController()
   ├─ Kiểm tra userId từ request (có thể null)
   ├─ Nếu có userId: Query messages theo user_id
   ├─ Nếu không có userId: 
   │  ├─ Kiểm tra cookie chat_token
   │  └─ Query messages theo guest_token
   └─ Trả về messages đã sắp xếp theo createdAt (tăng dần)
   ↓
7. Frontend nhận response
   ├─ Nếu messages.length === 0:
   │  └─ Hiển thị message mặc định: "Xin chào 👋, tôi có thể giúp gì cho bạn?"
   └─ Nếu có messages:
      └─ Hiển thị toàn bộ lịch sử chat
```

**Code Flow:**
```javascript
// Frontend
useEffect(() => {
  if (isOpen) {
    loadMessages()
  }
}, [isOpen])

// Backend
fetchMessagesController() {
  const userId = request.userId || null
  if (userId) {
    messages = await ChatMessageModel.find({ user_id: userId })
  } else {
    const guestToken = request.cookies?.chat_token
    if (guestToken) {
      messages = await ChatMessageModel.find({ guest_token: guestToken })
    }
  }
}
```

---

### **B. Luồng Gửi Tin Nhắn (Send Message)**

```
1. User nhập tin nhắn và nhấn "Gửi" hoặc Enter
   ↓
2. Frontend: handleSendMessage()
   ├─ Validate: message.trim() && !loading
   ├─ Set loading = true
   └─ Clear input field
   ↓
3. Frontend gửi POST request: /api/chat/send
   Body: { message: "tin nhắn của user" }
   ↓
4. Backend: sendMessageController()
   │
   ├─ BƯỚC 1: VALIDATION
   │  ├─ Kiểm tra message không rỗng
   │  └─ Kiểm tra độ dài <= 2000 ký tự
   │
   ├─ BƯỚC 2: XÁC ĐỊNH USER/GUEST
   │  ├─ Nếu có userId: Dùng user_id
   │  └─ Nếu không có userId:
   │     ├─ Kiểm tra cookie chat_token
   │     ├─ Nếu không có: Tạo mới guest_token
   │     │  └─ Format: 'guest_' + crypto.randomBytes(32).toString('hex')
   │     └─ Set cookie chat_token (180 days, httpOnly, secure)
   │
   ├─ BƯỚC 3: LƯU TIN NHẮN USER
   │  └─ ChatMessageModel.create({
   │       user_id: userId || null,
   │       guest_token: userId ? null : guestToken,
   │       sender: 'user',
   │       message: message.trim()
   │     })
   │
   ├─ BƯỚC 4: CHUẨN BỊ CONTEXT CHO AI
   │  ├─ Lấy danh sách sản phẩm còn hàng:
   │  │  └─ ProductModel.find({ stock: { $gt: 0 } })
   │  │     .select('name price unit description')
   │  │
   │  ├─ Format danh sách sản phẩm:
   │  │  └─ "1. Tên SP - Giá VNĐ / Đơn vị\n2. ..."
   │  │
   │  └─ Tạo system prompt:
   │     "Bạn là trợ lý bán hàng cho website rau củ.
   │      Danh sách sản phẩm: [productList]
   │      Hãy trả lời ngắn gọn, trung thực..."
   │
   ├─ BƯỚC 5: LẤY LỊCH SỬ CHAT (CONTEXT)
   │  ├─ Query 6 tin nhắn gần nhất (3 lượt user-bot)
   │  ├─ Sắp xếp: createdAt DESC (mới nhất trước)
   │  ├─ Limit: 6 messages
   │  └─ Sau đó sort lại: createdAt ASC (cũ nhất trước)
   │
   ├─ BƯỚC 6: FORMAT HISTORY CHO GEMINI API
   │  ├─ Convert messages sang format Gemini:
   │  │  {
   │  │    role: 'user' | 'model',
   │  │    parts: [{ text: message }]
   │  │  }
   │  └─ Append tin nhắn mới của user vào cuối
   │
   ├─ BƯỚC 7: GỌI GEMINI AI API
   │  ├─ URL: https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
   │  ├─ Method: POST
   │  ├─ Headers: { 'Content-Type': 'application/json' }
   │  ├─ Query: ?key=GOOGLE_GEMINI_API_KEY
   │  ├─ Body:
   │  │  {
   │  │    systemInstruction: { parts: [{ text: prompt }] },
   │  │    contents: [history + new message]
   │  │  }
   │  │
   │  ├─ Xử lý response:
   │  │  └─ aiReplyText = data.candidates[0].content.parts[0].text
   │  │
   │  └─ Fallback nếu lỗi:
   │     └─ "Xin lỗi, AI không thể xử lý lúc này."
   │
   ├─ BƯỚC 8: LƯU PHẢN HỒI CỦA BOT
   │  └─ ChatMessageModel.create({
   │       user_id: userId || null,
   │       guest_token: userId ? null : guestToken,
   │       sender: 'bot',
   │       message: aiReplyText
   │     })
   │
   └─ BƯỚC 9: TRẢ VỀ RESPONSE
      └─ {
           success: true,
           data: {
             user: userMsg,
             bot: botMsg
           }
         }
   ↓
5. Frontend nhận response
   ├─ Append cả 2 messages (user + bot) vào state
   └─ Set loading = false
   ↓
6. Auto scroll xuống tin nhắn mới nhất
```

---

## 🧮 Thuật Toán Chi Tiết

### **1. Thuật Toán Xác Định User/Guest**

```javascript
Algorithm: IdentifyUserOrGuest
Input: request (có thể có userId, cookies)
Output: { userId, guestToken }

BEGIN
  userId = request.userId || null
  
  IF userId != null THEN
    RETURN { userId, guestToken: null }
  ELSE
    guestToken = request.cookies?.chat_token
    
    IF guestToken == null THEN
      // Tạo token mới cho guest
      guestToken = 'guest_' + crypto.randomBytes(32).toString('hex')
      SET_COOKIE('chat_token', guestToken, {
        maxAge: 180 days,
        httpOnly: true,
        secure: production mode
      })
    END IF
    
    RETURN { userId: null, guestToken }
  END IF
END
```

**Độ phức tạp**: O(1)

---

### **2. Thuật Toán Lấy Lịch Sử Chat (Context Window)**

```javascript
Algorithm: GetChatHistory
Input: userId hoặc guestToken
Output: Array of messages (max 6 messages)

BEGIN
  // Xác định query condition
  IF userId != null THEN
    condition = { user_id: userId }
  ELSE
    condition = { guest_token: guestToken }
  END IF
  
  // Lấy 6 tin nhắn gần nhất (3 lượt user-bot)
  history = QUERY(condition)
    .SORT({ createdAt: -1 })  // Mới nhất trước
    .LIMIT(6)
    .SORT({ createdAt: 1 })   // Sắp xếp lại: cũ nhất trước
  
  RETURN history
END
```

**Giải thích**:
- Lấy 6 tin nhắn = 3 lượt đối thoại (mỗi lượt có 1 user message + 1 bot message)
- Sắp xếp 2 lần để đảm bảo thứ tự thời gian đúng khi gửi cho AI

**Độ phức tạp**: O(n log n) - do sorting, với n = số lượng messages trong DB

---

### **3. Thuật Toán Format Context cho Gemini API**

```javascript
Algorithm: FormatHistoryForGemini
Input: Array of chat messages
Output: Array of Gemini format messages

BEGIN
  contents = []
  
  FOR EACH message IN history DO
    role = (message.sender == 'user') ? 'user' : 'model'
    
    contents.APPEND({
      role: role,
      parts: [{ text: message.message }]
    })
  END FOR
  
  // Append tin nhắn mới của user
  contents.APPEND({
    role: 'user',
    parts: [{ text: newUserMessage }]
  })
  
  RETURN contents
END
```

**Độ phức tạp**: O(n) với n = số lượng messages trong history

---

### **4. Thuật Toán Tạo System Prompt**

```javascript
Algorithm: CreateSystemPrompt
Input: Array of products
Output: System prompt string

BEGIN
  productList = ""
  
  FOR EACH (product, index) IN products DO
    productList += "${index + 1}. ${product.name} - ${product.price} VNĐ / ${product.unit}\n"
  END FOR
  
  prompt = 
    "Bạn là trợ lý bán hàng cho website rau củ.
     Danh sách sản phẩm:\n\n${productList}\n
     Khi liệt kê sản phẩm, hãy luôn hiển thị từng sản phẩm trên một dòng riêng.
     Hãy trả lời ngắn gọn, trung thực..."
  
  RETURN prompt
END
```

**Độ phức tạp**: O(n) với n = số lượng sản phẩm

---

### **5. Thuật Toán Gọi Gemini AI**

```javascript
Algorithm: CallGeminiAI
Input: systemPrompt, chatHistory
Output: AI response text

BEGIN
  IF GOOGLE_GEMINI_API_KEY == null THEN
    RETURN "Xin lỗi, hiện tại AI chưa được cấu hình."
  END IF
  
  payload = {
    systemInstruction: {
      parts: [{ text: systemPrompt }]
    },
    contents: chatHistory
  }
  
  TRY
    response = HTTP_POST(
      url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + API_KEY,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    )
    
    IF response.status == 200 THEN
      data = JSON.parse(response.body)
      aiText = data.candidates[0].content.parts[0].text
      RETURN aiText || "Xin lỗi, tôi chưa hiểu câu hỏi."
    ELSE
      RETURN "Xin lỗi, AI không thể xử lý lúc này."
    END IF
    
  CATCH error
    RETURN "Xin lỗi, hiện tại không thể kết nối AI."
  END TRY
END
```

**Độ phức tạp**: O(1) - API call, nhưng thời gian thực tế phụ thuộc vào network latency

---

## 📊 Sơ Đồ Luồng Dữ Liệu

```
┌─────────────┐
│   User      │
│  (Browser)  │
└──────┬──────┘
       │
       │ 1. Click chat icon
       ▼
┌─────────────────────┐
│   Chat.jsx           │
│  (React Component)   │
│  - State: messages   │
│  - State: loading    │
└──────┬──────────────┘
       │
       │ 2. GET /api/chat/messages
       ▼
┌─────────────────────┐
│  fetchMessages       │
│  Controller          │
└──────┬──────────────┘
       │
       │ 3. Query MongoDB
       ▼
┌─────────────────────┐
│  ChatMessageModel    │
│  (MongoDB)           │
└──────┬──────────────┘
       │
       │ 4. Return messages
       ▼
┌─────────────────────┐
│   Chat.jsx           │
│  Display messages    │
└─────────────────────┘

─────────────────────────────────

┌─────────────┐
│   User      │
│  Types msg  │
└──────┬──────┘
       │
       │ 1. POST /api/chat/send
       ▼
┌─────────────────────┐
│  sendMessage         │
│  Controller          │
└──────┬──────────────┘
       │
       ├─► 2. Save user message
       │   └─► ChatMessageModel
       │
       ├─► 3. Get products
       │   └─► ProductModel
       │
       ├─► 4. Get chat history
       │   └─► ChatMessageModel (6 messages)
       │
       ├─► 5. Format for Gemini
       │
       ├─► 6. Call Gemini API
       │   └─► Google Gemini 2.5 Flash
       │
       └─► 7. Save bot response
           └─► ChatMessageModel
       │
       │ 8. Return { user, bot }
       ▼
┌─────────────────────┐
│   Chat.jsx           │
│  Update UI           │
└─────────────────────┘
```

---

## 🔐 Xử Lý Xác Thực

### **Hỗ Trợ 2 Loại User:**

1. **Authenticated User**
   - Có `userId` từ JWT token
   - Messages được lưu với `user_id`
   - `guest_token = null`

2. **Guest User**
   - Không có `userId`
   - Sử dụng `guest_token` (lưu trong cookie)
   - Cookie tồn tại 180 ngày
   - Token format: `'guest_' + 64 hex characters`

### **Middleware:**
- Route không sử dụng middleware bắt buộc
- Controller tự xử lý cả 2 trường hợp (user/guest)

---

## 🎯 Đặc Điểm Nổi Bật

### **1. Context-Aware AI**
- AI nhận được 6 tin nhắn gần nhất (3 lượt đối thoại)
- Giúp AI hiểu ngữ cảnh cuộc trò chuyện

### **2. Product-Aware**
- System prompt chứa danh sách sản phẩm thực tế từ database
- AI có thể tư vấn sản phẩm cụ thể

### **3. Guest Support**
- Khách hàng không cần đăng nhập vẫn có thể chat
- Lịch sử chat được lưu theo guest_token

### **4. Error Handling**
- Fallback message nếu AI không hoạt động
- Validation message length (max 2000 chars)
- Try-catch cho mọi API calls

### **5. UX Features**
- Auto-scroll to bottom
- Loading state khi đang gửi
- Enter key để gửi tin nhắn
- Responsive UI với Tailwind CSS

---

## ⚡ Tối Ưu Hóa

### **1. Database Indexing**
- `guest_token` có index để query nhanh hơn
- `user_id` có index (từ ref schema)

### **2. Context Window Limit**
- Chỉ lấy 6 messages gần nhất (giảm token usage)
- Giảm chi phí API call

### **3. Lazy Loading**
- Chỉ load messages khi mở chat
- Không load khi component mount

---

## 🐛 Edge Cases Đã Xử Lý

1. ✅ User chưa có lịch sử chat → Hiển thị message chào mặc định
2. ✅ Guest không có cookie → Tạo mới guest_token
3. ✅ AI API lỗi → Fallback message
4. ✅ Message quá dài → Validation error
5. ✅ Không có API key → Thông báo cấu hình
6. ✅ Network error → Error message cho user

---

## 📈 Độ Phức Tạp Tổng Thể

- **Time Complexity**: 
  - Send message: O(n + m) với n = số products, m = số messages trong history
  - Fetch messages: O(k log k) với k = tổng số messages của user
  
- **Space Complexity**: 
  - O(h) với h = số messages trong history (max 6)
  - O(p) với p = số products (để tạo prompt)

---

## 🔮 Có Thể Cải Thiện

1. **Caching**: Cache danh sách sản phẩm (ít thay đổi)
2. **Rate Limiting**: Giới hạn số request/giờ cho mỗi user
3. **Streaming Response**: Stream AI response thay vì chờ toàn bộ
4. **Message Pagination**: Load thêm messages khi scroll lên
5. **Typing Indicator**: Hiển thị "Bot đang gõ..." khi AI đang xử lý
6. **Rich Messages**: Hỗ trợ images, product cards trong chat

---

## 📝 Kết Luận

Chatbot AI được thiết kế với kiến trúc rõ ràng, hỗ trợ cả user đã đăng nhập và guest, tích hợp với Google Gemini để tạo phản hồi thông minh dựa trên sản phẩm thực tế. Luồng xử lý được tối ưu với context window giới hạn và error handling đầy đủ.




