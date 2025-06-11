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
    const { amount } = request.query;
    const tmnCode = "ADA1G5J9"; // Lấy từ VNPay .env
    const secretKey = "Z0AWA2O5YQUX6TR4I8MAHIYSAAFER6D7"; // Lấy từ VNPay
    const returnUrl = "http://localhost:5173/success"; // Trang kết quả
    const vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";

    let ipAddr = request.ip;
    let orderId = moment().format("YYYYMMDDHHmmss");
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
    response.json({ paymentUrl });
}

export async function checkPaymentController(request, response) {
    const query = request.query;
    const secretKey = "Z0AWA2O5YQUX6TR4I8MAHIYSAAFER6D7";
    const vnp_SecureHash = query.vnp_SecureHash;

    delete query.vnp_SecureHash;
    const signData = querystring.stringify(query);

    const hmac = crypto.createHmac("sha512", secretKey);
    const checkSum = hmac.update(signData).digest("hex");
    console.log(query);

    if (vnp_SecureHash === checkSum) {
        if (query.vnp_ResponseCode === "00") {
            response.json({ message: "Thanh toán thành công", data: query });
        } else {
            response.json({ message: "Thanh toán thất bại", data: query });
        }
    } else {
        response.status(400).json({ message: "Dữ liệu không hợp lệ" });
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
                name: el.productId.name
            })),
            paymentId: "",
            payment_status: "CASH ON DELIVERY",
            delivery_address: addressId,
            subTotalAmt: subTotalAmt,
            totalAmt: totalAmt,
        };

        const generatedOrder = await OrderModel.create(payload);

        ///remove from the cart
        const removeCartItems = await CartProductModel.deleteMany({ userId : userId })
        const updateInUser = await UserModel.updateOne({ _id : userId }, { shopping_cart : []})

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

export const pricewithDiscount = (price,dis = 1)=>{
    const discountAmout = Math.ceil((Number(price) * Number(dis)) / 100)
    const actualPrice = Number(price) - Number(discountAmout)
    return actualPrice
}

export async function paymentController(request,response){
    try {
        const userId = request.userId // auth middleware 
        const { list_items, totalAmt, addressId,subTotalAmt } = request.body 

        const user = await UserModel.findById(userId)

        const line_items  = list_items.map(item =>{
            return{
               price_data : {
                    currency : 'inr',
                    product_data : {
                        name : item.productId.name,
                        metadata : {
                            productId : item.productId._id
                        }
                    },
                    unit_amount : pricewithDiscount(item.productId.price,item.productId.discount) * 100   
               },
               adjustable_quantity : {
                    enabled : true,
                    minimum : 1
               },
               quantity : item.quantity 
            }
        })

        const params = {
            submit_type : 'pay',
            mode : 'payment',
            payment_method_types : ['card'],
            customer_email : user.email,
            metadata : {
                userId : userId,
                addressId : addressId
            },
            line_items : line_items,
            success_url : `${process.env.FRONTEND_URL}/success`,
            cancel_url : `${process.env.FRONTEND_URL}/cancel`
        }

        const session = await Stripe.checkout.sessions.create(params)

        return response.status(200).json(session)

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


const getOrderProductItems = async({
    lineItems,
    userId,
    addressId,
    paymentId,
    payment_status,
 })=>{
    const productList = []

    if(lineItems?.data?.length){
        for(const item of lineItems.data){
            const product = await Stripe.products.retrieve(item.price.product)

            const paylod = {
                userId : userId,
                orderId : `ORD-${new mongoose.Types.ObjectId()}`,
                productId : product.metadata.productId, 
                product_details : [{
                    name : product.name
                } ],
                paymentId : paymentId,
                payment_status : payment_status,
                delivery_address : addressId,
                subTotalAmt  : Number(item.amount_total / 100),
                totalAmt  :  Number(item.amount_total / 100),
            }

            productList.push(paylod)
        }
    }

    return productList
}

//http://localhost:8080/api/order/webhook
export async function webhookStripe(request,response){
    const event = request.body;
    const endPointSecret = process.env.STRIPE_ENPOINT_WEBHOOK_SECRET_KEY

    console.log("event",event)

    // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const lineItems = await Stripe.checkout.sessions.listLineItems(session.id)
      const userId = session.metadata.userId
      const orderProduct = await getOrderProductItems(
        {
            lineItems : lineItems,
            userId : userId,
            addressId : session.metadata.addressId,
            paymentId  : session.payment_intent,
            payment_status : session.payment_status,
        })
    
      const order = await OrderModel.insertMany(orderProduct)

        console.log(order)
        if(Boolean(order[0])){
            const removeCartItems = await  UserModel.findByIdAndUpdate(userId,{
                shopping_cart : []
            })
            const removeCartProductDB = await CartProductModel.deleteMany({ userId : userId})
        }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({received: true});
}


export async function getOrderDetailsController(request,response){
    try {
        const userId = request.userId // order id

        // Nếu là admin thì không lọc theo userId
        const query = request.user && request.user.role === 'admin' ? {} : { userId: userId };

        const orderlist = await OrderModel.find(query)
            .sort({ createdAt : -1 })
            .populate('delivery_address');

        return response.json({
            message : "order list",
            data : orderlist,
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}
