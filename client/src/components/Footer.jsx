import React from 'react'
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaPinterestP } from "react-icons/fa";
import { CiHome, CiMail } from "react-icons/ci";
import { IoCallOutline } from "react-icons/io5";
import logo from '../assets/logo.png'

const Footer = () => {
    return (
        <footer className=" border-t pt-8 pb-4 text-neutral-700" style={{ backgroundColor: '#f8f8f8' }}>
            <div className="max-w-7xl mx-auto px-4">
                {/* Dịch vụ */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-center border-b pb-6">
                    <div className="flex items-center justify-center">
                        <img src="https://themes.pixelstrap.com/fastkart/assets/svg/product.svg" className="w-10 h-10 mb-2" />
                        <span className="font-medium text-base ml-4 text-left">Sản phẩm tươi</span>
                    </div>
                    <div className="flex items-center justify-center">
                        <img src="https://themes.pixelstrap.com/fastkart/assets/svg/delivery.svg" className="w-10 h-10 mb-2" />
                        <span className="font-medium text-base ml-4 text-left">Giao hàng miễn phí cho đơn hàng trên $50</span>
                    </div>
                    <div className="flex items-center justify-center">
                        <img src="https://themes.pixelstrap.com/fastkart/assets/svg/discount.svg" className="w-10 h-10 mb-2" />
                        <span className="font-medium text-base ml-4 text-left">Giảm giá Mega hàng ngày</span>
                    </div>
                    <div className="flex items-center justify-center">
                        <img src="https://themes.pixelstrap.com/fastkart/assets/svg/market.svg" className="w-10 h-10 mb-2" />
                        <span className="font-medium text-base ml-4 text-left">Giá tốt nhất trên thị trường</span>
                    </div>
                </div>
                {/* Footer chính */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-8">
                    {/* Cột 1: Logo + thông tin */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 mb-2">
                            <img src={logo} className="w-36 h-12 object-contain" />
                        </div>
                        <p className="text-base">Công Ty TNHH Đầu Tư Công Nghệ TECHBYTE</p>
                        <div className="flex items-start gap-2 text-base mt-2">
                            <CiHome className="w-5 h-5 mt-1" />
                            <span>Nhà 2B, 110 Nguyễn Hoàng Tôn, Xuân La, Tây Hồ, Hà Nội</span>
                        </div>
                        <div className="flex items-center gap-2 text-base mt-1">
                            <CiMail className="w-5 h-5" />
                            <span>ai@idai.vn</span>
                        </div>
                    </div>
                    {/* Cột 2: Thể loại */}
                    <div>
                        <h4 className="font-bold text-lg mb-3">Thể loại</h4>
                        <ul className="space-y-1 text-base">
                            <li><a href="https://devidai.io.vn/san-pham?category_l1=B%C3%A1nh%20Quy%20%26%20%C4%90%E1%BB%93%20%C4%82n%20Nh%E1%BA%B9" className="hover:underline">Bánh Quy & Đồ Ăn Nhẹ</a></li>
                            <li><a href="https://devidai.io.vn/san-pham?category_l1=B%E1%BB%AFa%20S%C3%A1ng%20%26%20S%E1%BB%AFa" className="hover:underline">Bữa Sáng & Sữa</a></li>
                            <li><a href="https://devidai.io.vn/san-pham?category_l1=%C4%90%E1%BB%93%20U%E1%BB%91ng" className="hover:underline">Đồ Uống</a></li>
                            <li><a href="https://devidai.io.vn/san-pham?category_l1=Rau%20v%C3%A0%20Tr%C3%A1i%20C%C3%A2y" className="hover:underline">Rau và Trái Cây</a></li>
                            <li><a href="https://devidai.io.vn/san-pham?category_l1=R%C6%B0%E1%BB%A3u%20Vang%20%26%20%C4%90%E1%BB%93%20U%E1%BB%91ng%20C%C3%B3%20C%E1%BB%93n" className="hover:underline">Rượu Vang & Đồ Uống Có Cồn</a></li>
                            <li><a href="https://devidai.io.vn/san-pham?category_l1=S%E1%BB%AFa%20%26%20S%E1%BA%A3n%20Ph%E1%BA%A9m%20T%E1%BB%AB%20S%E1%BB%AFa" className="hover:underline">Sữa & Sản Phẩm Từ Sữa</a></li>
                            <li><a href="https://devidai.io.vn/san-pham?category_l1=T%E1%BA%A1p%20H%C3%B3a%20%26%20H%C3%A0ng%20Thi%E1%BA%BFt%20Y%E1%BA%BFu" className="hover:underline">Tạp Hóa & Hàng Thiết Yếu</a></li>
                            <li><a href="https://devidai.io.vn/san-pham?category_l1=Th%E1%BB%8Bt%20%26%20H%E1%BA%A3i%20S%E1%BA%A3n" className="hover:underline">Thịt & Hải Sản</a></li>
                            <li><a href="https://devidai.io.vn/san-pham?category_l1=Th%E1%BB%A9c%20%C4%82n%20Cho%20Th%C3%BA%20C%C6%B0ng" className="hover:underline">Thức Ăn Cho Thú Cưng</a></li>
                            <li><a href="https://devidai.io.vn/san-pham?category_l1=Th%E1%BB%B1c%20ph%E1%BA%A9m%20kh%C3%B4" className="hover:underline">Thực phẩm khô</a></li>
                            <li><a href="https://devidai.io.vn/san-pham?category_l1=Th%E1%BB%B1c%20Th%E1%BA%A9m%20%C4%90%C3%B4ng%20L%E1%BA%A1nh" className="hover:underline">Thực Thẩm Đông Lạnh</a></li>
                        </ul>
                    </div>
                    {/* Cột 3: Liên kết hữu ích */}
                    <div>
                        <h4 className="font-bold text-lg mb-3">Liên kết hữu ích</h4>
                        <ul className="space-y-1 text-base">
                            <li><a href="/" className="hover:underline">Trang chủ</a></li>
                            <li><a href="https://devidai.io.vn/san-pham" className="hover:underline">Cửa hàng</a></li>
                            <li><a href="https://devidai.io.vn/tin-tuc" className="hover:underline">Tin tức</a></li>
                        </ul>
                    </div>
                    {/* Cột 4: Liên hệ */}
                    <div>
                        <h4 className="font-bold text-lg mb-3">Liên hệ với chúng tôi</h4>
                        <div className="flex items-center gap-2 mb-2 text-base">
                            <IoCallOutline className="w-5 h-5" />
                            <span>Hotline 24/7 :</span>
                            <span className="font-bold">(+84) xxx.130.768</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2 text-base border-b pb-2">
                            <CiMail className="w-7 h-7" />
                            <span className="text-sm">Email:</span>
                            <span className="font-semibold">namdoanx@gmail.com</span>
                        </div>
                        <div className="mt-2 mb-2 font-medium">Tải ứng dụng :</div>
                        <div className="flex gap-2 mb-2">
                            <a href="https://play.google.com/store/apps" target="_blank" rel="noopener noreferrer">
                                <img src="https://themes.pixelstrap.com/fastkart/assets/images/playstore.svg" className="h-10" />
                            </a>
                            <a href="https://www.apple.com/in/app-store/" target="_blank" rel="noopener noreferrer">
                                <img src="https://themes.pixelstrap.com/fastkart/assets/images/appstore.svg" className="h-10" />
                            </a>
                        </div>
                    </div>
                </div>
                {/* Subfooter */}
                <div className="flex flex-col md:flex-row justify-between items-center mt-8 border-t text-xs text-gray-500 gap-4 pt-4">
                    <div>©2024 <a href="https://namdoanx.vercel.app/" className="hover:underline text-red-500">namdoanx.com</a> Bảo lưu mọi quyền</div>
                    <div className="flex space-x-2">
                        <img src="https://themes.pixelstrap.com/fastkart/assets/images/payment/1.png" className="h-6" />
                    </div>
                    <div className="flex space-x-2">
                        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600"><FaFacebook size={18} /></a>
                        <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400"><FaTwitter size={18} /></a>
                        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500"><FaInstagram size={18} /></a>
                        <a href="https://in.pinterest.com/" target="_blank" rel="noopener noreferrer" className="hover:text-red-500"><FaPinterestP size={18} /></a>
                        <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-700"><FaLinkedin size={18} /></a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
