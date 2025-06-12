import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { handleAddItemCart } from "../store/cartProduct";
import { useGlobalContext } from "../provider/GlobalProvider";

function CheckPayment() {
    const searchParams = new URLSearchParams(useLocation().search);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { fetchCartItem } = useGlobalContext();

    const [status, setStatus] = useState("loading");
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        (async () => {
            try {
                // Lấy lại toàn bộ thông tin đơn hàng tạm từ localStorage
                const orderInfo = JSON.parse(localStorage.getItem("order_info_temp") || "{}");
                console.log("[CheckPayment] Lấy lại order_info_temp:", orderInfo);
                const { list_items, addressId, subTotalAmt, totalAmt } = orderInfo;

                // Gọi API xác thực thanh toán
                const { data } = await axios.post(
                    `http://localhost:8080/api/order/check-payment?${searchParams.toString()}`,
                    {
                        list_items,
                        addressId,
                        subTotalAmt,
                        totalAmt,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );
                console.log("[CheckPayment] API response", data);
                if (data.success && data.order) {
                    setStatus("success");
                    setTitle("Thanh toán thành công");
                    setMessage("Cảm ơn bạn đã mua hàng. Đơn hàng của bạn sẽ được xử lý sớm nhất.");
                    dispatch(handleAddItemCart([]));
                    fetchCartItem && fetchCartItem();
                    // Xóa dữ liệu tạm
                    localStorage.removeItem("order_info_temp");
                } else if (data.data?.vnp_ResponseCode === "24") {
                    setStatus("error");
                    setTitle("Khách hàng đã hủy thanh toán");
                    setMessage("Bạn đã hủy giao dịch. Vui lòng thử lại nếu muốn mua hàng.");
                } else {
                    setStatus("error");
                    setTitle("Thanh toán thất bại");
                    setMessage(data.message || "Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại sau.");
                }
            } catch (error) {
                setStatus("error");
                setTitle("Đã xảy ra lỗi khi kiểm tra thanh toán");
                setMessage(error?.response?.data?.message || "Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại sau.");
                console.log("[CheckPayment] Lỗi khi xác thực thanh toán", error, error?.response?.data);
            }
        })();
    }, [searchParams, dispatch, fetchCartItem]);

    const handleGoHome = () => navigate("/");
    const handleBuyAgain = () => navigate("/products");

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
                <div className="mb-4">
                    {status === "success" ? (
                        <svg className="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="mx-auto h-16 w-16 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    )}
                </div>
                <h2 className="text-2xl font-semibold mb-2">{title}</h2>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex justify-center gap-4">
                    <button onClick={handleGoHome} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow">Về trang chủ</button>
                    <button onClick={handleBuyAgain} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg shadow">Mua tiếp</button>
                </div>
            </div>
        </div>
    );
}

export default CheckPayment;
