import React, { useEffect, useState } from 'react'
import Loading from '../components/Loading'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { FaEye } from "react-icons/fa";
import { TbEdit } from "react-icons/tb";
import { FaRegTrashCan } from "react-icons/fa6";
import { IoSearchOutline } from "react-icons/io5";
import { IoClose } from "react-icons/io5";

const UserAdmin = () => {
    const [loading, setLoading] = useState(false)
    const [userData, setUserData] = useState([])
    const [openEdit, setOpenEdit] = useState(false)
    const [editData, setEditData] = useState({
        _id: "",
        name: "",
        email: "",
        role: "",
        status: ""
    })
    const [openConfirmBoxDelete, setOpenConfirmBoxDelete] = useState(false)
    const [deleteUser, setDeleteUser] = useState({
        _id: ""
    })
    const [search, setSearch] = useState("")
    const [viewUser, setViewUser] = useState(null)
    const [showViewModal, setShowViewModal] = useState(false)

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getAllUsers
            })
            const { data: responseData } = response

            if (responseData.success) {
                setUserData(responseData.data)
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleDeleteUser = async () => {
        try {
            // Note: You may need to add deleteUser API endpoint
            // const response = await Axios({
            //     ...SummaryApi.deleteUser,
            //     data: deleteUser
            // })
            // const { data: responseData } = response
            // if (responseData.success) {
            //     toast.success(responseData.message)
            //     fetchUsers()
            //     setOpenConfirmBoxDelete(false)
            //     setDeleteUser({ _id: "" })
            // }
            toast.error('Chức năng xóa người dùng chưa được triển khai')
        } catch (error) {
            AxiosToastError(error)
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        return `${day}-${month}-${year}`
    }

    // Filter and sort users by search
    const filteredUsers = userData
        .filter(user =>
            user.name?.toLowerCase().includes(search.toLowerCase()) ||
            user.email?.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            // Admin always comes first
            if (a.role === 'ADMIN' && b.role !== 'ADMIN') return -1
            if (a.role !== 'ADMIN' && b.role === 'ADMIN') return 1
            // If both are admin or both are user, sort by creation date (newest first)
            return new Date(b.createdAt) - new Date(a.createdAt)
        })

    const handleOnChange = (e) => {
        setSearch(e.target.value)
    }

    const handleView = (user) => {
        setViewUser(user)
        setShowViewModal(true)
    }

    const openDeleteModal = (user) => {
        setDeleteUser(user)
        setOpenConfirmBoxDelete(true)
    }

    return (
        <div className=' min-h-screen p-4 sm:p-6'>
            {/* Main Content Container - White Background */}
            <div className='bg-white rounded-lg shadow-sm p-4 sm:p-6'>
                {/* Header Section */}
                <div className='mb-6'>
                    <div className='flex items-center justify-between mb-4'>
                        <h1 className="text-2xl font-semibold text-gray-800">All Users</h1>
                    </div>
                    {/* Search Bar - Below action buttons */}
                    <div className='flex items-center gap-2 justify-end'>
                        <label className='text-sm text-gray-700 font-medium'>Search:</label>
                        <div className='max-w-md bg-white px-4 flex items-center gap-3 py-2 rounded-lg border border-gray-300 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-200'>
                            <IoSearchOutline size={20} className='text-gray-400' />
                            <input
                                type='text'
                                placeholder='Search user...'
                                className='h-full w-full outline-none bg-transparent text-sm'
                                value={search}
                                onChange={handleOnChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className='overflow-x-auto'>
                    <table className='w-full text-sm'>
                        <thead>
                            <tr className='bg-[#F3F3F3] border-b border-gray-200'>
                                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Name</th>
                                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Email</th>
                                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Role</th>
                                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Status</th>
                                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Date</th>
                                <th className='p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Option</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-200'>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-gray-500">Loading...</td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-gray-500">No users found</td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => {
                                    return (
                                        <tr
                                            key={user._id}
                                            className='hover:bg-gray-50 transition-colors'
                                        >
                                            <td className='p-4 text-center'>
                                                <div className='flex items-center justify-center gap-2'>
                                                    {user.avatar ? (
                                                        <img
                                                            src={user.avatar}
                                                            alt={user.name}
                                                            className='w-8 h-8 rounded-full object-cover'
                                                        />
                                                    ) : (
                                                        <div className='w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center'>
                                                            <span className='text-xs text-gray-600 font-medium'>
                                                                {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <span className='font-medium text-gray-800'>
                                                        {user.name || 'N/A'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className='p-4 text-center'>
                                                <span className='text-gray-600'>
                                                    {user.email || 'N/A'}
                                                </span>
                                            </td>
                                            <td className='p-4 text-center'>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    user.role === 'ADMIN' 
                                                        ? 'bg-purple-100 text-purple-700' 
                                                        : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {user.role || 'USER'}
                                                </span>
                                            </td>
                                            <td className='p-4 text-center'>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    user.status === 'Active' 
                                                        ? 'bg-green-100 text-green-700' 
                                                        : user.status === 'Suspended'
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {user.status || 'Active'}
                                                </span>
                                            </td>
                                            <td className='p-4 text-center'>
                                                <span className='text-gray-600'>
                                                    {formatDate(user.createdAt)}
                                                </span>
                                            </td>
                                            <td className='p-4 text-center'>
                                                <div className='flex items-center justify-center gap-3'>
                                                    <button
                                                        title='View'
                                                        className='text-gray-400 hover:text-blue-600 transition-colors'
                                                        onClick={() => handleView(user)}
                                                    >
                                                        <FaEye size={18} />
                                                    </button>
                                                    <button
                                                        title='Edit'
                                                        className='text-gray-400 hover:text-green-600 transition-colors'
                                                        onClick={() => {
                                                            setOpenEdit(true)
                                                            setEditData(user)
                                                        }}
                                                    >
                                                        <TbEdit size={18} />
                                                    </button>
                                                    <button
                                                        title='Delete'
                                                        className='text-gray-400 hover:text-red-600 transition-colors'
                                                        onClick={() => openDeleteModal(user)}
                                                    >
                                                        <FaRegTrashCan size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {loading && (
                    <Loading />
                )}

                {/* View User Modal */}
                {showViewModal && viewUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowViewModal(false)
                        }
                    }}>
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <h2 className="text-2xl font-semibold text-gray-800">Chi tiết người dùng</h2>
                                <button
                                    onClick={() => setShowViewModal(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <IoClose size={24} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Left Column - Avatar */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh đại diện</label>
                                        <div className="flex justify-center">
                                            {viewUser.avatar ? (
                                                <img
                                                    src={viewUser.avatar}
                                                    alt={viewUser.name}
                                                    className="w-32 h-32 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                                                />
                                            ) : (
                                                <div className="w-32 h-32 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                                                    <span className="text-4xl text-gray-400 font-medium">
                                                        {viewUser.name?.charAt(0)?.toUpperCase() || 'U'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Column - User Info */}
                                    <div className="space-y-4">
                                        <div className="grid gap-1">
                                            <label className="text-sm font-medium text-gray-700">Tên người dùng</label>
                                            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800">
                                                {viewUser.name || 'N/A'}
                                            </div>
                                        </div>

                                        <div className="grid gap-1">
                                            <label className="text-sm font-medium text-gray-700">Email</label>
                                            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800">
                                                {viewUser.email || 'N/A'}
                                            </div>
                                        </div>

                                        <div className="grid gap-1">
                                            <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
                                            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800">
                                                {viewUser.mobile || 'N/A'}
                                            </div>
                                        </div>

                                        <div className="grid gap-1">
                                            <label className="text-sm font-medium text-gray-700">Vai trò</label>
                                            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    viewUser.role === 'ADMIN' 
                                                        ? 'bg-purple-100 text-purple-700' 
                                                        : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {viewUser.role || 'USER'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid gap-1">
                                            <label className="text-sm font-medium text-gray-700">Trạng thái</label>
                                            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    viewUser.status === 'Active' 
                                                        ? 'bg-green-100 text-green-700' 
                                                        : viewUser.status === 'Suspended'
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {viewUser.status || 'Active'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid gap-1">
                                            <label className="text-sm font-medium text-gray-700">Ngày tạo</label>
                                            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800">
                                                {formatDate(viewUser.createdAt)}
                                            </div>
                                        </div>

                                        <div className="grid gap-1">
                                            <label className="text-sm font-medium text-gray-700">Ngày cập nhật</label>
                                            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800">
                                                {formatDate(viewUser.updatedAt)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                                <button
                                    className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                    onClick={() => setShowViewModal(false)}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {openConfirmBoxDelete && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                            <h2 className="text-lg font-semibold mb-4 text-red-600">Xác nhận xóa người dùng</h2>
                            <p className="text-gray-700 mb-2">Bạn có chắc chắn muốn xóa người dùng này không?</p>
                            {deleteUser.name && (
                                <p className="text-sm text-gray-600 mb-4">
                                    <span className="font-medium">Người dùng:</span> {deleteUser.name} ({deleteUser.email})
                                </p>
                            )}
                            <div className="flex gap-2 mt-6 justify-end">
                                <button
                                    className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg transition-colors font-medium"
                                    onClick={() => {
                                        setOpenConfirmBoxDelete(false)
                                        setDeleteUser({ _id: "" })
                                    }}
                                >
                                    Hủy
                                </button>
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                                    onClick={handleDeleteUser}
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit User Modal - Placeholder for future implementation */}
                {openEdit && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setOpenEdit(false)
                        }
                    }}>
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <h2 className="text-2xl font-semibold text-gray-800">Chỉnh sửa người dùng</h2>
                                <button
                                    onClick={() => setOpenEdit(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <IoClose size={24} />
                                </button>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600">Chức năng chỉnh sửa người dùng sẽ được triển khai sau.</p>
                            </div>
                            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                                <button
                                    className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                    onClick={() => setOpenEdit(false)}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default UserAdmin

