import React, { useState } from 'react'
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import forgotImage from '../assets/forgot.png';

const ForgotPassword = () => {
    const [data, setData] = useState({
        email: "",
    })
    const [focusedField, setFocusedField] = useState(null)
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

    const handleSubmit = async(e)=>{
        e.preventDefault()

        try {
            const response = await Axios({
                ...SummaryApi.forgot_password,
                data : data
            })
            
            if(response.data.error){
                toast.error(response.data.message)
            }
            if(response.data.success){
                toast.success(response.data.message)
                navigate("/verification-otp",{
                  state : data
                })
                setData({
                    email : "",
                })   
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <div className="bg-white min-h-screen">
            {/* Header Section - Title and Breadcrumb */}
            <div className="bg-[#F8F8F8] border-b border-gray-200">
                <div className="container mx-auto px-4 sm:px-5 lg:px-16 py-5 sm:py-7">
                    <div className="flex items-center justify-between gap-4">
                        {/* Page Title - Left */}
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-600">Forgot Password</h2>
                        
                        {/* Breadcrumb - Right */}
                        <div className="flex items-center gap-1.5 sm:gap-2 text-sm text-gray-600">
                            <Link to="/" className="hover:text-emerald-600 transition-colors">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </Link>
                            <span className="text-gray-600">&gt;</span>
                            <span className="text-gray-600 font-bold">Forgot Password</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Section - log-in-section with background-image-2 */}
            <section 
                className="log-in-section section-b-space min-h-[calc(100vh-200px)] relative"
                style={{
                    backgroundImage: 'url("https://themes.pixelstrap.com/fastkart/assets/images/inner-page/log-in-bg.png")',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover'
                }}
            >
                {/* Container Fluid */}
                <div className="container-fluid-lg w-full px-4 sm:px-6 lg:px-8">
                    {/* Row */}
                    <div className="flex flex-col lg:flex-row items-stretch lg:gap-2">
                        {/* Left Column - Illustration */}
                        <div className="hidden lg:flex lg:w-[50%] xl:w-[50%] items-center justify-center lg:pr-1">
                            <div className="image-contain w-full max-w-lg">
                                <img 
                                    src={forgotImage} 
                                    className="img-fluid w-full h-auto object-contain" 
                                    alt="Forgot password illustration" 
                                />
                            </div>
                        </div>

                        {/* Right Column - Forgot Password Form */}
                        <div className="w-full lg:w-[50%] xl:w-[50%] col-xxl-4 col-xl-5 col-lg-6 col-sm-8 mx-auto flex items-center justify-center py-8 lg:py-12 lg:pl-1">
                            {/* log-in-box */}
                            <div className="log-in-box w-full max-w-md rounded-lg shadow-sm p-6 sm:p-8" style={{ backgroundColor: '#F8F8F8' }}>
                                {/* log-in-title */}
                                <div className="log-in-title mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-1">Welcome To Fastkart</h3>
                                    <h4 className="text-base text-gray-600">Forgot your password</h4>
                                </div>

                                {/* input-box */}
                                <div className="input-box">
                                    <form className="space-y-4" onSubmit={handleSubmit}>
                                        {/* Email Field - Form Floating */}
                                        <div className="col-12">
                                            <div className="form-floating theme-form-floating log-in-form relative">
                                                <input
                                                    type="email"
                                                    className="form-control w-full px-4 pt-6 pb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white"
                                                    id="email"
                                                    name="email"
                                                    placeholder=""
                                                    value={data.email}
                                                    onChange={handleChange}
                                                    onFocus={() => setFocusedField('email')}
                                                    onBlur={() => setFocusedField(null)}
                                                    required
                                                />
                                                <label 
                                                    htmlFor="email"
                                                    className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                                                        data.email || focusedField === 'email'
                                                            ? 'top-2 text-xs text-emerald-600 font-medium' 
                                                            : 'top-1/2 -translate-y-1/2 text-base text-gray-500'
                                                    }`}
                                                >
                                                    Email Address
                                                </label>
                                            </div>
                                        </div>

                                        {/* Forgot Password Button */}
                                        <div className="col-12">
                                            <button
                                                className="btn btn-animation w-100 justify-content-center w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-md transition duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center"
                                                type="submit"
                                                disabled={!valideValue}
                                            >
                                                Forgot Password
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                {/* Login Link - sign-up-box */}
                                <div className="sign-up-box text-center mt-6">
                                    <h4 className="text-sm text-gray-600 mb-1">Remember your password?</h4>
                                    <Link
                                        to="/login"
                                        className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                                    >
                                        Log In
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ForgotPassword
