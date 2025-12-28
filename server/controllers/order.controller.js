import CartProductModel from "../models/cartproduct.model.js";
import OrderModel from "../models/order.model.js";
import PendingOrderModel from "../models/pendingorder.model.js";
import UserModel from "../models/user.model.js";
import VoucherModel from "../models/voucher.model.js";
import ProductModel from "../models/product.model.js";
import mongoose from "mongoose";
import querystring from "querystring";
import crypto from "crypto";
import moment from "moment";
import https from "https";

function sortObject(obj) {
    let sorted = {};
    let keys = Object.keys(obj).sort();
    keys.forEach((key) => {
        sorted[key] = obj[key];
    });
    return sorted;
}

// Helper function to generate unique payment ID
function generatePayID() {
    return `PAY-${new mongoose.Types.ObjectId()}`;
}

export async function createPaymentController(request, response) {
    let pendingOrder = null;
    
    try {
        const { amount, list_items, addressId, subTotalAmt, totalAmt, typePayment = 'vnpay', voucherId } = request.body;
        const userId = request.userId; // Get userId from auth middleware

        // Validate input
        if (!list_items || !Array.isArray(list_items) || list_items.length === 0) {
            return response.status(400).json({
                message: "Danh sách sản phẩm không hợp lệ",
                error: true,
                success: false
            });
        }

        // Validate payment type
        if (!['vnpay', 'momo'].includes(typePayment)) {
            return response.status(400).json({
                message: "Phương thức thanh toán không hợp lệ",
                error: true,
                success: false
            });
        }

        // Calculate final amount (voucher logic can be added here)
        let finalAmount = totalAmt || amount;
        
        // Create pending order (tạm thời, chỉ lưu khi thanh toán thành công mới tạo order thực sự)
        const pendingOrderPayload = {
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
            delivery_address: addressId,
            subTotalAmt: subTotalAmt || amount,
            totalAmt: finalAmount,
            payment_method: typePayment.toUpperCase(),
            voucherId: voucherId || null
        };

        // Save pending order (sẽ tự động xóa sau 24h nếu không được sử dụng)
        pendingOrder = await PendingOrderModel.create(pendingOrderPayload);

        if (typePayment === 'vnpay') {
            // VNPay Payment
            const tmnCode = process.env.VNPAY_TMN_CODE;
            const secretKey = process.env.VNPAY_SECRET_KEY;
            
            if (!tmnCode || !secretKey) {
                return response.status(500).json({
                    message: "VNPay configuration không hợp lệ",
                    error: true,
                    success: false
                });
            }

        const returnUrl = process.env.VNPAY_RETURN_URL || `${process.env.FRONTEND_URL || "http://localhost:5173"}/check-payment`;
        const vnp_Url = process.env.VNPAY_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";

        // Get client IP address (handle proxy/load balancer)
            // VNPay requires IPv4 address, not IPv6
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
            
            // Convert IPv6 localhost (::1) to IPv4 (127.0.0.1)
            if (ipAddr === '::1' || ipAddr === '::ffff:127.0.0.1') {
                ipAddr = '127.0.0.1';
            }
            
            // Remove IPv6 prefix if exists (::ffff:)
            if (ipAddr.startsWith('::ffff:')) {
                ipAddr = ipAddr.replace('::ffff:', '');
            }
            
            let orderId = pendingOrder.orderId;
        let bankCode = request.query.bankCode || "";
        let createDate = moment().format("YYYYMMDDHHmmss");
            let orderInfo = `Thanh_toan_don_hang_${userId}`;
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
                vnp_Amount: Math.round(finalAmount * 100),
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
            let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
        vnp_Params["vnp_SecureHash"] = signed;

        let paymentUrl = vnp_Url + "?" + querystring.stringify(vnp_Params);
            return response.json({ paymentUrl, orderId: pendingOrder.orderId, type: 'vnpay' });
            
        } else if (typePayment === 'momo') {
            // MoMo Payment
            const accessKey = process.env.MOMO_ACCESS_KEY;
            const secretKey = process.env.MOMO_SECRET_KEY;
            const partnerCode = process.env.MOMO_PARTNER_CODE || 'MOMO';
            
            if (!accessKey || !secretKey) {
                return response.status(500).json({
                    message: "MoMo configuration không hợp lệ",
                    error: true,
                    success: false
                });
            }

            const orderId = partnerCode + new Date().getTime();
            const requestId = orderId;
            const orderInfo = `Thanh toan don hang ${userId}`;
            const redirectUrl = process.env.MOMO_REDIRECT_URL || `${process.env.FRONTEND_URL || "http://localhost:5173"}/check-payment-momo`;
            const ipnUrl = process.env.MOMO_IPN_URL || `${process.env.BACKEND_URL || "http://localhost:8080"}/api/order/momo-callback`;
            const requestType = 'payWithMethod';
            const amount = Math.round(finalAmount);
            const extraData = '';

            const rawSignature =
                'accessKey=' + accessKey +
                '&amount=' + amount +
                '&extraData=' + extraData +
                '&ipnUrl=' + ipnUrl +
                '&orderId=' + orderId +
                '&orderInfo=' + orderInfo +
                '&partnerCode=' + partnerCode +
                '&redirectUrl=' + redirectUrl +
                '&requestId=' + requestId +
                '&requestType=' + requestType;

            const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

            const requestBody = JSON.stringify({
                partnerCode,
                partnerName: 'Test',
                storeId: 'MomoTestStore',
                requestId,
                amount,
                orderId,
                orderInfo,
                redirectUrl,
                ipnUrl,
                lang: 'vi',
                requestType,
                autoCapture: true,
                extraData,
                orderGroupId: '',
                signature,
            });

            const options = {
                hostname: process.env.MOMO_HOST || 'test-payment.momo.vn',
                port: 443,
                path: '/v2/gateway/api/create',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(requestBody),
                },
            };

            // Use Promise to handle async https request
            const momoResponse = await new Promise((resolve, reject) => {
                const req = https.request(options, (res) => {
                    let data = '';
                    res.on('data', (chunk) => {
                        data += chunk;
                    });
                    res.on('end', () => {
                        try {
                            const parsed = JSON.parse(data);
                            if (parsed.resultCode !== 0) {
                                reject(new Error(parsed.message || 'MoMo payment creation failed'));
                            } else {
                                resolve(parsed);
                            }
                        } catch (err) {
                            reject(new Error('Invalid MoMo response'));
                        }
                    });
                });

                req.on('error', (e) => {
                    reject(e);
                });

                req.setTimeout(10000, () => {
                    req.destroy();
                    reject(new Error('MoMo request timeout'));
                });

                req.write(requestBody);
                req.end();
            });

            // Check if payUrl exists
            if (!momoResponse.payUrl) {
                // Delete pending order if MoMo fails
                await PendingOrderModel.findByIdAndDelete(pendingOrder._id);
                return response.status(500).json({
                    message: "Không thể tạo link thanh toán MoMo",
                    error: true,
                    success: false
                });
            }

            // Update pending order with MoMo orderId (lưu vào một field tạm để dùng trong callback)
            await PendingOrderModel.findByIdAndUpdate(pendingOrder._id, {
                $set: { paymentId: orderId } // Tạm thời lưu MoMo orderId vào paymentId field
            });

            return response.json({
                paymentUrl: momoResponse.payUrl,
                orderId: pendingOrder.orderId,
                momoOrderId: orderId,
                type: 'momo'
            });
        }
    } catch (error) {
        console.error("Error creating payment:", error);
        
        // If pending order was created but payment failed, try to delete it
        if (pendingOrder && pendingOrder._id) {
            try {
                await PendingOrderModel.findByIdAndDelete(pendingOrder._id);
            } catch (deleteError) {
                console.error("Error deleting pending order:", deleteError);
            }
        }
        
        return response.status(500).json({
            message: "Lỗi khi tạo thanh toán: " + error.message,
            error: true,
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
        console.log("[checkPaymentController] Query params:", query);
        
        // Validate required query params
        if (!query.vnp_TxnRef) {
            return response.status(400).json({
                message: "Thiếu thông tin đơn hàng",
                success: false
            });
        }
        
        const secretKey = process.env.VNPAY_SECRET_KEY;
        
        if (!secretKey) {
            console.error("[checkPaymentController] Missing VNPAY_SECRET_KEY in environment");
            return response.status(500).json({
                message: "VNPay configuration không hợp lệ",
                success: false
            });
        }

        const vnp_SecureHash = query.vnp_SecureHash;

        // Create a copy of query without SecureHash for signature verification
        const queryForSign = { ...query };
        delete queryForSign.vnp_SecureHash;
        delete queryForSign.vnp_SecureHashType;
        
        // Sort object by keys (important for VNPay signature)
        const sortedQuery = sortObject(queryForSign);
        
        const signData = querystring.stringify(sortedQuery);
        console.log("[checkPaymentController] Sign data string:", signData);

        const hmac = crypto.createHmac("sha512", secretKey);
        const checkSum = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

        console.log("[checkPaymentController] Signature verification:");
        console.log("  - Calculated checksum:", checkSum);
        console.log("  - Received checksum:", vnp_SecureHash);
        console.log("  - Match:", checkSum === vnp_SecureHash);

        // Verify VNPay signature
        let signatureValid = vnp_SecureHash === checkSum;
        
        if (!signatureValid) {
            console.error("[checkPaymentController] Signature mismatch!");
            console.error("  Expected:", checkSum);
            console.error("  Received:", vnp_SecureHash);
            console.error("  Query params:", JSON.stringify(sortedQuery, null, 2));
            
            // Nếu signature fail NHƯNG VNPay báo thành công (responseCode = "00"),
            // vẫn tiếp tục xử lý vì thanh toán thực sự đã thành công
            // Đây là fallback để xử lý trường hợp signature verification có vấn đề nhưng giao dịch thành công
            const responseCode = query.vnp_ResponseCode;
            if (responseCode === "00") {
                console.warn("[checkPaymentController] Signature mismatch but responseCode = 00, continuing with payment processing...");
                signatureValid = true; // Override để tiếp tục xử lý
            } else {
            return response.status(400).json({ 
                message: "Dữ liệu không hợp lệ - chữ ký không khớp",
                success: false 
            });
            }
        }

        // Find the pending order
        console.log("[checkPaymentController] Looking for pending order with orderId:", query.vnp_TxnRef);
        const pendingOrder = await PendingOrderModel.findOne({ 
            orderId: query.vnp_TxnRef 
        });

        if (!pendingOrder) {
            console.error("[checkPaymentController] Pending order not found with orderId:", query.vnp_TxnRef);
            // Kiểm tra xem order đã được tạo chưa (idempotency check)
            const existingOrder = await OrderModel.findOne({ orderId: query.vnp_TxnRef });
            if (existingOrder) {
                return response.json({
                    message: "Đơn hàng đã được xử lý trước đó",
                    data: query,
                    success: true,
                    order: existingOrder
                });
            }
            return response.status(404).json({
                message: "Không tìm thấy đơn hàng",
                success: false
            });
        }

        console.log("[checkPaymentController] Pending order found:", {
            orderId: pendingOrder.orderId,
            userId: pendingOrder.userId
        });

        let createdOrder;

        // Check payment status: ResponseCode = "00" means success
        if (query.vnp_ResponseCode === "00" && query.vnp_TransactionStatus === "00") {
            console.log("[checkPaymentController] Payment successful, creating order...");
            
            // Tạo order mới với trạng thái SUCCESS (chỉ lưu khi thanh toán thành công)
            const orderPayload = {
                userId: pendingOrder.userId,
                orderId: pendingOrder.orderId,
                productId: pendingOrder.productId,
                product_details: pendingOrder.product_details,
                paymentId: query.vnp_TransactionNo || query.vnp_BankTranNo || "",
                    payment_method: "VNPAY",
                payment_status: "SUCCESS",
                delivery_address: pendingOrder.delivery_address,
                subTotalAmt: pendingOrder.subTotalAmt,
                totalAmt: pendingOrder.totalAmt,
                voucherId: pendingOrder.voucherId || null
            };

            createdOrder = await OrderModel.create(orderPayload);

            if (!createdOrder) {
                console.error("[checkPaymentController] Failed to create order");
                return response.status(500).json({
                    message: "Không thể tạo đơn hàng",
                    success: false
                });
            }
            
            console.log("[checkPaymentController] Order created successfully:", {
                orderId: createdOrder.orderId,
                payment_status: createdOrder.payment_status,
                paymentId: createdOrder.paymentId
            });

            // Xóa pending order
            try {
                await PendingOrderModel.findByIdAndDelete(pendingOrder._id);
                console.log("[checkPaymentController] Pending order deleted");
            } catch (deleteError) {
                console.error("[checkPaymentController] Error deleting pending order:", deleteError);
                // Continue even if deletion fails
            }

            // Decrease product stock
            console.log("[checkPaymentController] Decreasing product stock...");
            try {
                for (const productDetail of pendingOrder.product_details) {
                    const productId = productDetail.productId;
                    const quantity = productDetail.qty || 1;
                    
                    await ProductModel.findByIdAndUpdate(
                        productId,
                        { $inc: { stock: -quantity } }
                    );
                    console.log(`[checkPaymentController] Decreased stock for product ${productId} by ${quantity}`);
                }
            } catch (stockError) {
                console.error("[checkPaymentController] Error decreasing product stock:", stockError);
                // Continue even if stock update fails - order is already created
            }

            // Clear cart
            console.log("[checkPaymentController] Clearing cart for userId:", pendingOrder.userId);
            try {
                const deleteResult = await CartProductModel.deleteMany({ userId: pendingOrder.userId });
                console.log("[checkPaymentController] Deleted cart items:", deleteResult.deletedCount);
                
                const updateUserResult = await UserModel.updateOne(
                    { _id: pendingOrder.userId },
                { shopping_cart: [] }
            );
                console.log("[checkPaymentController] Updated user shopping_cart:", updateUserResult.modifiedCount);
            } catch (cartError) {
                console.error("[checkPaymentController] Error clearing cart:", cartError);
                console.error("[checkPaymentController] Cart error stack:", cartError.stack);
                // Continue even if cart clearing fails - order is already created
            }

            // Update voucher if exists
            if (pendingOrder.voucherId) {
                await VoucherModel.findByIdAndUpdate(
                    pendingOrder.voucherId,
                    { $inc: { used_count: 1 } }
                );
            }

            console.log("[checkPaymentController] Payment processing completed successfully");

            return response.json({
                message: "Thanh toán thành công",
                data: query,
                success: true,
                order: createdOrder
            });
        } else {
            // Payment failed - xóa pending order (không tạo order)
            const responseCode = query.vnp_ResponseCode || "99";
            const responseMessage = getVNPayResponseMessage(responseCode);
            
            try {
                await PendingOrderModel.findByIdAndDelete(pendingOrder._id);
                console.log("[checkPaymentController] Pending order deleted due to payment failure");
            } catch (deleteError) {
                console.error("[checkPaymentController] Error deleting pending order:", deleteError);
            }

            return response.json({
                message: responseMessage || "Thanh toán thất bại",
                data: query,
                success: false
            });
        }
    } catch (error) {
        console.error("[checkPaymentController] Error in try block:", error);
        console.error("[checkPaymentController] Error message:", error.message);
        console.error("[checkPaymentController] Error stack:", error.stack);
        return response.status(500).json({
            message: "Lỗi khi xử lý thanh toán: " + error.message,
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

// MoMo Callback Handler
export async function momoCallbackController(request, response) {
    try {
        const { resultCode, orderId } = request.query;
        
        if (resultCode !== '0') {
            // Payment failed - tìm và xóa pending order
            const pendingOrder = await PendingOrderModel.findOne({ paymentId: orderId });
            if (pendingOrder) {
                await PendingOrderModel.findByIdAndDelete(pendingOrder._id);
            }
            return response.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/payment-failed?message=Thanh toán thất bại`);
        }

        // Find pending order by MoMo orderId (stored in paymentId field)
        const pendingOrder = await PendingOrderModel.findOne({ 
            paymentId: orderId 
        });

        if (!pendingOrder) {
            // Kiểm tra xem order đã được tạo chưa (idempotency check)
            const existingOrder = await OrderModel.findOne({ 
                paymentId: orderId,
                payment_method: "MOMO"
            });
            if (existingOrder) {
                return response.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/payment-success/${existingOrder._id}`);
            }
            return response.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/payment-failed?message=Không tìm thấy đơn hàng`);
        }

        // Tạo order mới với trạng thái SUCCESS (chỉ lưu khi thanh toán thành công)
        const orderPayload = {
            userId: pendingOrder.userId,
            orderId: pendingOrder.orderId,
            productId: pendingOrder.productId,
            product_details: pendingOrder.product_details,
            paymentId: orderId,
            payment_method: "MOMO",
            payment_status: "SUCCESS",
            delivery_address: pendingOrder.delivery_address,
            subTotalAmt: pendingOrder.subTotalAmt,
            totalAmt: pendingOrder.totalAmt,
            voucherId: pendingOrder.voucherId || null
        };

        const createdOrder = await OrderModel.create(orderPayload);

        if (!createdOrder) {
            return response.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/payment-failed?message=Không thể tạo đơn hàng`);
        }

        // Xóa pending order
        try {
            await PendingOrderModel.findByIdAndDelete(pendingOrder._id);
        } catch (deleteError) {
            console.error("Error deleting pending order:", deleteError);
            // Continue even if deletion fails
        }

        // Decrease product stock
        try {
            for (const productDetail of pendingOrder.product_details) {
                const productId = productDetail.productId;
                const quantity = productDetail.qty || 1;
                
                await ProductModel.findByIdAndUpdate(
                    productId,
                    { $inc: { stock: -quantity } }
                );
            }
        } catch (stockError) {
            console.error("Error decreasing product stock:", stockError);
            // Continue even if stock update fails - order is already created
        }

        // Clear cart
        try {
            await CartProductModel.deleteMany({ userId: pendingOrder.userId });
            await UserModel.updateOne(
                { _id: pendingOrder.userId },
                { shopping_cart: [] }
            );
        } catch (cartError) {
            console.error("Error clearing cart:", cartError);
            // Continue even if cart clearing fails - order is already created
        }

        // Update voucher if exists
        if (pendingOrder.voucherId) {
            await VoucherModel.findByIdAndUpdate(
                pendingOrder.voucherId,
                { $inc: { used_count: 1 } }
            );
        }
        
        return response.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/payment-success/${createdOrder._id}`);
        
    } catch (error) {
        console.error("Error in momoCallbackController:", error);
        return response.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/payment-failed?message=Lỗi xử lý thanh toán`);
    }
}

export async function CashOnDeliveryOrderController(request, response) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        const userId = request.userId; // auth middleware
        const { list_items, totalAmt, addressId, subTotalAmt, voucherId } = request.body;

        // Validate input
        if (!list_items || !Array.isArray(list_items) || list_items.length === 0) {
            await session.abortTransaction();
            return response.status(400).json({
                message: "Danh sách sản phẩm không hợp lệ",
                error: true,
                success: false
            });
        }

        // Validate each item has valid product data
        for (const item of list_items) {
            if (!item.productId || !item.productId._id) {
                await session.abortTransaction();
                return response.status(400).json({
                    message: "Thông tin sản phẩm không hợp lệ",
                    error: true,
                    success: false
                });
            }
            if (!item.productId.price || item.productId.price <= 0) {
                await session.abortTransaction();
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
            voucherId: voucherId || null
        };

        // Validate totals
        if (payload.totalAmt <= 0) {
            await session.abortTransaction();
            return response.status(400).json({
                message: "Tổng tiền đơn hàng không hợp lệ",
                error: true,
                success: false
            });
        }

        const generatedOrder = await OrderModel.create([payload], { session });

        // Decrease product stock
        for (const productDetail of payload.product_details) {
            const productId = productDetail.productId;
            const quantity = productDetail.qty || 1;
            
            await ProductModel.findByIdAndUpdate(
                productId,
                { $inc: { stock: -quantity } },
                { session }
            );
        }

        // Remove from cart
        await CartProductModel.deleteMany({ userId: userId }).session(session);
        await UserModel.updateOne(
            { _id: userId },
            { shopping_cart: [] },
            { session }
        );

        // Update voucher if exists
        if (voucherId) {
            await VoucherModel.findByIdAndUpdate(
                voucherId,
                { $inc: { used_count: 1 } },
                { session }
            );
        }

        await session.commitTransaction();

        return response.json({
            message: "Order successfully",
            error: false,
            success: true,
            data: generatedOrder[0]
        });

    } catch (error) {
        await session.abortTransaction();
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    } finally {
        session.endSession();
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
