import React, { useEffect, useRef, useState } from 'react'
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
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

    console.log("location", location)

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
            console.log("response", response.data)

        } catch (error) {
            console.log('error', error)
            AxiosToastError(error)
        }
    }

    return (
        <main id="content" role="main"
            className="w-full max-w-md mx-auto p-6 bg-gradient-to-br  min-h-screen flex items-center justify-center p-4"
        >
            <div className="bg-white  shadow-2xl rounded-3xl w-full max-w-md overflow-hidden grid md:grid-cols-1  ">
                <div className="p-8 text-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 400 300"
                        className="mx-auto mb-6 w-48 h-48 animate-pulse"
                    >
                        <circle cx="200" cy="200" r="150" fill="#3B82F6" />
                        <circle cx="200" cy="200" r="120" fill="#FFFFFF" />
                        <circle cx="200" cy="200" r="90" fill="#3B82F6" />
                        <circle cx="200" cy="200" r="60" fill="#FFFFFF" />
                        <text
                            x="200"
                            y="200"
                            textAnchor="middle"
                            fill="#2563EB"
                            fontSize="40"
                            fontWeight="bold"
                            dy=".3em"
                            className="text-center"
                        >
                            OTP
                        </text>
                    </svg>

                    <h2 className="text-2xl font-bold mb-2 ">Xác thực OTP</h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
                        Nhập mã 6 chữ số được gửi đến <span className="font-semibold text-[rgb(103,98,98)]">{location?.state?.email}</span>
                    </p>

                    <div className="flex justify-center space-x-4 mb-6">
                    {
                                data.map((element,index)=>{
                                    return(
                                        <input
                                            key={"otp"+index}
                                            type='text'
                                            id='otp'
                                            ref={(ref)=>{
                                                inputRef.current[index] = ref
                                                return ref 
                                            }}
                                            value={data[index]}
                                            onChange={(e)=>{
                                                const value =  e.target.value
                                                console.log("value",value)

                                                const newData = [...data]
                                                newData[index] = value
                                                setData(newData)

                                                if(value && index < 5){
                                                    inputRef.current[index+1].focus()
                                                }
                                            }}
                                            maxLength={1}
                                            className="w-12 h-16 text-center text-2xl border-2 border-blue-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500  "
                                        />
                                    )
                                })
                            }
                    </div>

                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                        Không nhận được mã? &nbsp;
                        <a
                            href="#"
                            className="text-blue-500 hover:underline dark:text-blue-400 transition-colors duration-300 hover:text-blue-600 dark:hover:text-blue-500"
                        >
                            Gửi lại mã
                        </a>
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="w-full py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-transform duration-300 hover:scale-105 dark:bg-blue-600 dark:hover:bg-blue-700"
                    >
                        Xác minh OTP
                    </button>
                </div>
            </div>
        </main>
    )
}

export default OtpVerification



