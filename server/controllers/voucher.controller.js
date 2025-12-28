import VoucherModel from "../models/voucher.model.js";

export const createVoucherController = async (request, response) => {
    try {
        const {
            code,
            name,
            description,
            discount_type,
            discount_value,
            min_purchase_amount,
            max_discount_amount,
            start_date,
            end_date,
            usage_limit,
            status
        } = request.body;

        // Validation
        if (!code || !name || !discount_type || !discount_value || !start_date || !end_date) {
            return response.status(400).json({
                message: "Vui lòng điền đầy đủ các trường bắt buộc",
                error: true,
                success: false
            });
        }

        // Validate discount value
        if (discount_type === "PERCENTAGE" && (discount_value < 0 || discount_value > 100)) {
            return response.status(400).json({
                message: "Giá trị giảm giá phần trăm phải từ 0 đến 100",
                error: true,
                success: false
            });
        }

        if (discount_type === "FIXED_AMOUNT" && discount_value < 0) {
            return response.status(400).json({
                message: "Giá trị giảm giá cố định phải lớn hơn 0",
                error: true,
                success: false
            });
        }

        // Validate dates
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);
        if (endDate <= startDate) {
            return response.status(400).json({
                message: "Ngày kết thúc phải sau ngày bắt đầu",
                error: true,
                success: false
            });
        }

        // Check if code already exists
        const existingVoucher = await VoucherModel.findOne({ code: code.toUpperCase() });
        if (existingVoucher) {
            return response.status(400).json({
                message: "Mã voucher đã tồn tại",
                error: true,
                success: false
            });
        }

        const newVoucher = new VoucherModel({
            code: code.toUpperCase(),
            name,
            description: description || "",
            discount_type,
            discount_value,
            min_purchase_amount: min_purchase_amount || 0,
            max_discount_amount: max_discount_amount || null,
            start_date: startDate,
            end_date: endDate,
            usage_limit: usage_limit || null,
            status: status || "ACTIVE"
        });

        const savedVoucher = await newVoucher.save();

        if (!savedVoucher) {
            return response.status(500).json({
                message: "Không thể tạo voucher",
                error: true,
                success: false
            });
        }

        return response.json({
            message: "Tạo voucher thành công",
            data: savedVoucher,
            success: true,
            error: false
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export const getVouchersController = async (request, response) => {
    try {
        const vouchers = await VoucherModel.find().sort({ createdAt: -1 });

        // Update status based on dates
        const now = new Date();
        for (let voucher of vouchers) {
            if (voucher.end_date < now && voucher.status !== "EXPIRED") {
                await VoucherModel.updateOne(
                    { _id: voucher._id },
                    { status: "EXPIRED" }
                );
                voucher.status = "EXPIRED";
            }
        }

        return response.json({
            data: vouchers,
            error: false,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

// Validate voucher code and calculate discount
export const validateVoucherController = async (request, response) => {
    try {
        const { code, totalAmount } = request.body;
        const userId = request.userId || null; // Optional: for future user-specific vouchers

        if (!code) {
            return response.status(400).json({
                message: "Vui lòng nhập mã giảm giá",
                error: true,
                success: false
            });
        }

        if (totalAmount === undefined || totalAmount === null || totalAmount < 0) {
            return response.status(400).json({
                message: "Tổng tiền không hợp lệ",
                error: true,
                success: false
            });
        }

        // Find voucher by code
        const voucher = await VoucherModel.findOne({ code: code.toUpperCase().trim() });

        if (!voucher) {
            return response.status(404).json({
                message: "Mã giảm giá không tồn tại",
                error: true,
                success: false
            });
        }

        // Check voucher status
        if (voucher.status !== "ACTIVE") {
            return response.status(400).json({
                message: "Mã giảm giá không còn hiệu lực",
                error: true,
                success: false
            });
        }

        // Check date validity
        const now = new Date();
        const startDate = new Date(voucher.start_date);
        const endDate = new Date(voucher.end_date);

        if (now < startDate) {
            return response.status(400).json({
                message: "Mã giảm giá chưa có hiệu lực",
                error: true,
                success: false
            });
        }

        if (now > endDate) {
            // Update status to EXPIRED
            await VoucherModel.updateOne(
                { _id: voucher._id },
                { status: "EXPIRED" }
            );
            return response.status(400).json({
                message: "Mã giảm giá đã hết hạn",
                error: true,
                success: false
            });
        }

        // Check usage limit
        if (voucher.usage_limit !== null && voucher.used_count >= voucher.usage_limit) {
            return response.status(400).json({
                message: "Mã giảm giá đã hết lượt sử dụng",
                error: true,
                success: false
            });
        }

        // Check minimum purchase amount
        if (totalAmount < voucher.min_purchase_amount) {
            return response.status(400).json({
                message: `Đơn hàng phải có giá trị tối thiểu ${voucher.min_purchase_amount.toLocaleString()} đ để sử dụng mã này`,
                error: true,
                success: false
            });
        }

        // Calculate discount amount
        let discountAmount = 0;
        if (voucher.discount_type === "PERCENTAGE") {
            discountAmount = (totalAmount * voucher.discount_value) / 100;
            // Apply max discount if exists
            if (voucher.max_discount_amount !== null && discountAmount > voucher.max_discount_amount) {
                discountAmount = voucher.max_discount_amount;
            }
        } else if (voucher.discount_type === "FIXED_AMOUNT") {
            discountAmount = voucher.discount_value;
            // Don't allow discount more than total amount
            if (discountAmount > totalAmount) {
                discountAmount = totalAmount;
            }
        }

        const finalAmount = Math.max(0, totalAmount - discountAmount);

        return response.json({
            message: "Áp dụng mã giảm giá thành công",
            data: {
                voucher: {
                    _id: voucher._id,
                    code: voucher.code,
                    name: voucher.name,
                    description: voucher.description,
                    discount_type: voucher.discount_type,
                    discount_value: voucher.discount_value,
                    min_purchase_amount: voucher.min_purchase_amount,
                    max_discount_amount: voucher.max_discount_amount
                },
                discountAmount: discountAmount,
                totalAmount: totalAmount,
                finalAmount: finalAmount
            },
            error: false,
            success: true
        });
    } catch (error) {
        console.error("Error validating voucher:", error);
        return response.status(500).json({
            message: error.message || "Lỗi khi xử lý mã giảm giá",
            error: true,
            success: false
        });
    }
};

export const updateVoucherController = async (request, response) => {
    try {
        const {
            _id,
            code,
            name,
            description,
            discount_type,
            discount_value,
            min_purchase_amount,
            max_discount_amount,
            start_date,
            end_date,
            usage_limit,
            status
        } = request.body;

        if (!_id) {
            return response.status(400).json({
                message: "Vui lòng cung cấp ID voucher",
                error: true,
                success: false
            });
        }

        // Validate discount value
        if (discount_type === "PERCENTAGE" && (discount_value < 0 || discount_value > 100)) {
            return response.status(400).json({
                message: "Giá trị giảm giá phần trăm phải từ 0 đến 100",
                error: true,
                success: false
            });
        }

        if (discount_type === "FIXED_AMOUNT" && discount_value < 0) {
            return response.status(400).json({
                message: "Giá trị giảm giá cố định phải lớn hơn 0",
                error: true,
                success: false
            });
        }

        // Validate dates
        if (start_date && end_date) {
            const startDate = new Date(start_date);
            const endDate = new Date(end_date);
            if (endDate <= startDate) {
                return response.status(400).json({
                    message: "Ngày kết thúc phải sau ngày bắt đầu",
                    error: true,
                    success: false
                });
            }
        }

        // Check if code already exists (excluding current voucher)
        if (code) {
            const existingVoucher = await VoucherModel.findOne({
                code: code.toUpperCase(),
                _id: { $ne: _id }
            });
            if (existingVoucher) {
                return response.status(400).json({
                    message: "Mã voucher đã tồn tại",
                    error: true,
                    success: false
                });
            }
        }

        const updateData = {};
        if (code) updateData.code = code.toUpperCase();
        if (name) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (discount_type) updateData.discount_type = discount_type;
        if (discount_value !== undefined) updateData.discount_value = discount_value;
        if (min_purchase_amount !== undefined) updateData.min_purchase_amount = min_purchase_amount;
        if (max_discount_amount !== undefined) updateData.max_discount_amount = max_discount_amount;
        if (start_date) updateData.start_date = new Date(start_date);
        if (end_date) updateData.end_date = new Date(end_date);
        if (usage_limit !== undefined) updateData.usage_limit = usage_limit;
        if (status) updateData.status = status;

        const updatedVoucher = await VoucherModel.updateOne(
            { _id: _id },
            { $set: updateData }
        );

        return response.json({
            message: "Cập nhật voucher thành công",
            success: true,
            error: false,
            data: updatedVoucher
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export const deleteVoucherController = async (request, response) => {
    try {
        const { _id } = request.body;

        if (!_id) {
            return response.status(400).json({
                message: "Vui lòng cung cấp ID voucher",
                error: true,
                success: false
            });
        }

        const deletedVoucher = await VoucherModel.deleteOne({ _id: _id });

        return response.json({
            message: "Xóa voucher thành công",
            data: deletedVoucher,
            error: false,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        });
    }
};

