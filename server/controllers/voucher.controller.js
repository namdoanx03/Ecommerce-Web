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

