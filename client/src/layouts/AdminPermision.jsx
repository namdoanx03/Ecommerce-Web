import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import isAdmin from '../utils/isAdmin'

const AdminPermision = ({children}) => {
    const user = useSelector(state => state.user)
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        // Kiểm tra xem có token không
        const accessToken = localStorage.getItem('accesstoken')
        
        // Nếu không có token, không cần đợi
        if (!accessToken) {
            setIsReady(true)
            return
        }

        // Nếu có token, kiểm tra xem user data đã được load chưa
        if (user._id && user._id !== "") {
            // User data đã được load
            setIsReady(true)
            return
        }

        // Nếu có token nhưng user._id chưa có, đợi user data được load
        // Đợi tối đa 2 giây
        const timer = setTimeout(() => {
            setIsReady(true)
        }, 2000)

        return () => clearTimeout(timer)
    }, [user._id])

    // useEffect thứ 2: theo dõi sự thay đổi của user._id
    useEffect(() => {
        const accessToken = localStorage.getItem('accesstoken')
        
        // Nếu có token và user._id đã có, sẵn sàng kiểm tra quyền
        if (accessToken && user._id && user._id !== "") {
            setIsReady(true)
        }
    }, [user._id])

    // Chỉ hiển thị nội dung sau khi đã sẵn sàng (user data đã load hoặc không có token)
    // Điều này ngăn việc hiển thị "Do not have permission" trước khi user data được load
    if (!isReady) {
        return null // Không hiển thị gì cho đến khi sẵn sàng
    }

    // Sau khi đã sẵn sàng, mới kiểm tra quyền
    return (
        <div className='h-[100vh]'>
            {
                isAdmin(user.role) ?  children : <p className='text-red-600 bg-red-100 p-4'>Do not have permission</p>
            }
        </div>
    )
}

export default AdminPermision
