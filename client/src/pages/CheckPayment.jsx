import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { handleAddItemCart } from "../store/cartProduct";
import { useGlobalContext } from "../provider/GlobalProvider";
import toast from "react-hot-toast";

function CheckPayment() {
    const searchParams = new URLSearchParams(useLocation().search);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { fetchCartItem, fetchOrder } = useGlobalContext();

    const [status, setStatus] = useState("loading");
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        (async () => {
            try {
                // Gọi API xác thực thanh toán
                const { data } = await axios.get(
                    `http://localhost:8080/api/order/check-payment?${searchParams.toString()}`
                );
                console.log("[CheckPayment] API response", data);

                if (data.success && data.order) {
                    setStatus("success");
                    setTitle("Thanh toán thành công");
                    setMessage("Cảm ơn bạn đã mua hàng. Đơn hàng của bạn sẽ được xử lý sớm nhất.");
                    dispatch(handleAddItemCart([]));
                    if (fetchCartItem) fetchCartItem();
                    if (fetchOrder) fetchOrder();
                    toast.success("Đặt hàng thành công!");
                } else {
                    // Check specific response codes
                    const responseCode = data.data?.vnp_ResponseCode || searchParams.get("vnp_ResponseCode");
                    
                    if (responseCode === "24") {
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
                setStatus("error");
                setTitle("Lỗi xử lý thanh toán");
                setMessage(error.response?.data?.message || "Không thể xác thực thanh toán. Vui lòng liên hệ hỗ trợ.");
                toast.error("Lỗi xử lý thanh toán");
            }
        })();
    }, [searchParams, dispatch, fetchCartItem, fetchOrder]);

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
