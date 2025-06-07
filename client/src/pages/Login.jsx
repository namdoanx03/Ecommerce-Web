import React, { useState } from 'react'
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';
import { TEInput, TERipple } from "tw-elements-react";

const Login = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [rememberMe, setRememberMe] = useState(false);


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

        try {
            const response = await Axios({
                ...SummaryApi.login,
                data: data
            })

            if (response.data.error) {
                toast.error(response.data.message)
            }

            if (response.data.success) {
                toast.success(response.data.message)
                localStorage.setItem('accesstoken', response.data.data.accesstoken)
                localStorage.setItem('refreshToken', response.data.data.refreshToken)

                const userDetails = await fetchUserDetails()
                dispatch(setUserDetails(userDetails.data))

                console.log('check response', userDetails.data)

                setData({
                    email: "",
                    password: "",
                })
                if (userDetails.data.role === 'ADMIN') {
                    navigate("/dashboard")
                } else {
                    navigate("/")
                }
            }

        } catch (error) {
            AxiosToastError(error)
        }
        // console.log('check token',localStorage.getItem('accesstoken'))


    }
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-6">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <img className="mx-auto h-10 w-auto" src="https://www.svgrepo.com/show/301692/login.svg" alt="Workflow" />
                <h2 className="mt-6 text-center text-2xl leading-9 font-bold text-gray-900">
                    ĐĂNG NHẬP TÀI KHOẢN CỦA BẠN
                </h2>
                <p className="mt-2 text-center text-sm leading-5 text-red-500 max-w">
                    Hoặc&nbsp;
                    <Link
                        to={"/register"}
                        className="font-medium text-blue-500 hover:text-blue-500 focus:outline-none focus:underline transition ease-in-out duration-150"
                    >
                        Tạo tài khoản mới
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-5 text-gray-700">Email</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="user@example.com"
                                    value={data.email}
                                    onChange={handleChange}
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                />
                                <div className="hidden absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <label htmlFor="password" className="block text-sm font-medium leading-5 text-gray-700">Password</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={data.password}
                                    onChange={handleChange}
                                    placeholder="Nhập mật khẩu của bạn"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                />
                                <div
                                    onClick={() => setShowPassword((preve) => !preve)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                >
                                    {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember_me"
                                    name="remember"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    value="1"
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                />
                                <label htmlFor="remember_me" className="ml-2 block text-sm leading-5 text-gray-900">Nhớ tôi</label>
                            </div>

                            <div className="text-sm leading-5">
                                <Link to={"/forgot-password"}
                                    className="font-medium text-blue-500 hover:text-blue-500 focus:outline-none focus:underline transition ease-in-out duration-150"
                                >
                                    Quên mật khẩu?
                                </Link>
                            </div>
                        </div>

                        <div className="mt-6">
                            <span className="block w-full rounded-md shadow-sm">
                                <button
                                disabled={!valideValue}
                                    type="submit"
                                    className=" w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
                                >
                                    Đăng nhập
                                </button>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login

