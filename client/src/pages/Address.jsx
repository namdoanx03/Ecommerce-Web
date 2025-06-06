import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import AddAddress from '../components/AddAddress'
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import EditAddressDetails from '../components/EditAddressDetails';
import { useAddress } from '../hooks/useAddress';

const Address = () => {
  const addressList = useSelector(state => state.addresses.addressList)
  const [openAddress, setOpenAddress] = useState(false)
  const [OpenEdit, setOpenEdit] = useState(false)
  const [editData, setEditData] = useState({})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [addressToDelete, setAddressToDelete] = useState(null)
  const { deleteAddress } = useAddress()

  const handleDeleteClick = (id) => {
    setAddressToDelete(id)
    setShowDeleteConfirm(true)
  }

  const handleDisableAddress = async () => {
    const success = await deleteAddress(addressToDelete)
    if (success) {
      setShowDeleteConfirm(false)
      setAddressToDelete(null)
    }
  }

  const handleEditClick = (address) => {
    setEditData(address)
    setOpenEdit(true)
  }

  return (
    <div className='relative'>
        <div className='bg-white shadow-lg px-2 py-2 flex justify-between gap-4 items-center '>
            <h2 className='font-semibold text-ellipsis line-clamp-1'>Address</h2>
            <button onClick={()=>setOpenAddress(true)} className='border border-primary-200 text-primary-200 px-3 hover:bg-primary-200 hover:text-black py-1 rounded-full'>
                Add Address
            </button>
        </div>
        <div className='bg-blue-50 p-2 grid gap-4'>
              {
                addressList.map((address,index)=>{
                  return(
                    <div key={address._id} className='border rounded p-3 flex gap-3 bg-white'>
                      <div className='w-full'>
                        <p>{address.address_line}</p>
                        <p>{address.province}</p>
                        <p>{address.district}</p>
                        <p>{address.ward}</p>
                        <p>{address.mobile}</p>
                        <p>{address.email}</p>
                      </div>
                      <div className='grid gap-10'>
                        <button onClick={() => handleEditClick(address)} className='bg-green-200 p-1 rounded hover:text-white hover:bg-green-600'>
                          <MdEdit/>
                        </button>
                        <button onClick={() => handleDeleteClick(address._id)} className='bg-red-200 p-1 rounded hover:text-white hover:bg-red-600'>
                          <MdDelete size={20}/>  
                        </button>
                      </div>
                    </div>
                  )
                })
              }
              <div onClick={()=>setOpenAddress(true)} className='h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer'>
                Add address
              </div>
        </div>

        {openAddress && (
          <AddAddress close={()=>setOpenAddress(false)}/>
        )}

        {OpenEdit && (
          <EditAddressDetails data={editData} close={()=>setOpenEdit(false)}/>
        )}

        {/* Delete Confirmation Modal */}
        <div className={`fixed inset-0 bg-slate-950/50 flex justify-center items-center transition-opacity duration-300 ease-out z-[9999] ${showDeleteConfirm ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className="bg-white rounded-xl shadow-2xl shadow-slate-950/5 border border-slate-200 w-1/3 scale-95">
            <div className="p-4 pb-2 flex justify-between items-center">
              <h1 className="text-lg text-slate-800 font-semibold">Xác nhận xóa</h1>
              <button 
                type="button" 
                onClick={() => setShowDeleteConfirm(false)}
                className="inline-grid place-items-center border align-middle select-none font-sans font-medium text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none data-[shape=circular]:rounded-full text-sm min-w-[34px] min-h-[34px] rounded-md bg-transparent border-transparent text-slate-200-foreground hover:bg-slate-200/10 hover:border-slate-200/10 shadow-none hover:shadow-none outline-none absolute right-2 top-2"
              >
                <svg width="1.5em" height="1.5em" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor" className="h-5 w-5">
                  <path d="M6.75827 17.2426L12.0009 12M17.2435 6.75736L12.0009 12M12.0009 12L6.75827 6.75736M12.0009 12L17.2435 17.2426" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </button>
            </div>
            <div className="p-4 pt-2 text-slate-600">
              Bạn có chắc chắn muốn xóa địa chỉ này không? Hành động này không thể hoàn tác.
            </div>
            <div className="p-4 flex justify-end gap-2">
              <button 
                type="button" 
                onClick={() => setShowDeleteConfirm(false)}
                className="inline-flex items-center justify-center border align-middle select-none font-sans font-medium text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed data-[shape=pill]:rounded-full data-[width=full]:w-full focus:shadow-none text-sm rounded-md py-2 px-4 bg-transparent border-transparent text-red-500 hover:bg-red-500/10 hover:border-red-500/10 shadow-none hover:shadow-none outline-none"
              >
                Hủy
              </button>
              <button 
                type="button"
                onClick={handleDisableAddress}
                className="inline-flex items-center justify-center border align-middle select-none font-sans font-medium text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed data-[shape=pill]:rounded-full data-[width=full]:w-full focus:shadow-none text-sm rounded-md py-2 px-4 shadow-sm hover:shadow-md bg-slate-800 border-slate-800 text-slate-50 hover:bg-slate-700 hover:border-slate-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Address
