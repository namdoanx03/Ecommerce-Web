import React, { useEffect, useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'

const ResetPassword = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [data, setData] = useState({
        email: "",
        newPassword: "",
        confirmPassword: ""
    })

    const valideValue = Object.values(data).every(el => el)

    useEffect(() => {
        if (!(location?.state?.data?.success)) {
            navigate("/")
        }

        if (location?.state?.email) {
            setData((preve) => {
                return {
                    ...preve,
                    email: location?.state?.email
                }
            })
        }
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }


    const handleSubmit = async (e) => {
        e.preventDefault()

        ///optional 
        if (data.newPassword !== data.confirmPassword) {
            toast.error("Mật khẩu mới và mật khẩu xác nhận phải giống nhau.")
            return
        }

        try {
            const response = await Axios({
                ...SummaryApi.resetPassword, //change
                data: data
            })

            if (response.data.error) {
                toast.error(response.data.message)
            }

            if (response.data.success) {
                toast.success(response.data.message)
                navigate("/login")
                setData({
                    email: "",
                    newPassword: "",
                    confirmPassword: ""
                })

            }

        } catch (error) {
            AxiosToastError(error)
        }



    }

    return (
        <main id="content" role="main" className="w-full max-w-md mx-auto p-6">
            <div className="mt-7 bg-white rounded-xl shadow-lg  border-2 border-indigo-300">
                <div className="p-4 sm:p-7">
                    <div className="text-center">
                        <h1 className="block text-2xl font-bold text-gray-800 ">Thay đổi mật khẩu?</h1>
                    </div>

                    <div className="mt-5">
                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-y-4">
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-bold ml-1 mb-2 ">
                                        Mật khẩu mới :
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            id="newPassword"
                                            name="newPassword"
                                            className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                                            placeholder="Nhập mật khẩu mới của bạn"
                                            required
                                            value={data.newPassword}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="grid gap-y-4 mt-4">
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-bold ml-1 mb-2 ">
                                        Xác nhận mật khẩu:
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                                            placeholder="Xác nhận mật khẩu mới"
                                            required
                                            value={data.confirmPassword}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                                >
                                    Xác nhận
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>

    )
}

export default ResetPassword
