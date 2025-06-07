import React, { useState } from 'react'
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [data, setData] = useState({
        email: "",
    })
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
       <main id="content" role="main" className="w-full max-w-md mx-auto p-6">
      <div className="mt-7 bg-white rounded-xl shadow-lg  border-2 border-indigo-300">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 ">Khôi phục mật khẩu?</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Nhớ mật khẩu của bạn? &nbsp;
              <Link
                to={"/login"}
                className="text-blue-600 decoration-2 hover:underline font-medium"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>

          <div className="mt-5">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-bold ml-1 mb-2 ">
                    Email :
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                      placeholder="user@example.com"
                      required
                      value={data.email}
                      onChange={handleChange}
                    />
                    <p className="hidden text-xs text-red-600 mt-2" id="email-error">
                      Please include a valid email address so we can get back to you
                    </p>
                  </div>
                </div>
                <button
                  type="submit"
                  className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                >
                  Gửi mã OTP
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </main>
    )
}

export default ForgotPassword


