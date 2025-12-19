import jwt from 'jsonwebtoken'

// Optional auth - không bắt buộc đăng nhập, nhưng nếu có token thì lấy userId
const optionalAuth = async (request, response, next) => {
    try {
        const token = request.cookies.accessToken || request?.headers?.authorization?.split(" ")[1]
       
        if (token) {
            try {
                const decode = await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN)
                if (decode) {
                    request.userId = decode.id
                }
            } catch (error) {
                // Token không hợp lệ, nhưng vẫn tiếp tục như guest
                request.userId = null
            }
        }

        next()
    } catch (error) {
        // Lỗi không quan trọng, tiếp tục như guest
        next()
    }
}

export default optionalAuth

