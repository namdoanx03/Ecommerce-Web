import mongoose from "mongoose";

const pendingOrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    orderId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    productId: [{
        type: mongoose.Schema.ObjectId,
        ref: 'product'
    }],
    product_details: [{
        name: {
            type: String,
            default: ""
        },
        qty: {
            type: Number,
            default: 1
        },
        price: {
            type: Number,
            default: 0
        },
        image: {
            type: String,
            default: ""
        },
        productId: {
            type: String,
            required: true
        }
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
        default: "VNPAY"
    },
    voucherId: {
        type: mongoose.Schema.ObjectId,
        ref: 'voucher',
        default: null
    },
    paymentId: {
        type: String,
        default: ""
    },
    // TTL index để tự động xóa sau 24 giờ nếu không được sử dụng
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // 24 hours in seconds
    }
}, {
    timestamps: true
});

// Index để tìm pending order nhanh hơn
pendingOrderSchema.index({ orderId: 1 });
pendingOrderSchema.index({ userId: 1 });
pendingOrderSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const PendingOrderModel = mongoose.model('pendingorder', pendingOrderSchema);

export default PendingOrderModel;

