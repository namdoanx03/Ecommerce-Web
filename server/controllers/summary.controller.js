import UserModel from '../models/user.model.js';
import OrderModel from '../models/order.model.js';

export async function getDashboardSummary(req, res) {
  try {
    const [totalUsers, totalOrders, totalRevenue, newOrders] = await Promise.all([
      UserModel.countDocuments(),
      OrderModel.countDocuments(),
      OrderModel.aggregate([{ $group: { _id: null, total: { $sum: "$totalAmt" } } }]),
      OrderModel.countDocuments({ createdAt: { $gte: new Date(new Date().setHours(0,0,0,0)) } })
    ]);
    res.json({
      success: true,
      data: {
        totalUsers,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        newOrders
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
} 