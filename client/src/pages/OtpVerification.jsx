import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const OtpVerification = () => {
    const [data, setData] = useState(["", "", "", "", "", ""])
    const navigate = useNavigate()
    const inputRef = useRef([])
    const location = useLocation()
    const [isResending, setIsResending] = useState(false)

    useEffect(() => {
        if (!location?.state?.email) {
            navigate("/forgot-password")
        }
    }, [])

    const valideValue = data.every(el => el)

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await Axios({
                ...SummaryApi.forgot_password_otp_verification,
                data: {
                    otp: data.join(""),
                    email: location?.state?.email
                }
            })
            if (response.data.error) {
                toast.error(response.data.message)
            }

            if (response.data.success) {
                toast.success(response.data.message)
                setData(["", "", "", "", "", ""])
                navigate("/reset-password", {
                    state: {
                        data: response.data,
                        email: location?.state?.email
                    }
                })
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    const handleResendOtp = async () => {
        if (!location?.state?.email) return

        setIsResending(true)
        try {
            const response = await Axios({
                ...SummaryApi.forgot_password,
                data: {
                    email: location?.state?.email
                }
            })

            if (response.data.success) {
                toast.success("Mã OTP đã được gửi lại đến email của bạn")
                setData(["", "", "", "", "", ""])
                // Focus on first input
                if (inputRef.current[0]) {
                    inputRef.current[0].focus()
                }
            } else {
                toast.error(response.data.message || "Không thể gửi lại mã OTP")
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setIsResending(false)
        }
    }

    const handleInputChange = (e, index) => {
        const value = e.target.value

        // Only allow numbers
        if (value && !/^\d$/.test(value)) {
            return
        }

        const newData = [...data]
        newData[index] = value
        setData(newData)

        // Auto focus next input
        if (value && index < 5) {
            inputRef.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (e, index) => {
        // Handle backspace
        if (e.key === 'Backspace' && !data[index] && index > 0) {
            inputRef.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData('text').trim().slice(0, 6)
        
        if (/^\d{6}$/.test(pastedData)) {
            const newData = pastedData.split('')
            setData(newData)
            // Focus last input
            inputRef.current[5]?.focus()
        }
    }

    return (
        <div className="bg-white min-h-screen">
            {/* Header Section - Title and Breadcrumb */}
            <div className="bg-[#F8F8F8] border-b border-gray-200">
                <div className="container mx-auto px-4 sm:px-5 lg:px-16 py-5 sm:py-7">
                    <div className="flex items-center justify-between gap-4">
                        {/* Page Title - Left */}
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-600">OTP Verification</h2>
                        
                        {/* Breadcrumb - Right */}
                        <div className="flex items-center gap-1.5 sm:gap-2 text-sm text-gray-600">
                            <Link to="/" className="hover:text-emerald-600 transition-colors">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </Link>
                            <span className="text-gray-600">&gt;</span>
                            <span className="text-gray-600 font-bold">OTP Verification</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Section - Background light blue */}
            <section 
                className="min-h-[calc(100vh-200px)] relative flex items-center justify-center py-8 lg:py-12"
                style={{
                    backgroundColor: '#F0F7FF'
                }}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center">
                        {/* OTP Verification Card */}
                        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
                            {/* OTP Icon */}
                            <div className="mb-6 flex justify-center">
                                <div className="relative">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 200 200"
                                        className="w-32 h-32"
                                    >
                                        <circle cx="100" cy="100" r="90" fill="#3B82F6" opacity="0.2" />
                                        <circle cx="100" cy="100" r="70" fill="#3B82F6" opacity="0.4" />
                                        <circle cx="100" cy="100" r="50" fill="#3B82F6" />
                                        <text
                                            x="100"
                                            y="100"
                                            textAnchor="middle"
                                            fill="#FFFFFF"
                                            fontSize="24"
                                            fontWeight="bold"
                                            dy=".3em"
                                        >
                                            OTP
                                        </text>
                                    </svg>
                                </div>
                            </div>

                            {/* Title */}
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Xác thực OTP</h2>
                            
                            {/* Instruction Text */}
                            <p className="text-sm text-gray-600 mb-8">
                                Nhập mã 6 chữ số được gửi đến{' '}
                                <span className="font-semibold text-gray-700">{location?.state?.email}</span>
                            </p>

                            {/* OTP Input Fields */}
                            <form onSubmit={handleSubmit} onPaste={handlePaste}>
                                <div className="flex justify-center gap-3 mb-6">
                                    {data.map((element, index) => {
                                        return (
                                            <input
                                                key={"otp" + index}
                                                type="text"
                                                inputMode="numeric"
                                                ref={(ref) => {
                                                    inputRef.current[index] = ref
                                                    return ref
                                                }}
                                                value={data[index]}
                                                onChange={(e) => handleInputChange(e, index)}
                                                onKeyDown={(e) => handleKeyDown(e, index)}
                                                maxLength={1}
                                                className="w-14 h-16 text-center text-2xl font-semibold border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                required
                                            />
                                        )
                                    })}
                                </div>

                                {/* Resend Code Link */}
                                <div className="text-sm text-gray-600 mb-6">
                                    Không nhận được mã?{' '}
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        disabled={isResending}
                                        className="text-blue-600 hover:text-blue-700 font-medium underline transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
                                    >
                                        {isResending ? 'Đang gửi...' : 'Gửi lại mã'}
                                    </button>
                                </div>

                                {/* Verify Button */}
                                <button
                                    type="submit"
                                    disabled={!valideValue}
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    XÁC MINH OTP
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default OtpVerification
