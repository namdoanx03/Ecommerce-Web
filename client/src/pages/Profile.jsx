import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaRegUserCircle } from "react-icons/fa";
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';
import { setUserDetails } from '../store/userSlice';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useAddress } from '../hooks/useAddress';
import AddAddress from '../components/AddAddress';
import EditAddressDetails from '../components/EditAddressDetails';
import { MdEdit, MdDelete } from "react-icons/md";

const Profile = () => {
    const user = useSelector(state => state.user)
    const addressList = useSelector(state => state.addresses.addressList)
    const dispatch = useDispatch()
    const { fetchAddress, deleteAddress } = useAddress()
    
    // Split name into first and last name
    const nameParts = (user.name || '').split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''
    
    const [userData, setUserData] = useState({
        firstName: firstName,
        lastName: lastName,
        email: user.email || '',
        mobile: user.mobile || '',
        password: '',
        confirmPassword: ''
    })
    const [selectedFile, setSelectedFile] = useState(null)
    const [fileName, setFileName] = useState('')
    const [loading, setLoading] = useState(false)
    const [openAddress, setOpenAddress] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [editData, setEditData] = useState({})
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [addressToDelete, setAddressToDelete] = useState(null)

    useEffect(() => {
        const nameParts = (user.name || '').split(' ')
        setUserData({
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            email: user.email || '',
            mobile: user.mobile || '',
            password: '',
            confirmPassword: ''
        })
        fetchAddress()
    }, [user])

    const handleOnChange = (e) => {
        const { name, value } = e.target
        setUserData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setSelectedFile(file)
            setFileName(file.name)
        }
    }

    const handleUploadAvatar = async () => {
        if (!selectedFile) return

        const formData = new FormData()
        formData.append('avatar', selectedFile)

        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.uploadAvatar,
                data: formData
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success('Avatar uploaded successfully')
                const userData = await fetchUserDetails()
                dispatch(setUserDetails(userData.data))
                setSelectedFile(null)
                setFileName('')
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validate password match
        if (userData.password && userData.password !== userData.confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        try {
            setLoading(true)
            const fullName = `${userData.firstName} ${userData.lastName}`.trim()
            const updateData = {
                name: fullName,
                email: userData.email,
                mobile: userData.mobile,
                ...(userData.password && { password: userData.password })
            }

            const response = await Axios({
                ...SummaryApi.updateUserDetails,
                data: updateData
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                const userData = await fetchUserDetails()
                dispatch(setUserDetails(userData.data))
                setUserData(prev => ({ ...prev, password: '', confirmPassword: '' }))
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteClick = (id) => {
        setAddressToDelete(id)
        setShowDeleteConfirm(true)
    }

    const handleDeleteAddress = async () => {
        if (addressToDelete) {
            const success = await deleteAddress(addressToDelete)
            if (success) {
                setShowDeleteConfirm(false)
                setAddressToDelete(null)
            }
        }
    }

    const handleEditClick = (address) => {
        setEditData(address)
        setOpenEdit(true)
    }

    return (
        <div className='min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8'>
            <div className='max-w-6xl mx-auto space-y-6'>
                {/* Profile Setting Section */}
                <div className='bg-white rounded-lg shadow-sm p-6'>
                    <h2 className='text-xl font-semibold text-gray-800 mb-6'>Profile Setting</h2>
                    
                    <form onSubmit={handleSubmit} className='space-y-5'>
                        {/* First Name */}
                        <div className='flex items-center gap-6'>
                            <label className='text-sm font-medium text-gray-700 w-40 flex-shrink-0 text-left'>First Name</label>
                            <input
                                type='text'
                                placeholder='Enter Your First Name'
                                className='flex-1 max-w-md px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                                value={userData.firstName}
                                name='firstName'
                                onChange={handleOnChange}
                                required
                            />
                        </div>

                        {/* Last Name */}
                        <div className='flex items-center gap-6'>
                            <label className='text-sm font-medium text-gray-700 w-40 flex-shrink-0 text-left'>Last Name</label>
                            <input
                                type='text'
                                placeholder='Enter Your Last Name'
                                className='flex-1 max-w-md px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                                value={userData.lastName}
                                name='lastName'
                                onChange={handleOnChange}
                                required
                            />
                        </div>

                        {/* Phone Number */}
                        <div className='flex items-center gap-6'>
                            <label className='text-sm font-medium text-gray-700 w-40 flex-shrink-0 text-left'>Your Phone Number</label>
                            <input
                                type='text'
                                placeholder='Enter Your Number'
                                className='flex-1 max-w-md px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                                value={userData.mobile}
                                name='mobile'
                                onChange={handleOnChange}
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className='flex items-center gap-6'>
                            <label className='text-sm font-medium text-gray-700 w-40 flex-shrink-0 text-left'>Enter Email Address</label>
                            <input
                                type='email'
                                placeholder='Enter Your Email Address'
                                className='flex-1 max-w-md px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                                value={userData.email}
                                name='email'
                                onChange={handleOnChange}
                                required
                            />
                        </div>

                        {/* Photo */}
                        <div className='flex items-center gap-6'>
                            <label className='text-sm font-medium text-gray-700 w-40 flex-shrink-0 text-left'>Photo</label>
                            <div className='flex-1 max-w-md flex items-center gap-3'>
                                <label className='px-4 py-2 bg-teal-600 text-white rounded cursor-pointer hover:bg-teal-700 transition-colors text-sm'>
                                    Chọn tệp
                                    <input
                                        type='file'
                                        accept='image/*'
                                        className='hidden'
                                        onChange={handleFileChange}
                                    />
                                </label>
                                <span className='text-sm text-gray-600'>
                                    {fileName || 'Không có tệp nào được chọn'}
                                </span>
                                {selectedFile && (
                                    <button
                                        type='button'
                                        onClick={handleUploadAvatar}
                                        disabled={loading}
                                        className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:bg-gray-400 text-sm'
                                    >
                                        {loading ? 'Uploading...' : 'Upload'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Password */}
                        <div className='flex items-center gap-6'>
                            <label className='text-sm font-medium text-gray-700 w-40 flex-shrink-0 text-left'>Password</label>
                            <input
                                type='password'
                                placeholder='Enter Your Password'
                                className='flex-1 max-w-md px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                                value={userData.password}
                                name='password'
                                onChange={handleOnChange}
                            />
                        </div>

                        {/* Confirm Password */}
                        <div className='flex items-center gap-6'>
                            <label className='text-sm font-medium text-gray-700 w-40 flex-shrink-0 text-left'>Confirm Password</label>
                            <input
                                type='password'
                                placeholder='Enter Your Confirm Password'
                                className='flex-1 max-w-md px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                                value={userData.confirmPassword}
                                name='confirmPassword'
                                onChange={handleOnChange}
                            />
                        </div>

                        <div className='flex justify-end pt-4'>
                            <button
                                type='submit'
                                disabled={loading}
                                className='px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Address Section */}
                <div className='bg-white rounded-lg shadow-sm p-6'>
                    <div className='flex justify-between items-center mb-6'>
                        <h2 className='text-xl font-semibold text-gray-800'>Address</h2>
                        <button
                            onClick={() => setOpenAddress(true)}
                            className='px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors'
                        >
                            Add Address
                        </button>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {addressList && addressList.length > 0 ? (
                            addressList.map((address) => (
                                <div key={address._id} className='border border-gray-200 rounded-lg p-4 relative hover:shadow-md transition-shadow bg-white'>
                                    <span className='absolute top-3 right-3 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded'>
                                        {address.status === 'home' ? 'Home' : address.status === 'office' ? 'Office' : 'Other'}
                                    </span>
                                    <div className='mb-4 pr-16'>
                                        <p className='font-semibold text-gray-800 mb-2'>{address.name}</p>
                                        <p className='text-sm text-gray-600 mb-1'>{address.address_line}</p>
                                        <p className='text-sm text-gray-600 mb-1'>
                                            {[address.ward, address.district, address.province].filter(Boolean).join(', ')}
                                        </p>
                                        <p className='text-sm text-gray-600 mt-2'>Mobile No. {address.mobile}</p>
                                    </div>
                                    <div className='flex gap-2 mt-4'>
                                        <button
                                            onClick={() => handleEditClick(address)}
                                            className='flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-sm font-medium'
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(address._id)}
                                            className='flex-1 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm font-medium'
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className='col-span-full text-center py-8 text-gray-500'>
                                No addresses found. Click "Add Address" to add one.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            {openAddress && (
                <AddAddress close={() => setOpenAddress(false)} />
            )}

            {openEdit && (
                <EditAddressDetails data={editData} close={() => setOpenEdit(false)} />
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
                    <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
                        <h3 className='text-lg font-semibold mb-4'>Confirm Delete</h3>
                        <p className='text-gray-600 mb-6'>Are you sure you want to delete this address? This action cannot be undone.</p>
                        <div className='flex justify-end gap-3'>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAddress}
                                className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Profile
