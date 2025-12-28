import mongoose from "mongoose";

/**
 * Pending Order Model
 * Lưu thông tin đơn hàng tạm thời cho thanh toán online
 * Chỉ lưu khi chưa thanh toán thành công, sẽ được xóa sau khi tạo order thực sự
 */
const pendingOrderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: [true, "Provide orderId"],
        unique: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    productId: [{
        type: mongoose.Schema.ObjectId,
        ref: "product"
    }],
    product_details: [{
        name: String,
        qty: Number,
        price: Number,
        image: String,
        productId: String
    }],
    delivery_address: {
        type: mongoose.Schema.ObjectId,
        ref: 'address'
    },
    subTotalAmt: {
        type: Number,
        default: 0
    },
    totalAmt: {
        type: Number,
        default: 0
    },
    payment_method: {
        type: String,
        default: ""
    },
    paymentId: {
        type: String,
        default: "" // Tạm thời lưu payment gateway orderId (dùng cho MoMo)
    },
    voucherId: {
        type: mongoose.Schema.ObjectId,
        ref: 'voucher',
        default: null
    }
}, {
    timestamps: true
});

// TTL index để tự động xóa sau 24 giờ (cho trường hợp payment fail nhưng không có callback)
pendingOrderSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const PendingOrderModel = mongoose.model('pendingorder', pendingOrderSchema);

export default PendingOrderModel;

