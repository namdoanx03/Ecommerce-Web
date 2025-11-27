import React, { useState } from 'react'
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import signUpImage from '../assets/sign-up.png';

const Register = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    const valideValue = Object.values(data).every(el => el)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (data.password !== data.confirmPassword) {
            toast.error("Xác nhận mật khẩu không khớp")
            return
        }

        try {
            const response = await Axios({
                ...SummaryApi.register,
                data: data
            })

            if (response.data.error) {
                toast.error(response.data.message)
            }

            if (response.data.success) {
                toast.success(response.data.message)
                setData({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: ""
                })
                navigate("/login")
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <div className="min-h-[calc(100vh-200px)] bg-white flex">
            {/* Left Section - Illustration */}
            <div className="hidden lg:flex lg:w-[60%] bg-white items-center justify-center p-12">
                <div className="w-full max-w-lg">
                    <img 
                        src={signUpImage} 
                        alt="Sign up illustration" 
                        className="w-full h-auto object-contain"
                    />
                </div>
            </div>

            {/* Right Section - Register Form */}
            <div className="w-full lg:w-[40%] flex flex-col justify-center p-6 sm:p-8 lg:p-12 bg-gray-50">
                <div className="w-full max-w-md mx-auto">
                    {/* Page Header with Title and Breadcrumb */}
                    <div className="flex items-center justify-between mb-6 sm:mb-8 gap-4">
                        {/* Page Title - Left */}
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Sign Up</h2>
                        
                        {/* Breadcrumb - Right */}
                        <div className="flex items-center gap-1.5 sm:gap-2 text-sm text-gray-600 flex-shrink-0">
                            <Link to="/" className="hover:text-emerald-600 transition-colors">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </Link>
                            <span className="text-gray-600">&gt;</span>
                            <span className="text-gray-600 hidden sm:inline">Sign Up</span>
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-lg shadow-sm p-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Chào mừng đến Fastkart</h1>
                        <p className="text-gray-600 mb-6">Tạo tài khoản mới của bạn</p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name Field */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Tên của bạn
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Nhập tên của bạn"
                                    value={data.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-150"
                                />
                            </div>

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Địa chỉ Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Nhập địa chỉ email của bạn"
                                    value={data.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-150"
                                />
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Mật khẩu
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={data.password}
                                        onChange={handleChange}
                                        placeholder="Nhập mật khẩu của bạn"
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-150"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((preve) => !preve)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    Xác nhận mật khẩu
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={data.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Nhập lại mật khẩu của bạn"
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-150"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword((preve) => !preve)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                                    </button>
                                </div>
                            </div>

                            {/* Register Button */}
                            <button
                                type="submit"
                                disabled={!valideValue}
                                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-md transition duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                Tạo tài khoản
                            </button>
                        </form>

                        {/* OR Separator */}
                        <div className="my-6 flex items-center">
                            <div className="flex-1 border-t border-gray-300"></div>
                            <span className="px-4 text-sm text-gray-500">HOẶC</span>
                            <div className="flex-1 border-t border-gray-300"></div>
                        </div>

                        {/* Social Login Buttons */}
                        <div className="space-y-3">
                            <button
                                type="button"
                                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-md hover:bg-gray-50 transition duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300"
                            >
                                <FaGoogle className="w-5 h-5" />
                                Đăng ký với Google
                            </button>
                            <button
                                type="button"
                                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-md hover:bg-gray-50 transition duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300"
                            >
                                <FaFacebook className="w-5 h-5 text-blue-600" />
                                Đăng ký với Facebook
                            </button>
                        </div>

                        {/* Login Link */}
                        <p className="mt-6 text-center text-sm text-gray-600">
                            Bạn đã có tài khoản?{' '}
                            <Link
                                to="/login"
                                className="font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                            >
                                Đăng nhập ngay
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register
