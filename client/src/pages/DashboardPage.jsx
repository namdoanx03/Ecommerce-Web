import { useEffect, useState } from "react";
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import UserAnalyticsChart from '../components/RevenueAnalyticsChart';
import OrdersBarChart from '../components/OrdersBarChart';
import VisitorsDonutChart from '../components/VisitorsDonutChart';
import DatePickerFilter from '../components/DatePickerFilter';
import { FiDollarSign, FiShoppingBag, FiPackage, FiUsers } from "react-icons/fi";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { Link } from "react-router-dom";

const DashboardPage = () => {
    const [summary, setSummary] = useState(null);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [bestSellingProducts, setBestSellingProducts] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({ startDate: null, endDate: null, filterType: null });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Prepare API params with date range if available
                const summaryParams = {};
                if (dateRange.startDate && dateRange.endDate) {
                    summaryParams.startDate = dateRange.startDate.toISOString();
                    summaryParams.endDate = dateRange.endDate.toISOString();
                }

                const [summaryRes, categoryRes, productRes] = await Promise.all([
                    Axios({ 
                        ...SummaryApi.dashboardSummary,
                        params: summaryParams
                    }),
                    Axios({ ...SummaryApi.getCategory }),
                    Axios({ ...SummaryApi.getProduct, data: { limit: 100 } })
                ]);

                if (summaryRes.data.success) {
                    const data = summaryRes.data.data;
                    setSummary(data);
                    // Set best selling products from API
                    if (data.bestSellingProducts && data.bestSellingProducts.length > 0) {
                        setBestSellingProducts(data.bestSellingProducts);
                    }
                    // Set recent orders from API
                    if (data.recentOrders && data.recentOrders.length > 0) {
                        setRecentOrders(data.recentOrders);
                    }
                }
                if (categoryRes.data.success) setCategories(categoryRes.data.data);
                if (productRes.data.success) {
                    setProducts(productRes.data.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [dateRange]);


    const formatNumber = (num) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const handleDateChange = (startDate, endDate, filterType) => {
        setDateRange({ startDate, endDate, filterType });
    };

    return (
        <div className='p-4 sm:p-6 bg-[#F8F8F8] min-h-screen overflow-x-hidden max-w-full'>
            {/* Date Filter Section */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Lọc dữ liệu theo thời gian</h2>
                </div>
                <DatePickerFilter onDateChange={handleDateChange} />
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {/* Total Revenue */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Tổng doanh thu</p>
                            <h3 className="text-2xl font-bold text-gray-800">
                                {loading ? '...' : formatCurrency(summary?.totalRevenue || 0)}
                            </h3>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                            <FiDollarSign className="text-green-600" size={24} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        {summary?.revenueChange !== undefined && (
                            <>
                                <div className={`flex items-center ${summary.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {summary.revenueChange >= 0 ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />}
                                    <span className="ml-1">{Math.abs(summary.revenueChange)}%</span>
                                </div>
                                <span className="text-gray-500">so với kỳ trước</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Total Orders */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Tổng đơn hàng</p>
                            <h3 className="text-2xl font-bold text-gray-800">
                                {loading ? '...' : (summary?.totalOrders || 0).toLocaleString()}
                            </h3>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                            <FiShoppingBag className="text-blue-600" size={24} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        {summary?.ordersChange !== undefined && (
                            <>
                                <div className={`flex items-center ${summary.ordersChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {summary.ordersChange >= 0 ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />}
                                    <span className="ml-1">{Math.abs(summary.ordersChange)}%</span>
                                </div>
                                <span className="text-gray-500">so với kỳ trước</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Total Products */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Tổng sản phẩm</p>
                            <h3 className="text-2xl font-bold text-gray-800">
                                {loading ? '...' : products.length}
                            </h3>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                            <FiPackage className="text-purple-600" size={24} />
                        </div>
                    </div>
                    <Link to="/dashboard/upload-product">
                        <button className="text-sm text-teal-600 font-medium hover:text-teal-700">
                            THÊM MỚI
                        </button>
                    </Link>
                </div>

                {/* Total Customers */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Tổng khách hàng</p>
                            <h3 className="text-2xl font-bold text-gray-800">
                                {loading ? '...' : formatNumber(summary?.totalUsers || 0)}
                            </h3>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
                            <FiUsers className="text-orange-600" size={24} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        {/* Customer change not available yet */}
                    </div>
                </div>
            </div>

            {/* Category Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Danh mục</h2>
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {categories.length > 0 ? (
                        categories.map((category, index) => (
                            <div
                                key={category._id || index}
                                className="flex-shrink-0 w-32 h-32 bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center border border-gray-200 hover:border-teal-300 transition-colors cursor-pointer"
                            >
                                <img
                                    src={category.icon || category.image || "https://via.placeholder.com/40"}
                                    alt={category.name}
                                    className="w-12 h-12 object-contain mb-2"
                                    onError={(e) => {
                                        e.target.src = "https://via.placeholder.com/40"
                                    }}
                                />
                                <span className="text-xs font-medium text-gray-700 text-center truncate w-full">
                                    {category.name}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">Không có danh mục nào</p>
                    )}
                </div>
            </div>

            {/* Charts Section - Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Revenue Report */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Báo cáo doanh thu</h2>
                    <UserAnalyticsChart data={summary?.revenueAnalytics} />
                </div>

                {/* Best Selling Product */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Sản phẩm bán chạy</h2>
                        <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-200">
                            <option>Hôm nay</option>
                            <option>Tuần này</option>
                            <option>Tháng này</option>
                        </select>
                    </div>
                    <div className="space-y-4">
                        {bestSellingProducts.map((product, index) => {
                            // Handle image - can be array or string
                            let productImage = '';
                            if (product.image) {
                                if (Array.isArray(product.image) && product.image.length > 0) {
                                    productImage = product.image[0];
                                } else if (typeof product.image === 'string' && product.image.trim() !== '') {
                                    productImage = product.image;
                                }
                            }
                            
                            return (
                            <div key={product._id || index} className="flex items-center gap-4 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                                    {productImage ? (
                                        <img
                                            src={productImage}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div className={`w-full h-full flex items-center justify-center bg-gray-100 ${productImage ? 'hidden' : ''}`}>
                                        <span className="text-xs text-gray-400 text-center px-1">Không có ảnh</span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-800 mb-1">{product.name}</h4>
                                    <p className="text-xs text-gray-500">
                                        {new Date(product.createdAt || Date.now()).toLocaleDateString('vi-VN', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-800">{formatCurrency(product.price || 0)}</p>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                        <span>Số lượng bán: {product.orders || 0}</span>
                                        <span>Tồn kho: {product.stock || 0}</span>
                                    </div>
                                    <p className="text-sm font-medium text-teal-600 mt-1">
                                        {formatCurrency(product.amount || 0)}
                                    </p>
                                </div>
                            </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Charts Section - Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Orders Bar Chart */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Đơn hàng theo ngày</h2>
                    <OrdersBarChart data={summary?.ordersByDay} />
                </div>

                {/* Payment Method Donut Chart */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Tỷ lệ đơn hàng theo phương thức thanh toán</h2>
                    <VisitorsDonutChart data={summary?.paymentMethodDistribution} />
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Đơn hàng gần đây</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Sắp xếp theo:</span>
                            <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-200">
                                <option>Hôm nay</option>
                                <option>Tuần này</option>
                                <option>Tháng này</option>
                            </select>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full table-fixed">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase w-[45%]">Sản phẩm</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase w-[25%]">Giá</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase w-[30%]">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {recentOrders.length > 0 ? (
                                    recentOrders.map((order) => {
                                        const orderStatusText = order.order_status === 'SUCCESS' 
                                            ? 'Đã hoàn thành' 
                                            : order.order_status === 'PENDING'
                                            ? 'Đang xử lý'
                                            : 'Đã hủy';
                                        
                                        return (
                                            <tr key={order._id} className="hover:bg-gray-50">
                                                <td className="py-3 px-4">
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium text-gray-800 truncate" title={order.first_product_name || 'N/A'}>
                                                            {order.first_product_name || 'N/A'}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1 truncate">
                                                            #{order.orderId?.split('-')[1]?.slice(0, 5) || order._id?.slice(-5)}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <p className="text-sm font-medium text-gray-800 whitespace-nowrap">
                                                        {formatCurrency(order.totalAmt || 0)}
                                                    </p>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className={`text-sm whitespace-nowrap ${
                                                        order.order_status === 'SUCCESS'
                                                            ? 'text-green-600' 
                                                            : order.order_status === 'PENDING'
                                                            ? 'text-yellow-600'
                                                            : 'text-red-600'
                                                    }`}>
                                                        {orderStatusText}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="py-8 text-center text-sm text-gray-500">
                                            Chưa có đơn hàng nào
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardPage;