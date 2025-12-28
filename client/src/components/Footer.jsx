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
                {/* Footer chính - 5 cột theo mẫu */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 py-8 border-b border-gray-300">
                    {/* Cột 1: Logo + thông tin */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 mb-3">
                            <img src={logo} className="w-36 h-12 object-contain" />
                        </div>
                        <p className="text-sm text-gray-600 mb-3 leading-relaxed">Công Ty TNHH Đầu Tư Công Nghệ TECHBYTE</p>
                        <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
                            <CiHome className="w-5 h-5 mt-0.5 flex-shrink-0" />
                            <span>Nhà 2B, 110 Nguyễn Hoàng Tôn, Xuân La, Tây Hồ, Hà Nội</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <CiMail className="w-5 h-5 flex-shrink-0" />
                            <span>ai@idai.vn</span>
                        </div>
                    </div>
                    
                    {/* Cột 2: Thể loại */}
                    <div>
                        <h4 className="font-bold text-base mb-4 text-gray-800">Thể loại</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><a href="/product" className="hover:text-emerald-600 hover:translate-x-1 inline-block transition-all">Bánh Quy & Đồ Ăn Nhẹ</a></li>
                            <li><a href="/product" className="hover:text-emerald-600 hover:translate-x-1 inline-block transition-all">Bữa Sáng & Sữa</a></li>
                            <li><a href="/product" className="hover:text-emerald-600 hover:translate-x-1 inline-block transition-all">Đồ Uống</a></li>
                            <li><a href="/product" className="hover:text-emerald-600 hover:translate-x-1 inline-block transition-all">Rau và Trái Cây</a></li>
                            <li><a href="/product" className="hover:text-emerald-600 hover:translate-x-1 inline-block transition-all">Rượu Vang & Đồ Uống Có Cồn</a></li>
                            <li><a href="/product" className="hover:text-emerald-600 hover:translate-x-1 inline-block transition-all">Sữa & Sản Phẩm Từ Sữa</a></li>
                        </ul>
                    </div>
                    
                    {/* Cột 3: Liên kết hữu ích */}
                    <div>
                        <h4 className="font-bold text-base mb-4 text-gray-800">Liên kết hữu ích</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><a href="/" className="hover:text-emerald-600 hover:translate-x-1 inline-block transition-all">Trang chủ</a></li>
                            <li><a href="/product" className="hover:text-emerald-600 hover:translate-x-1 inline-block transition-all">Cửa hàng</a></li>
                            <li><a href="/tin-tuc" className="hover:text-emerald-600 hover:translate-x-1 inline-block transition-all">Tin tức</a></li>
                        </ul>
                    </div>
                    
                    {/* Cột 4: Help Center - Thêm cột mới theo mẫu */}
                    <div>
                        <h4 className="font-bold text-base mb-4 text-gray-800">Hỗ trợ</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><a href="/orders" className="hover:text-emerald-600 hover:translate-x-1 inline-block transition-all">Đơn hàng của bạn</a></li>
                            <li><a href="/profile" className="hover:text-emerald-600 hover:translate-x-1 inline-block transition-all">Tài khoản</a></li>
                            <li><a href="/orders" className="hover:text-emerald-600 hover:translate-x-1 inline-block transition-all">Theo dõi đơn hàng</a></li>
                            <li><a href="/wishlist" className="hover:text-emerald-600 hover:translate-x-1 inline-block transition-all">Danh sách yêu thích</a></li>
                            <li><a href="/search" className="hover:text-emerald-600 hover:translate-x-1 inline-block transition-all">Tìm kiếm</a></li>
                            <li><a href="/faq" className="hover:text-emerald-600 hover:translate-x-1 inline-block transition-all">FAQ</a></li>
                        </ul>
                    </div>
                    
                    {/* Cột 5: Liên hệ */}
                    <div>
                        <h4 className="font-bold text-base mb-4 text-gray-800">Liên hệ với chúng tôi</h4>
                        <div className="space-y-3">
                            <div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                    <IoCallOutline className="w-5 h-5" />
                                    <span>Hotline 24/7 :</span>
                                </div>
                                <a href="tel:+84xxx130768" className="font-bold text-base text-gray-800 hover:text-emerald-600">
                                    (+84) 988.678.xxx
                                </a>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                    <CiMail className="w-5 h-5" />
                                    <span>Email:</span>
                                </div>
                                <a href="mailto:namdoanx@gmail.com" className="font-semibold text-sm text-gray-800 hover:text-emerald-600">
                                    namdoanx@gmail.com
                                </a>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-2">Tải ứng dụng :</p>
                                <div className="flex gap-2">
                                    <a href="https://play.google.com/store/apps" target="_blank" rel="noopener noreferrer">
                                        <img src="https://themes.pixelstrap.com/fastkart/assets/images/playstore.svg" className="h-9" />
                                    </a>
                                    <a href="https://www.apple.com/in/app-store/" target="_blank" rel="noopener noreferrer">
                                        <img src="https://themes.pixelstrap.com/fastkart/assets/images/appstore.svg" className="h-9" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Subfooter */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-6 gap-4">
                    <div className="text-sm text-gray-600">
                        ©2024 <a href="https://namdoanx.vercel.app/" className="hover:underline text-red-500">namdoanx.com</a> Bảo lưu mọi quyền
                    </div>
                    <div className="flex items-center gap-2 ">
                        <img src="https://themes.pixelstrap.com/fastkart/assets/images/payment/1.png" alt="PayPal" className="h-8" />
                        
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-sm text-gray-600 mr-2">Stay connected :</span>
                        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600"><FaFacebook size={16} /></a>
                        <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400"><FaTwitter size={16} /></a>
                        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500"><FaInstagram size={16} /></a>
                        <a href="https://in.pinterest.com/" target="_blank" rel="noopener noreferrer" className="hover:text-red-500"><FaPinterestP size={16} /></a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
