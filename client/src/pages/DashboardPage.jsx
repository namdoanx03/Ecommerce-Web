import { useEffect, useState } from "react";
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import UserAnalyticsChart from '../components/RevenueAnalyticsChart';
import OrdersBarChart from '../components/OrdersBarChart';
import VisitorsDonutChart from '../components/VisitorsDonutChart';
import CategoryPieChart from '../components/CategoryPieChart';
import DatePickerFilter from '../components/DatePickerFilter';
import { FiDollarSign, FiShoppingBag, FiPackage, FiUsers } from "react-icons/fi";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { Link } from "react-router-dom";

const DashboardPage = () => {
    const [summary, setSummary] = useState(null);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [bestSellingProducts, setBestSellingProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({ startDate: null, endDate: null, filterType: null });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Prepare API params with date range if available
                const summaryParams = dateRange.startDate && dateRange.endDate
                    ? { 
                        startDate: dateRange.startDate.toISOString(),
                        endDate: dateRange.endDate.toISOString()
                      }
                    : {};

                const [summaryRes, categoryRes, productRes] = await Promise.all([
                    Axios({ 
                        ...SummaryApi.dashboardSummary,
                        params: summaryParams
                    }),
                    Axios({ ...SummaryApi.getCategory }),
                    Axios({ ...SummaryApi.getProduct, data: { limit: 100 } })
                ]);

                if (summaryRes.data.success) setSummary(summaryRes.data.data);
                if (categoryRes.data.success) setCategories(categoryRes.data.data);
                if (productRes.data.success) {
                    setProducts(productRes.data.data);
                    // Filter products by date range if available
                    let filteredProducts = productRes.data.data;
                    if (dateRange.startDate && dateRange.endDate) {
                        filteredProducts = productRes.data.data.filter(p => {
                            if (!p.createdAt) return false;
                            const productDate = new Date(p.createdAt);
                            return productDate >= dateRange.startDate && productDate <= dateRange.endDate;
                        });
                    }
                    // Mock best selling products - in real app, get from orders
                    const topProducts = filteredProducts.slice(0, 3).map((p, idx) => ({
                        ...p,
                        orders: 62 - idx * 5,
                        amount: (62 - idx * 5) * (p.price || 29)
                    }));
                    setBestSellingProducts(topProducts);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [dateRange]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatNumber = (num) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
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
                            <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                            <h3 className="text-2xl font-bold text-gray-800">
                                {loading ? '...' : formatCurrency(summary?.totalRevenue || 0)}
                            </h3>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                            <FiDollarSign className="text-green-600" size={24} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <div className="flex items-center text-green-600">
                            <FaArrowUp size={12} />
                            <span className="ml-1">8.5%</span>
                        </div>
                        <span className="text-gray-500">vs last month</span>
                    </div>
                </div>

                {/* Total Orders */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                            <h3 className="text-2xl font-bold text-gray-800">
                                {loading ? '...' : (summary?.totalOrders || 0).toLocaleString()}
                            </h3>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                            <FiShoppingBag className="text-blue-600" size={24} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <div className="flex items-center text-red-600">
                            <FaArrowDown size={12} />
                            <span className="ml-1">8.5%</span>
                        </div>
                        <span className="text-gray-500">vs last month</span>
                    </div>
                </div>

                {/* Total Products */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Total Products</p>
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
                            ADD NEW
                        </button>
                    </Link>
                </div>

                {/* Total Customers */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Total Customers</p>
                            <h3 className="text-2xl font-bold text-gray-800">
                                {loading ? '...' : formatNumber(summary?.totalUsers || 0)}
                            </h3>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
                            <FiUsers className="text-orange-600" size={24} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <div className="flex items-center text-red-600">
                            <FaArrowDown size={12} />
                            <span className="ml-1">8.5%</span>
                        </div>
                        <span className="text-gray-500">vs last month</span>
                    </div>
                </div>
            </div>

            {/* Category Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Category</h2>
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
                        <p className="text-sm text-gray-500">No categories available</p>
                    )}
                </div>
            </div>

            {/* Charts Section - Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Revenue Report */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Revenue Report</h2>
                    <UserAnalyticsChart />
                </div>

                {/* Best Selling Product */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Best Selling Product</h2>
                        <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-200">
                            <option>Today</option>
                            <option>This Week</option>
                            <option>This Month</option>
                        </select>
                    </div>
                    <div className="space-y-4">
                        {bestSellingProducts.map((product, index) => (
                            <div key={product._id || index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                <img
                                    src={product.image?.[0] || "https://via.placeholder.com/60"}
                                    alt={product.name}
                                    className="w-16 h-16 object-cover rounded-lg"
                                />
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
                                    <p className="font-semibold text-gray-800">{formatCurrency(product.price || 29)}</p>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                        <span>Orders: {product.orders}</span>
                                        <span>Stock: {product.stock || 510}</span>
                                    </div>
                                    <p className="text-sm font-medium text-teal-600 mt-1">
                                        {formatCurrency(product.amount || 1798)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Charts Section - Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Orders Bar Chart */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Orders by Day</h2>
                    <OrdersBarChart />
                </div>

                {/* Visitors Donut Chart */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Visitors</h2>
                    <VisitorsDonutChart />
                </div>

                {/* Category Pie Chart */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Sales by Category</h2>
                    <CategoryPieChart />
                </div>
            </div>
        </div>
    )
}

export default DashboardPage;