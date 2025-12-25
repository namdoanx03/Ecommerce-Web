import CartProductModel from "../models/cartproduct.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import mongoose from "mongoose";
import querystring from "querystring";
import crypto from "crypto";
import moment from "moment";

function sortObject(obj) {
    let sorted = {};
    let keys = Object.keys(obj).sort();
    keys.forEach((key) => {
        sorted[key] = obj[key];
    });
    return sorted;
}

export async function createPaymentController(request, response) {
    try {
        const { amount, list_items, addressId, subTotalAmt, totalAmt } = request.body;
        const userId = request.userId; // Get userId from auth middleware

        // Create temporary order
        const orderPayload = {
            userId: userId,
            orderId: `ORD-${new mongoose.Types.ObjectId()}`,
            productId: list_items.map(el => el.productId._id),
            product_details: list_items.map(el => {
                // Get image - handle both array and string
                let productImage = '';
                if (el.productId.image) {
                    if (Array.isArray(el.productId.image) && el.productId.image.length > 0) {
                        productImage = el.productId.image[0];
                    } else if (typeof el.productId.image === 'string' && el.productId.image.trim() !== '') {
                        productImage = el.productId.image;
                    }
                }
                
                return {
                    name: el.productId.name || '',
                    qty: el.quantity || el.qty || 1,
                    price: el.productId.price || 0,
                    image: productImage,
                    productId: el.productId._id.toString()
                };
            }),
            paymentId: "",
            payment_method: "VNPAY",
            payment_status: "PENDING",
            delivery_address: addressId,
            subTotalAmt: subTotalAmt,
            totalAmt: totalAmt,
        };

        // Save temporary order
        const tempOrder = await OrderModel.create(orderPayload);

        const tmnCode = process.env.VNPAY_TMN_CODE || "ADA1G5J9";
        const secretKey = process.env.VNPAY_SECRET_KEY || "Z0AWA2O5YQUX6TR4I8MAHIYSAAFER6D7";
        // VNPay yêu cầu return URL phải được đăng ký trong merchant account
        // Nếu dùng localhost, cần đăng ký với VNPay hoặc dùng ngrok/public URL
        const returnUrl = process.env.VNPAY_RETURN_URL || `${process.env.FRONTEND_URL || "http://localhost:5173"}/check-payment`;
        const vnp_Url = process.env.VNPAY_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";

        // Get client IP address (handle proxy/load balancer)
        let ipAddr = request.headers['x-forwarded-for'] || 
                     request.headers['x-real-ip'] || 
                     request.connection.remoteAddress || 
                     request.socket.remoteAddress ||
                     (request.connection.socket ? request.connection.socket.remoteAddress : null) ||
                     '127.0.0.1';
        
        // Extract first IP if it's a comma-separated list
        if (ipAddr.includes(',')) {
            ipAddr = ipAddr.split(',')[0].trim();
        }
        let orderId = tempOrder.orderId; // Use the saved order ID
        let bankCode = request.query.bankCode || "";
        let createDate = moment().format("YYYYMMDDHHmmss");
        let orderInfo = "Thanh_toan_don_hang";
        let locale = request.query.language || "vn";
        let currCode = "VND";

        let vnp_Params = {
            vnp_Version: "2.1.0",
            vnp_Command: "pay",
            vnp_TmnCode: tmnCode,
            vnp_Locale: locale,
            vnp_CurrCode: currCode,
            vnp_TxnRef: orderId,
            vnp_OrderInfo: orderInfo,
            vnp_OrderType: "billpayment",
            vnp_Amount: amount * 100,
            vnp_ReturnUrl: returnUrl,
            vnp_IpAddr: ipAddr,
            vnp_CreateDate: createDate
        };

        if (bankCode !== "") {
            vnp_Params["vnp_BankCode"] = bankCode;
        }

        vnp_Params = sortObject(vnp_Params);

        let signData = querystring.stringify(vnp_Params);
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer.from(signData, "utf-8")).digest("hex");
        vnp_Params["vnp_SecureHash"] = signed;

        let paymentUrl = vnp_Url + "?" + querystring.stringify(vnp_Params);
        response.json({ paymentUrl, orderId: tempOrder.orderId });
    } catch (error) {
        console.error("Error creating payment:", error);
        response.status(500).json({
            message: "Lỗi khi tạo thanh toán",
            error: error.message,
            success: false
        });
    }
}
// http://localhost:5173/check-payment?
// vnp_Amount=11836000
// vnp_BankCode=NCB
// vnp_BankTranNo=VNP15016383
// vnp_CardType=ATM
// vnp_OrderInfo=Thanh_toan_don_hang
// vnp_PayDate=20250613145439
// vnp_ResponseCode=00
// vnp_TmnCode=ADA1G5J9
// vnp_TransactionNo=15016383
// vnp_TransactionStatus=00
// vnp_TxnRef=20250613145318
// vnp_SecureHash=8da30df7d5c77f5a47af850967a847c4b24ba111c982abefa2fb1602ff24ee0c59ca4db50e085793734f8e1fd52e5e35cda139bea52a4d339698c248af6ec9f7
export async function checkPaymentController(request, response) {
    try {
        const query = request.query;
        const secretKey = process.env.VNPAY_SECRET_KEY || "Z0AWA2O5YQUX6TR4I8MAHIYSAAFER6D7";
        const vnp_SecureHash = query.vnp_SecureHash;

        // Create a copy of query without SecureHash for signature verification
        const queryForSign = { ...query };
        delete queryForSign.vnp_SecureHash;
        delete queryForSign.vnp_SecureHashType;
        
        const signData = querystring.stringify(queryForSign);

        const hmac = crypto.createHmac("sha512", secretKey);
        const checkSum = hmac.update(new Buffer.from(signData, "utf-8")).digest("hex");
        
        console.log("Query from VNPay:", query);
        console.log("Calculated checksum:", checkSum);
        console.log("Received checksum:", vnp_SecureHash);

        // Verify VNPay signature
        if (vnp_SecureHash !== checkSum) {
            console.error("Signature mismatch!");
            return response.status(400).json({ 
                message: "Dữ liệu không hợp lệ - chữ ký không khớp",
                success: false 
            });
        }

        // Find the order
        const order = await OrderModel.findOne({ 
            orderId: query.vnp_TxnRef 
        });

        if (!order) {
            return response.status(404).json({
                message: "Không tìm thấy đơn hàng",
                success: false
            });
        }

        // Check if order is already processed
        if (order.payment_status !== "PENDING") {
            return response.status(400).json({
                message: "Đơn hàng đã được xử lý trước đó",
                success: false,
                order: order
            });
        }

        let updatedOrder;

        // Check payment status: ResponseCode = "00" means success
        if (query.vnp_ResponseCode === "00" && query.vnp_TransactionStatus === "00") {
            // Update order status to success
            updatedOrder = await OrderModel.findOneAndUpdate(
                { 
                    _id: order._id,
                    payment_status: "PENDING"
                },
                {
                    paymentId: query.vnp_TransactionNo || query.vnp_BankTranNo,
                    payment_method: "VNPAY",
                    payment_status: "SUCCESS"
                },
                { new: true }
            );

            if (!updatedOrder) {
                return response.status(500).json({
                    message: "Không thể cập nhật trạng thái đơn hàng",
                    success: false
                });
            }

            // Clear cart
            await CartProductModel.deleteMany({ userId: order.userId });
            await UserModel.updateOne(
                { _id: order.userId },
                { shopping_cart: [] }
            );

            return response.json({
                message: "Thanh toán thành công",
                data: query,
                success: true,
                order: updatedOrder
            });
        } else {
            // Update order status to failed
            const responseCode = query.vnp_ResponseCode || "99";
            const responseMessage = getVNPayResponseMessage(responseCode);
            
            updatedOrder = await OrderModel.findOneAndUpdate(
                { 
                    _id: order._id,
                    payment_status: "PENDING"
                },
                {
                    payment_method: "VNPAY",
                    payment_status: "FAILED",
                    paymentId: query.vnp_TransactionNo || null
                },
                { new: true }
            );

            return response.json({
                message: responseMessage || "Thanh toán thất bại",
                data: query,
                success: false,
                order: updatedOrder
            });
        }
    } catch (error) {
        console.error("Error in checkPaymentController:", error);
        return response.status(500).json({
            message: "Lỗi khi xử lý thanh toán",
            error: error.message,
            success: false
        });
    }
}

// Helper function to get VNPay response messages
function getVNPayResponseMessage(code) {
    const messages = {
        "00": "Giao dịch thành công",
        "07": "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường)",
        "09": "Thẻ/Tài khoản chưa đăng ký dịch vụ InternetBanking",
        "10": "Xác thực thông tin thẻ/tài khoản không đúng quá 3 lần",
        "11": "Đã hết hạn chờ thanh toán. Xin vui lòng thực hiện lại giao dịch",
        "12": "Thẻ/Tài khoản bị khóa",
        "13": "Nhập sai mật khẩu xác thực giao dịch (OTP). Xin vui lòng thực hiện lại giao dịch",
        "51": "Tài khoản không đủ số dư để thực hiện giao dịch",
        "65": "Tài khoản đã vượt quá hạn mức giao dịch trong ngày",
        "75": "Ngân hàng thanh toán đang bảo trì",
        "79": "Nhập sai mật khẩu thanh toán quá số lần quy định",
        "99": "Lỗi không xác định"
    };
    return messages[code] || `Lỗi không xác định (Mã: ${code})`;
}

export async function CashOnDeliveryOrderController(request, response) {
    try {
        const userId = request.userId; // auth middleware
        const { list_items, totalAmt, addressId, subTotalAmt } = request.body;

        // Validate input
        if (!list_items || !Array.isArray(list_items) || list_items.length === 0) {
            return response.status(400).json({
                message: "Danh sách sản phẩm không hợp lệ",
                error: true,
                success: false
            });
        }

        // Validate each item has valid product data
        for (const item of list_items) {
            if (!item.productId || !item.productId._id) {
                return response.status(400).json({
                    message: "Thông tin sản phẩm không hợp lệ",
                    error: true,
                    success: false
                });
            }
            if (!item.productId.price || item.productId.price <= 0) {
                return response.status(400).json({
                    message: `Sản phẩm "${item.productId.name || 'N/A'}" không có giá hợp lệ`,
                    error: true,
                    success: false
                });
            }
        }

        // Tạo 1 order duy nhất chứa nhiều sản phẩm
        const payload = {
            userId: userId,
            orderId: `ORD-${new mongoose.Types.ObjectId()}`,
            productId: list_items.map(el => el.productId._id),
            product_details: list_items.map(el => {
                // Get image - handle both array and string
                let productImage = '';
                if (el.productId.image) {
                    if (Array.isArray(el.productId.image) && el.productId.image.length > 0) {
                        productImage = el.productId.image[0];
                    } else if (typeof el.productId.image === 'string' && el.productId.image.trim() !== '') {
                        productImage = el.productId.image;
                    }
                }
                
                // Ensure price is valid number
                const productPrice = Number(el.productId.price) || 0;
                if (productPrice <= 0) {
                    throw new Error(`Giá sản phẩm "${el.productId.name || 'N/A'}" không hợp lệ`);
                }
                
                return {
                    name: el.productId.name || '',
                    qty: el.quantity || el.qty || 1,
                    price: productPrice,
                    image: productImage,
                    productId: el.productId._id.toString()
                };
            }),
            paymentId: "",
            payment_method: "CASH ON DELIVERY",
            payment_status: "PENDING",
            delivery_address: addressId,
            subTotalAmt: Number(subTotalAmt) || 0,
            totalAmt: Number(totalAmt) || 0,
        };

        // Validate totals
        if (payload.totalAmt <= 0) {
            return response.status(400).json({
                message: "Tổng tiền đơn hàng không hợp lệ",
                error: true,
                success: false
            });
        }

        const generatedOrder = await OrderModel.create(payload);

        ///remove from the cart
        const removeCartItems = await CartProductModel.deleteMany({ userId: userId })
        const updateInUser = await UserModel.updateOne({ _id: userId }, { shopping_cart: [] })

        // / Xóa sản phẩm khỏi giỏ hàng
        // await CartProductModel.deleteMany({ userId: userId });
        // await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });

        return response.json({
            message: "Order successfully",
            error: false,
            success: true,
            data: generatedOrder
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}



export async function getOrderDetailsController(request, response) {
    try {
        const userId = request.userId

        if (!userId) {
            return response.status(401).json({
                message: "User ID not found",
                error: true,
                success: false
            })
        }

        // Get user to check role
        const user = await UserModel.findById(userId).select('role');
        
        if (!user) {
            return response.status(404).json({
                message: "User not found",
                error: true,
                success: false
            })
        }

        // Nếu là admin thì không lọc theo userId, lấy tất cả orders
        const query = user.role === 'ADMIN' ? {} : { userId: userId };

        const orderlist = await OrderModel.find(query)
            .sort({ createdAt: -1 })
            .populate({
                path: 'delivery_address',
                select: 'name mobile email address_line ward district province'
            })
            .populate({
                path: 'productId',
                select: 'name image price'
            });

        return response.json({
            message: "order list",
            data: orderlist,
            error: false,
            success: true
        })
    } catch (error) {
        console.error('Error in getOrderDetailsController:', error)
        return response.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false
        })
    }
}

export async function deleteOrderController(req, res) {
    try {
        const userId = req.userId;
        const { _id } = req.body;
        if (!_id) {
            return res.status(400).json({ message: "Provide order _id", error: true, success: false });
        }
        // Chỉ cho phép xóa đơn của chính mình
        const deleted = await OrderModel.deleteOne({ _id, userId });
        if (deleted.deletedCount === 0) {
            return res.status(404).json({ message: "Order not found or not allowed", error: true, success: false });
        }
        return res.json({ message: "Order deleted", error: false, success: true });
    } catch (error) {
        return res.status(500).json({ message: error.message || error, error: true, success: false });
    }
}
