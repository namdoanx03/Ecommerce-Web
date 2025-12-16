import Stripe from "../config/stripe.js";
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
            product_details: list_items.map(el => ({
                name: el.productId.name
            })),
            paymentId: "",
            payment_status: "PENDING",
            delivery_address: addressId,
            subTotalAmt: subTotalAmt,
            totalAmt: totalAmt,
        };

        // Save temporary order
        const tempOrder = await OrderModel.create(orderPayload);

        const tmnCode = "ADA1G5J9"; // Lấy từ VNPay .env
        const secretKey = "Z0AWA2O5YQUX6TR4I8MAHIYSAAFER6D7"; // Lấy từ VNPay
        const returnUrl = "http://localhost:5173/check-payment"; // Trang kết quả
        const vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";

        let ipAddr = request.ip;
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
        const secretKey = "Z0AWA2O5YQUX6TR4I8MAHIYSAAFER6D7";
        const vnp_SecureHash = query.vnp_SecureHash;

        delete query.vnp_SecureHash;
        const signData = querystring.stringify(query);

        const hmac = crypto.createHmac("sha512", secretKey);
        const checkSum = hmac.update(signData).digest("hex");
        console.log("Query from VNPay:", query);

        // Verify VNPay signature
        if (vnp_SecureHash !== checkSum) {
            return response.status(400).json({ 
                message: "Dữ liệu không hợp lệ",
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

        if (query.vnp_ResponseCode === "00") {
            // Update order status to success
            updatedOrder = await OrderModel.findOneAndUpdate(
                { 
                    _id: order._id,
                    payment_status: "PENDING"
                },
                {
                    paymentId: query.vnp_TransactionNo,
                    payment_status: "VNPAY"
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
            updatedOrder = await OrderModel.findOneAndUpdate(
                { 
                    _id: order._id,
                    payment_status: "PENDING"
                },
                {
                    payment_status: "FAILED",
                    paymentId: query.vnp_TransactionNo
                },
                { new: true }
            );

            return response.json({
                message: "Thanh toán thất bại",
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

export async function CashOnDeliveryOrderController(request, response) {
    try {
        const userId = request.userId; // auth middleware
        const { list_items, totalAmt, addressId, subTotalAmt } = request.body;

        // Tạo 1 order duy nhất chứa nhiều sản phẩm
        const payload = {
            userId: userId,
            orderId: `ORD-${new mongoose.Types.ObjectId()}`,
            productId: list_items.map(el => el.productId._id),
            product_details: list_items.map(el => ({
                name: el.productId.name,
                qty: el.qty || 1,
                price: el.productId.price || 0,
                image: el.productId.image && el.productId.image[0] ? el.productId.image[0] : '',
                productId: el.productId._id.toString()
            })),
            paymentId: "",
            payment_status: "CASH ON DELIVERY",
            delivery_address: addressId,
            subTotalAmt: subTotalAmt,
            totalAmt: totalAmt,
        };

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

export const pricewithDiscount = (price, dis = 1) => {
    const discountAmout = Math.ceil((Number(price) * Number(dis)) / 100)
    const actualPrice = Number(price) - Number(discountAmout)
    return actualPrice
}

export async function paymentController(request, response) {
    try {
        const userId = request.userId // auth middleware 
        const { list_items, totalAmt, addressId, subTotalAmt } = request.body

        const user = await UserModel.findById(userId)

        const line_items = list_items.map(item => {
            return {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: item.productId.name,
                        metadata: {
                            productId: item.productId._id
                        }
                    },
                    unit_amount: pricewithDiscount(item.productId.price, item.productId.discount) * 100
                },
                adjustable_quantity: {
                    enabled: true,
                    minimum: 1
                },
                quantity: item.quantity
            }
        })

        const params = {
            submit_type: 'pay',
            mode: 'payment',
            payment_method_types: ['card'],
            customer_email: user.email,
            metadata: {
                userId: userId,
                addressId: addressId
            },
            line_items: line_items,
            success_url: `${process.env.FRONTEND_URL}/success`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`
        }

        const session = await Stripe.checkout.sessions.create(params)

        return response.status(200).json(session)

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

const getOrderProductItems = async ({
    lineItems,
    userId,
    addressId,
    paymentId,
    payment_status,
}) => {
    if (!lineItems?.data?.length) return [];

    const productDetails = [];
    let totalAmount = 0;

    for (const item of lineItems.data) {
        const product = await Stripe.products.retrieve(item.price.product);
        productDetails.push({
            name: product.name,
            productId: product.metadata.productId,
            quantity: item.quantity,
            price: item.amount_total / 100
        });
        totalAmount += item.amount_total;
    }

    return [{
        userId: userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        productId: productDetails.map(p => p.productId),
        product_details: productDetails,
        paymentId: paymentId,
        payment_status: payment_status,
        delivery_address: addressId,
        subTotalAmt: totalAmount / 100,
        totalAmt: totalAmount / 100,
    }];
}

//http://localhost:8080/api/order/webhook
export async function webhookStripe(request, response) {
    const event = request.body;
    const endPointSecret = process.env.STRIPE_ENPOINT_WEBHOOK_SECRET_KEY

    console.log("event", event)

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            const lineItems = await Stripe.checkout.sessions.listLineItems(session.id)
            const userId = session.metadata.userId
            const orderProduct = await getOrderProductItems(
                {
                    lineItems: lineItems,
                    userId: userId,
                    addressId: session.metadata.addressId,
                    paymentId: session.payment_intent,
                    payment_status: session.payment_status,
                })

            const order = await OrderModel.insertMany(orderProduct)

            console.log(order)
            if (Boolean(order[0])) {
                const removeCartItems = await UserModel.findByIdAndUpdate(userId, {
                    shopping_cart: []
                })
                const removeCartProductDB = await CartProductModel.deleteMany({ userId: userId })
            }
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    response.json({ received: true });
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
