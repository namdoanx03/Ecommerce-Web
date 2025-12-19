import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, "Provide voucher code"],
        unique: true,
        uppercase: true,
        trim: true
    },
    name: {
        type: String,
        required: [true, "Provide voucher name"],
        default: ""
    },
    description: {
        type: String,
        default: ""
    },
    discount_type: {
        type: String,
        enum: ["PERCENTAGE", "FIXED_AMOUNT"],
        required: [true, "Provide discount type"],
        default: "PERCENTAGE"
    },
    discount_value: {
        type: Number,
        required: [true, "Provide discount value"],
        min: 0
    },
    min_purchase_amount: {
        type: Number,
        default: 0,
        min: 0
    },
    max_discount_amount: {
        type: Number,
        default: null,
        min: 0
    },
    start_date: {
        type: Date,
        required: [true, "Provide start date"]
    },
    end_date: {
        type: Date,
        required: [true, "Provide end date"]
    },
    usage_limit: {
        type: Number,
        default: null, // null means unlimited
        min: 1
    },
    used_count: {
        type: Number,
        default: 0,
        min: 0
    },
    status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE", "EXPIRED"],
        default: "ACTIVE"
    }
}, {
    timestamps: true
})

const VoucherModel = mongoose.model('voucher', voucherSchema)

export default VoucherModel

