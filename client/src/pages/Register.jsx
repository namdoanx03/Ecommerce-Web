import React, { useState } from 'react'
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [showPassword, setShowPassword] = useState(false)
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
            toast.error(
                "Xác nhận mật khẩu không khớp"
            )
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
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <img className="mx-auto h-10 w-auto" src="https://www.svgrepo.com/show/301692/login.svg" alt="Workflow" />
                <h2 className="mt-6 text-center text-3xl leading-9 font-bold text-gray-900">
                    Tạo một tài khoản mới
                </h2>
                <p className="mt-2 text-center text-sm leading-5 text-red-500 max-w">
                    Hoặc&nbsp;
                    <Link
                        to={"/login"}
                        className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline transition ease-in-out duration-150"
                    >
                        Đăng nhập vào tài khoản của bạn
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium leading-5 text-gray-700">Tên của bạn: </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    id="name"
                                    name="name"
                                    placeholder="Nguyễn văn a"
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                />
                            </div>
                        </div>

                        

                        <div className="mt-6">
                            <label htmlFor="email" className="block text-sm font-medium leading-5 text-gray-700">Email: </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    id="email"
                                    name="email"
                                    placeholder="user@example.com"
                                    type="email"
                                    required
                                    value={data.email}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <label htmlFor="password" className="block text-sm font-medium leading-5 text-gray-700">Mật khẩu: </label>
                            <div className="mt-1 rounded-md shadow-sm">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={data.password}
                                    onChange={handleChange}
                                    placeholder="Mật khẩu của bạn"
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <label htmlFor="password_confirmation" className="block text-sm font-medium leading-5 text-gray-700">Nhập lại mật khẩu: </label>
                            <div className="mt-1 rounded-md shadow-sm">
                                <input
                                    id="password_confirmation"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={data.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Nhập lại mật khẩu của bạn"
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <span className="block w-full rounded-md shadow-sm">
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
                                >
                                    Tạo tài khoản
                                </button>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register
