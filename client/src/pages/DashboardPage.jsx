import { HiUserGroup } from "react-icons/hi2";
import UserAnalyticsChart from '../components/RevenueAnalyticsChart';
import TopProductsDoughnutChart from '../components/TopProductsDoughnutChart';
import { FiCreditCard, FiShoppingCart, FiMessageCircle } from "react-icons/fi";

const DashboardPage = () => {
    return (
        <>
        <div className='dashboard px-2 bg-[#F8F8F8] min-h-[88vh]'>
            <h1 className="pt-3 pl-4 text-2xl font-semibold text-black sticky top-0">Thống kê</h1>
            <div className="card-item flex flex-wrap gap-6 mt-3 px-4">
              {/* Total customers */}
              <div className="flex-1 min-w-[220px] max-w-xs bg-white rounded-xl shadow p-6 flex items-center gap-4">
                <span className="flex items-center justify-center w-14 h-14 rounded-full bg-orange-50">
                  <HiUserGroup className="text-2xl text-orange-500" />
                </span>
                <div>
                  <div className="text-sm text-gray-500 font-medium mb-1">Tổng số khách hàng</div>
                  <div className="text-2xl font-semibold text-gray-800">765</div>
                </div>
              </div>
              {/* Total income */}
              <div className="flex-1 min-w-[220px] max-w-xs bg-white rounded-xl shadow p-6 flex items-center gap-4">
                <span className="flex items-center justify-center w-14 h-14 rounded-full bg-green-50">
                  <FiCreditCard className="text-2xl text-green-600" />
                </span>
                <div>
                  <div className="text-sm text-gray-500 font-medium mb-1">Tổng số doanh thu</div>
                  <div className="text-2xl font-semibold text-gray-800">$ 6,760.89</div>
                </div>
              </div>
              {/* New Orders */}
              <div className="flex-1 min-w-[220px] max-w-xs bg-white rounded-xl shadow p-6 flex items-center gap-4">
                <span className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-50">
                  <FiShoppingCart className="text-2xl text-blue-500" />
                </span>
                <div>
                  <div className="text-sm text-gray-500 font-medium mb-1">Đơn hàng mới</div>
                  <div className="text-2xl font-semibold text-gray-800">150</div>
                </div>
              </div>
              {/* Unread Chats */}
              <div className="flex-1 min-w-[220px] max-w-xs bg-white rounded-xl shadow p-6 flex items-center gap-4">
                <span className="flex items-center justify-center w-14 h-14 rounded-full bg-cyan-50">
                  <FiMessageCircle className="text-2xl text-cyan-600" />
                </span>
                <div>
                  <div className="text-sm text-gray-500 font-medium mb-1">Unread Chats</div>
                  <div className="text-2xl font-semibold text-gray-800">15</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6  px-4">
              <UserAnalyticsChart />
              <TopProductsDoughnutChart />
            </div>
          </div>
        </>
    )
}

export default DashboardPage;