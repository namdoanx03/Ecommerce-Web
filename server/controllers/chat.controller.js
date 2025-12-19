import ChatMessageModel from '../models/chatMessage.model.js'
import ProductModel from '../models/product.model.js'
import crypto from 'crypto'

// Get chat history (user or guest)
export const fetchMessagesController = async (request, response) => {
    try {
        const userId = request.userId || null
        let messages = []

        if (userId) {
            // Authenticated user
            messages = await ChatMessageModel.find({ user_id: userId })
                .sort({ createdAt: 1 })
                .lean()
        } else {
            // Guest user
            const guestToken = request.cookies?.chat_token
            if (guestToken) {
                messages = await ChatMessageModel.find({ guest_token: guestToken })
                    .sort({ createdAt: 1 })
                    .lean()
            }
        }

        return response.json({
            success: true,
            error: false,
            data: messages
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// Send message (save user message, call AI, save bot reply)
export const sendMessageController = async (request, response) => {
    try {
        const { message } = request.body

        // Validate message
        if (!message || !message.trim()) {
            return response.status(400).json({
                message: "Message is required",
                error: true,
                success: false
            })
        }

        if (message.length > 2000) {
            return response.status(400).json({
                message: "Message too long (max 2000 characters)",
                error: true,
                success: false
            })
        }

        const userId = request.userId || null

        // Handle guest token (cookie)
        let guestToken = null
        if (!userId) {
            guestToken = request.cookies?.chat_token
            if (!guestToken) {
                // Generate new guest token
                guestToken = 'guest_' + crypto.randomBytes(32).toString('hex')
                // Set cookie (180 days)
                response.cookie('chat_token', guestToken, {
                    maxAge: 60 * 60 * 24 * 180 * 1000, // 180 days in milliseconds
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax'
                })
            }
        }

        // 1) Save user message to DB
        const userMsg = await ChatMessageModel.create({
            user_id: userId,
            guest_token: userId ? null : guestToken,
            sender: 'user',
            message: message.trim()
        })

        // 2) Prepare prompt with product list
        const products = await ProductModel.find({ stock: { $gt: 0 } })
            .select('name price unit description')
            .lean()

        const productList = products
            .map((p, index) => `${index + 1}. ${p.name} - ${p.price} VNĐ / ${p.unit}`)
            .join('\n')

        const prompt = `Bạn là trợ lý bán hàng cho website rau củ. Dưới đây là danh sách một số sản phẩm hiện có:\n\n${productList}\n\nKhi liệt kê sản phẩm, hãy luôn hiển thị từng sản phẩm trên một dòng riêng, mỗi dòng một sản phẩm. Ví dụ:\n- Sản phẩm 1\n- Sản phẩm 2\n- Sản phẩm 3\n\nHãy trả lời ngắn gọn, trung thực, chỉ dùng thông tin trong danh sách sản phẩm nếu cần.`

        // 3) Get history (last 6 messages ~ 3 turns user-bot)
        const historyQuery = userId 
            ? { user_id: userId }
            : { guest_token: guestToken }

        const history = await ChatMessageModel.find(historyQuery)
            .sort({ createdAt: -1 })
            .limit(6)
            .sort({ createdAt: 1 })
            .lean()

        // 4) Format history for Gemini API
        const contents = history.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.message }]
        }))

        // Append new user message
        contents.push({
            role: 'user',
            parts: [{ text: message.trim() }]
        })

        // 5) Call AI (Gemini) - if haven't GOOGLE_GEMINI_API_KEY return fallback text
        let aiReplyText = "Xin lỗi, hiện tại AI chưa được cấu hình."

        if (process.env.GOOGLE_GEMINI_API_KEY) {
            try {
                const url_api = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

                const payload = {
                    systemInstruction: {
                        parts: [{ text: prompt }]
                    },
                    contents: contents
                }

                // Call API Gemini
                const apiResponse = await fetch(url_api + '?key=' + process.env.GOOGLE_GEMINI_API_KEY, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                })

                if (apiResponse.ok) {
                    const data = await apiResponse.json()
                    aiReplyText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Xin lỗi, tôi chưa hiểu câu hỏi."
                } else {
                    aiReplyText = "Xin lỗi, AI không thể xử lý lúc này."
                    console.error('AI API error:', await apiResponse.text())
                }
            } catch (error) {
                aiReplyText = "Xin lỗi, hiện tại không thể kết nối AI."
                console.error('AI call error:', error.message)
            }
        }

        // 6) Save bot reply to DB
        const botMsg = await ChatMessageModel.create({
            user_id: userId,
            guest_token: userId ? null : guestToken,
            sender: 'bot',
            message: aiReplyText
        })

        // 7) Return 2 messages created (client append)
        return response.json({
            success: true,
            error: false,
            data: {
                user: userMsg,
                bot: botMsg
            }
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
