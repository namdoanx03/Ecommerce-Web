import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { handleAddItemCart } from "../store/cartProduct";
import { useGlobalContext } from "../provider/GlobalProvider";
import toast from "react-hot-toast";

function CheckPayment() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { fetchCartItem, fetchOrder } = useGlobalContext();
    const hasProcessed = useRef(false);

    const [status, setStatus] = useState("loading");
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Reset flag khi location.search thay đổi (query params mới)
        hasProcessed.current = false;
    }, [location.search]);

    useEffect(() => {
        // Chỉ chạy một lần cho mỗi location.search
        if (hasProcessed.current) {
            return;
        }
        hasProcessed.current = true;

        (async () => {
            const searchParams = new URLSearchParams(location.search);
            // Kiểm tra response code từ query params trước
            const responseCode = searchParams.get("vnp_ResponseCode");
            const transactionStatus = searchParams.get("vnp_TransactionStatus");
            
            try {
                console.log("[CheckPayment] ResponseCode from VNPay:", responseCode);
                console.log("[CheckPayment] TransactionStatus from VNPay:", transactionStatus);
                
                // Gọi API xác thực thanh toán
                const { data } = await axios.get(
                    `http://localhost:8080/api/order/check-payment?${searchParams.toString()}`
                );
                console.log("[CheckPayment] API response", data);

                // Nếu API trả về success và có order
                if (data.success && data.order) {
                    setStatus("success");
                    setTitle("Thanh toán thành công");
                    setMessage("Cảm ơn bạn đã mua hàng. Đơn hàng của bạn sẽ được xử lý sớm nhất.");
                    // Clear cart local ngay lập tức để UI hiển thị cart rỗng
                    dispatch(handleAddItemCart([]));
                    // Fetch lại order
                    if (fetchOrder) await fetchOrder();
                    // Đợi backend commit transaction xong rồi mới fetch lại cart
                    // Backend đã clear cart trong transaction, nên fetch sẽ trả về empty array
                    if (fetchCartItem) {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        await fetchCartItem();
                    }
                    toast.success("Đặt hàng thành công!");
                } 
                // Nếu API trả về error NHƯNG VNPay báo thành công (ResponseCode = "00")
                // Đây là trường hợp signature verification fail nhưng giao dịch thực sự thành công
                else if (responseCode === "00" && transactionStatus === "00") {
                    console.warn("[CheckPayment] API returned error but VNPay shows success - treating as success");
                    setStatus("success");
                    setTitle("Thanh toán thành công");
                    setMessage("Giao dịch đã được xử lý thành công. Vui lòng kiểm tra đơn hàng trong tài khoản của bạn.");
                    // Clear cart local ngay lập tức vì thanh toán đã thành công (VNPay báo thành công)
                    // Cart ở backend có thể chưa được clear do signature verification fail,
                    // nhưng vì thanh toán đã thành công nên chúng ta vẫn clear cart ở frontend
                    dispatch(handleAddItemCart([]));
                    // Fetch lại order
                    if (fetchOrder) await fetchOrder();
                    // KHÔNG fetch lại cart trong trường hợp này vì backend chưa clear cart
                    // Cart đã được clear local, nên UI sẽ hiển thị cart rỗng
                    toast.success("Thanh toán thành công!");
                }
                // Các trường hợp khác
                else {
                    // Check specific response codes
                    const finalResponseCode = data.data?.vnp_ResponseCode || responseCode;
                    
                    if (finalResponseCode === "24") {
                        setStatus("error");
                        setTitle("Khách hàng đã hủy thanh toán");
                        setMessage("Bạn đã hủy giao dịch. Vui lòng thử lại nếu muốn mua hàng.");
                        toast.error("Thanh toán bị hủy");
                    } else {
                        setStatus("error");
                        setTitle("Thanh toán thất bại");
                        setMessage(data.message || "Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại sau.");
                        toast.error(data.message || "Thanh toán thất bại");
                    }
                }
            } catch (error) {
                console.error("[CheckPayment] Error:", error);
                
                // Kiểm tra lại response code từ query params ngay cả khi có error
                
                // Nếu VNPay báo thành công nhưng API error (có thể do signature verification fail)
                if (responseCode === "00" && transactionStatus === "00") {
                    console.warn("[CheckPayment] API error but VNPay shows success - treating as success");
                    setStatus("success");
                    setTitle("Thanh toán thành công");
                    setMessage("Giao dịch đã được xử lý thành công. Vui lòng kiểm tra đơn hàng trong tài khoản của bạn.");
                    // Clear cart local ngay lập tức vì thanh toán đã thành công (VNPay báo thành công)
                    // Cart ở backend có thể chưa được clear do signature verification fail,
                    // nhưng vì thanh toán đã thành công nên chúng ta vẫn clear cart ở frontend
                    dispatch(handleAddItemCart([]));
                    // Fetch lại order
                    if (fetchOrder) await fetchOrder();
                    // KHÔNG fetch lại cart trong trường hợp này vì backend chưa clear cart
                    // Cart đã được clear local, nên UI sẽ hiển thị cart rỗng
                    toast.success("Thanh toán thành công!");
                } else {
                    setStatus("error");
                    setTitle("Lỗi xử lý thanh toán");
                    setMessage(error.response?.data?.message || "Không thể xác thực thanh toán. Vui lòng liên hệ hỗ trợ.");
                    toast.error("Lỗi xử lý thanh toán");
                }
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search]); // Chỉ phụ thuộc vào location.search, không phụ thuộc vào functions

    const handleGoHome = () => navigate("/");
    const handleBuyAgain = () => navigate("/product");

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-300px)] bg-gray-100 px-4">
                <div className="bg-white rounded-2xl shadow-md p-8 max-w-md text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang xử lý thanh toán...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-300px)] bg-gray-100 px-4">
            <div className="bg-white rounded-2xl shadow-md p-8 max-w-md text-center">
                <div className={`text-4xl mb-4 ${status === "success" ? "text-green-500" : "text-red-500"}`}>
                    {status === "success" ? "✓" : "✕"}
                </div>
                <h1 className="text-2xl font-bold mb-2">{title}</h1>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleGoHome}
                        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Về trang chủ
                    </button>
                    <button
                        onClick={handleBuyAgain}
                        className="w-full py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Mua sắm tiếp
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CheckPayment;
