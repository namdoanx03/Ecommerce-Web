import UserModel from '../models/user.model.js';
import OrderModel from '../models/order.model.js';
import ProductModel from '../models/product.model.js';
import CategoryModel from '../models/category.model.js';
import mongoose from 'mongoose';

export async function getDashboardSummary(req, res) {
  try {
    const { startDate, endDate } = req.query;
    
    // Build date filter
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Calculate date range for comparison (previous period)
    let previousDateFilter = {};
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const periodLength = end - start;
      previousDateFilter.createdAt = {
        $gte: new Date(start - periodLength),
        $lt: start
      };
    } else {
      // Default: last 30 days vs previous 30 days
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
      dateFilter.createdAt = { $gte: thirtyDaysAgo, $lte: now };
      previousDateFilter.createdAt = { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo };
    }

    // Current period stats
    const [
      totalUsers,
      totalProducts,
      currentOrders,
      currentRevenueResult,
      currentNewOrders,
      currentOrdersList
    ] = await Promise.all([
      UserModel.countDocuments(),
      ProductModel.countDocuments(),
      OrderModel.countDocuments(dateFilter),
      OrderModel.aggregate([
        { $match: dateFilter },
        { $group: { _id: null, total: { $sum: "$totalAmt" } } }
      ]),
      OrderModel.countDocuments({ 
        ...dateFilter,
        createdAt: { $gte: new Date(new Date().setHours(0,0,0,0)) }
      }),
      OrderModel.find(dateFilter).select('createdAt totalAmt product_details').lean()
    ]);

    const currentRevenue = currentRevenueResult[0]?.total || 0;

    // Previous period stats (for comparison)
    const [
      previousOrders,
      previousRevenueResult
    ] = await Promise.all([
      OrderModel.countDocuments(previousDateFilter),
      OrderModel.aggregate([
        { $match: previousDateFilter },
        { $group: { _id: null, total: { $sum: "$totalAmt" } } }
      ])
    ]);

    const previousRevenue = previousRevenueResult[0]?.total || 0;

    // Calculate percentage changes
    const calculatePercentageChange = (current, previous) => {
      if (!previous || previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous * 100).toFixed(1);
    };

    const revenueChange = calculatePercentageChange(currentRevenue, previousRevenue);
    const ordersChange = calculatePercentageChange(currentOrders, previousOrders);

    // Orders by Day (last 7 days or within date range)
    let ordersByDayFilter = {};
    if (startDate && endDate) {
      ordersByDayFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      ordersByDayFilter.createdAt = { $gte: sevenDaysAgo };
    }

    const ordersByDay = await OrderModel.aggregate([
      { $match: ordersByDayFilter },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Format orders by day for chart
    const ordersByDayData = {
      labels: [],
      values: []
    };

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      const maxDays = Math.min(daysDiff, 30); // Limit to 30 days for performance
      
      for (let i = 0; i < maxDays; i++) {
        const date = new Date(start);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        const dayData = ordersByDay.find(d => d._id === dateStr);
        ordersByDayData.labels.push(date.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' }));
        ordersByDayData.values.push(dayData?.count || 0);
      }
    } else {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayData = ordersByDay.find(d => d._id === dateStr);
        ordersByDayData.labels.push(date.toLocaleDateString('vi-VN', { weekday: 'short' }));
        ordersByDayData.values.push(dayData?.count || 0);
      }
    }

    // Sales by Category - Use product_details instead since it's already denormalized
    const categorySalesMap = {};
    
    // Aggregate from order product_details
    const categorySalesFromOrders = await OrderModel.aggregate([
      { $match: dateFilter },
      { $unwind: "$product_details" },
      {
        $lookup: {
          from: "products",
          localField: "product_details.productId",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$product.category", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "categories",
          localField: "product.category",
          foreignField: "_id",
          as: "category"
        }
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$category._id",
          categoryName: { $first: "$category.name" },
          totalSales: { $sum: { $multiply: ["$product_details.price", "$product_details.qty"] } },
          orderCount: { $sum: 1 }
        }
      },
      { $match: { _id: { $ne: null } } },
      { $sort: { totalSales: -1 } },
      { $limit: 10 }
    ]);

    // If no category data, create a default "Others" category
    const categorySalesData = categorySalesFromOrders.length > 0 ? {
      labels: categorySalesFromOrders.map(c => c.categoryName || 'Khác'),
      values: categorySalesFromOrders.map(c => c.totalSales)
    } : {
      labels: ['Chưa có dữ liệu'],
      values: [0]
    };


    // Revenue Analytics (monthly data for last 6 months)
    let revenueAnalyticsFilter = {};
    if (startDate && endDate) {
      revenueAnalyticsFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      revenueAnalyticsFilter.createdAt = { $gte: sixMonthsAgo };
    }

    const revenueByMonth = await OrderModel.aggregate([
      { $match: revenueAnalyticsFilter },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m", date: "$createdAt" }
          },
          total: { $sum: "$totalAmt" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const revenueAnalyticsData = {
      labels: revenueByMonth.map(r => {
        const [year, month] = r._id.split('-');
        const date = new Date(year, month - 1);
        return date.toLocaleDateString('vi-VN', { month: 'short' });
      }),
      values: revenueByMonth.map(r => r.total)
    };

    // Best Selling Products (from orders)
    const bestSellingProductsAgg = await OrderModel.aggregate([
      { $match: dateFilter },
      { $unwind: "$product_details" },
      {
        $group: {
          _id: "$product_details.productId",
          productName: { $first: "$product_details.name" },
          productImage: { $first: "$product_details.image" },
          totalQuantity: { $sum: "$product_details.qty" },
          totalRevenue: { $sum: { $multiply: ["$product_details.price", "$product_details.qty"] } }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 3 }
    ]);

    // Enrich best selling products with product details
    const bestSellingProducts = await Promise.all(
      bestSellingProductsAgg.map(async (item) => {
        const product = await ProductModel.findById(item._id).select('price stock createdAt image').lean();
        
        // Get image - prefer from product_details, fallback to product model
        let productImage = null;
        if (item.productImage && typeof item.productImage === 'string' && item.productImage.trim() !== '') {
          productImage = item.productImage;
        } else if (product?.image) {
          if (Array.isArray(product.image) && product.image.length > 0) {
            productImage = product.image[0];
          } else if (typeof product.image === 'string' && product.image.trim() !== '') {
            productImage = product.image;
          }
        }
        
        return {
          _id: item._id,
          name: item.productName,
          image: productImage ? [productImage] : [],
          orders: item.totalQuantity,
          amount: item.totalRevenue,
          price: product?.price || 0,
          stock: product?.stock || 0,
          createdAt: product?.createdAt || new Date()
        };
      })
    );

    // Payment Method Distribution
    const paymentMethodStats = await OrderModel.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$payment_method",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Map payment method codes to Vietnamese names
    const paymentMethodMap = {
      'VNPAY': 'VNPay',
      'MOMO': 'MoMo',
      'CASH ON DELIVERY': 'Thanh toán khi nhận hàng',
      'PENDING': 'Chưa thanh toán',
      'SUCCESS': 'Đã thanh toán'
    };

    const paymentMethodData = {
      labels: paymentMethodStats.map(p => paymentMethodMap[p._id] || p._id || 'Khác'),
      values: paymentMethodStats.map(p => p.count)
    };

    // Recent Orders (last 4 orders)
    const recentOrdersRaw = await OrderModel.find(dateFilter)
      .sort({ createdAt: -1 })
      .limit(4)
      .populate('userId', 'name email')
      .populate('delivery_address')
      .select('orderId createdAt totalAmt payment_method order_status product_details')
      .lean();

    const recentOrdersData = recentOrdersRaw.map(order => ({
      _id: order._id,
      orderId: order.orderId,
      createdAt: order.createdAt,
      totalAmt: order.totalAmt,
      payment_method: paymentMethodMap[order.payment_method] || order.payment_method || 'Chưa xác định',
      order_status: order.order_status,
      product_count: order.product_details?.length || 0,
      customer_name: order.userId?.name || 'Khách hàng',
      first_product_name: order.product_details && order.product_details.length > 0 
        ? order.product_details[0].name 
        : 'N/A',
      address: order.delivery_address ? 
        `${order.delivery_address.address_line || ''}, ${order.delivery_address.ward || ''}, ${order.delivery_address.district || ''}`.trim() 
        : 'Chưa có địa chỉ'
    }));

    res.json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalOrders: currentOrders,
        totalRevenue: currentRevenue,
        newOrders: currentNewOrders,
        // Percentage changes
        revenueChange: parseFloat(revenueChange),
        ordersChange: parseFloat(ordersChange),
        // Charts data
        ordersByDay: ordersByDayData,
        categorySales: categorySalesData,
        revenueAnalytics: revenueAnalyticsData,
        bestSellingProducts,
        // Recent orders
        recentOrders: recentOrdersData,
        // Previous period data for reference
        previousRevenue,
        previousOrders,
        // Payment method distribution
        paymentMethodDistribution: paymentMethodData
      }
    });
  } catch (err) {
    console.error('Error in getDashboardSummary:', err);
    res.status(500).json({ success: false, message: err.message });
  }
} 