import ReviewModel from '../models/review.model.js';
import OrderModel from '../models/order.model.js';

// Submit review for an order
export const submitReviewController = async (req, res) => {
    try {
        const userId = req.userId;
        const { orderId, reviews } = req.body;

        if (!orderId || !reviews || !Array.isArray(reviews) || reviews.length === 0) {
            return res.status(400).json({
                message: "Provide orderId and reviews array",
                error: true,
                success: false
            });
        }

        // Validate reviews
        for (const review of reviews) {
            if (!review.productId || !review.rating || review.rating < 1 || review.rating > 5) {
                return res.status(400).json({
                    message: "Each review must have productId and rating (1-5)",
                    error: true,
                    success: false
                });
            }
        }

        // Get order to verify ownership and get orderId string
        const order = await OrderModel.findOne({ _id: orderId, userId: userId });
        if (!order) {
            return res.status(404).json({
                message: "Order not found or you don't have permission",
                error: true,
                success: false
            });
        }

        // Check if review already exists
        const existingReview = await ReviewModel.findOne({
            userId: userId,
            order_orderId: order.orderId
        });

        if (existingReview) {
            return res.status(400).json({
                message: "Bạn đã đánh giá đơn hàng này rồi",
                error: true,
                success: false
            });
        }

        // Create review
        const review = await ReviewModel.create({
            userId: userId,
            orderId: order._id,
            order_orderId: order.orderId,
            reviews: reviews
        });

        return res.json({
            message: "Đánh giá thành công",
            error: false,
            success: true,
            data: review
        });
    } catch (error) {
        console.error("Error submitting review:", error);
        
        // Handle duplicate key error (unique index violation)
        if (error.code === 11000) {
            return res.status(400).json({
                message: "Bạn đã đánh giá đơn hàng này rồi",
                error: true,
                success: false
            });
        }

        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

// Check if order has been reviewed
export const checkReviewController = async (req, res) => {
    try {
        const userId = req.userId;
        const { orderId } = req.query;

        if (!orderId) {
            return res.status(400).json({
                message: "Provide orderId",
                error: true,
                success: false
            });
        }

        // Get order to verify ownership and get orderId string
        const order = await OrderModel.findOne({ _id: orderId, userId: userId });
        if (!order) {
            return res.status(404).json({
                message: "Order not found or you don't have permission",
                error: true,
                success: false
            });
        }

        // Check if review exists
        const review = await ReviewModel.findOne({
            userId: userId,
            order_orderId: order.orderId
        });

        return res.json({
            message: review ? "Đơn hàng đã được đánh giá" : "Đơn hàng chưa được đánh giá",
            error: false,
            success: true,
            data: {
                reviewed: !!review,
                review: review || null
            }
        });
    } catch (error) {
        console.error("Error checking review:", error);
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

