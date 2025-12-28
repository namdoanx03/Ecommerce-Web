import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    orderId: {
        type: mongoose.Schema.ObjectId,
        ref: 'order',
        required: true
    },
    order_orderId: {
        type: String,
        required: true,
        index: true
    },
    reviews: [{
        productId: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            default: ""
        }
    }]
}, {
    timestamps: true
});

// Index to ensure one review per order per user
reviewSchema.index({ userId: 1, order_orderId: 1 }, { unique: true });

const ReviewModel = mongoose.model('review', reviewSchema);

export default ReviewModel;

