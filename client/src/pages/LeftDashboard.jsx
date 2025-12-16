import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { 
    FaHome, 
    FaBox, 
    FaList, 
    FaUser, 
    FaShoppingCart,
    FaTag,
    FaStar,
    FaHeadset,
    FaCog,
    FaChartBar
} from "react-icons/fa";
import { FaChevronRight, FaChevronDown } from "react-icons/fa6";
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import { logout } from '../store/userSlice'
import toast from 'react-hot-toast';

const LeftDashboard = ({ isCollapsed = false }) => {
    const user = useSelector(state => state.user)
    const location = useLocation();
    const [isHovered, setIsHovered] = useState(false);
    const [productMenuOpen, setProductMenuOpen] = useState(false);
    const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
    const [subCategoryMenuOpen, setSubCategoryMenuOpen] = useState(false);
    const [usersMenuOpen, setUsersMenuOpen] = useState(false);
    const [ordersMenuOpen, setOrdersMenuOpen] = useState(false);
    const [couponsMenuOpen, setCouponsMenuOpen] = useState(false);
    const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch()

    // Auto-open menu based on current location
    useEffect(() => {
        if (location.pathname.includes('/category') && !location.pathname.includes('/subcategory')) {
            setCategoryMenuOpen(true);
            setSubCategoryMenuOpen(false);
        } else if (location.pathname.includes('/subcategory')) {
            setSubCategoryMenuOpen(true);
            setCategoryMenuOpen(false);
        } else if (location.pathname.includes('/product')) {
            setProductMenuOpen(true);
        } else if (location.pathname.includes('/users')) {
            setUsersMenuOpen(true);
        } else if (location.pathname.includes('/manage-order')) {
            setOrdersMenuOpen(true);
        }
    }, [location.pathname]);

    const handleLogout = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.logout
            })
            if (response.data.success) {
                dispatch(logout())
                localStorage.clear()
                toast.success(response.data.message)
                navigate("/login")
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    const isActive = (path) => {
        if (path === '/dashboard') {
            return location.pathname === '/dashboard';
        }
        return location.pathname.startsWith(path);
    }

    const menuItems = [
        {
            name: 'Dashboard',
            icon: FaHome,
            path: '/dashboard',
            hasSubmenu: false
        },
        {
            name: 'Product',
            icon: FaBox,
            path: '/dashboard/product',
            hasSubmenu: true,
            submenu: [
                { name: 'Product List', path: '/dashboard/product' },
                { name: 'Add New Product', path: '/dashboard/upload-product' }
            ],
            open: productMenuOpen,
            setOpen: setProductMenuOpen
        },
        {
            name: 'Category',
            icon: FaList,
            path: '/dashboard/category',
            hasSubmenu: true,
            submenu: [
                { name: 'Category List', path: '/dashboard/category' },
                { name: 'Add New Category', path: '/dashboard/upload-category' }
            ],
            open: categoryMenuOpen,
            setOpen: setCategoryMenuOpen
        },
        {
            name: 'Sub Category',
            icon: FaList,
            path: '/dashboard/subcategory',
            hasSubmenu: true,
            submenu: [
                { name: 'Sub Category List', path: '/dashboard/subcategory' },
                { name: 'Add New Sub Category', path: '/dashboard/upload-subcategory' }
            ],
            open: subCategoryMenuOpen,
            setOpen: setSubCategoryMenuOpen
        },
        {
            name: 'Users',
            icon: FaUser,
            path: '/dashboard/users',
            hasSubmenu: true,
            submenu: [
                { name: 'Users List', path: '/dashboard/users' }
            ],
            open: usersMenuOpen,
            setOpen: setUsersMenuOpen
        },
        {
            name: 'Orders',
            icon: FaShoppingCart,
            path: '/dashboard/manage-order',
            hasSubmenu: true,
            submenu: [
                { name: 'Orders List', path: '/dashboard/manage-order' }
            ],
            open: ordersMenuOpen,
            setOpen: setOrdersMenuOpen
        },
        {
            name: 'Coupons',
            icon: FaTag,
            path: '#',
            hasSubmenu: true,
            open: couponsMenuOpen,
            setOpen: setCouponsMenuOpen
        },
        {
            name: 'Product Review',
            icon: FaStar,
            path: '#',
            hasSubmenu: false
        },
        {
            name: 'Support Ticket',
            icon: FaHeadset,
            path: '#',
            hasSubmenu: false
        },
        {
            name: 'Settings',
            icon: FaCog,
            path: '#',
            hasSubmenu: true,
            open: settingsMenuOpen,
            setOpen: setSettingsMenuOpen
        },
        {
            name: 'Reports',
            icon: FaChartBar,
            path: '#',
            hasSubmenu: false
        }
    ]

    const isExpanded = !isCollapsed || isHovered;

    return (
        <div 
            className={`${isExpanded ? 'w-64' : 'w-20'} border-r border-gray-200 min-h-screen sticky top-0 transition-all duration-300 ease-in-out z-40 flex-shrink-0`}
            style={{ 
                overflowY: 'auto', 
                overflowX: 'hidden', 
                maxWidth: isExpanded ? '256px' : '80px',
                backgroundColor: '#0da487'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Logo */}
            <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                    
                    <span 
                        className="text-3xl font-bold text-white transition-opacity duration-300"
                        style={{
                            opacity: isExpanded ? 1 : 0,
                            width: isExpanded ? 'auto' : 0,
                            overflow: 'hidden'
                        }}
                    >
                        Fastkart
                    </span>
                </div>
            </div>
            <nav className="p-4">
                <ul className="space-y-1">
                    {menuItems.map((item, index) => {
                        const Icon = item.icon;
                        // Fix: Category should only be active for category pages, not subcategory
                        let active = false;
                        if (item.name === 'Category') {
                            active = location.pathname === '/dashboard/category' || location.pathname === '/dashboard/upload-category';
                        } else if (item.name === 'Sub Category') {
                            active = location.pathname === '/dashboard/subcategory' || location.pathname === '/dashboard/upload-subcategory';
                        } else if (item.name === 'Orders') {
                            active = location.pathname === '/dashboard/manage-order';
                        } else {
                            active = isActive(item.path);
                        }

                        return (
                            <li key={index} className="relative">
                                {item.hasSubmenu ? (
                                    <>
                                        <button
                                            onClick={() => {
                                                item.setOpen(!item.open)
                                                // If clicking on Orders, also navigate to the page
                                                if (item.name === 'Orders' && item.path) {
                                                    navigate(item.path)
                                                }
                                            }}
                                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors relative ${
                                                active
                                                    ? 'bg-white/20 text-white' 
                                                    : 'text-white/90 hover:bg-white/10'
                                            }`}
                                            style={{ minHeight: '40px' }}
                                        >
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <div 
                                                    className="flex-shrink-0 flex items-center justify-center" 
                                                    style={{ width: '20px', height: '20px', flexShrink: 0 }}
                                                >
                                                    <Icon 
                                                        className={`${active ? 'text-white' : 'text-white/80'}`} 
                                                        size={18}
                                                        style={{ display: 'block', visibility: 'visible' }}
                                                    />
                                                </div>
                                                <span 
                                                    className="font-medium whitespace-nowrap"
                                                    style={{
                                                        opacity: isExpanded ? 1 : 0,
                                                        width: isExpanded ? 'auto' : 0,
                                                        overflow: 'hidden',
                                                        transition: 'opacity 0.3s, width 0.3s',
                                                        color: 'white'
                                                    }}
                                                >
                                                    {item.name}
                                                </span>
                                            </div>
                                            <div 
                                                className="flex-shrink-0"
                                                style={{
                                                    opacity: isExpanded ? 1 : 0,
                                                    transition: 'opacity 0.3s',
                                                    width: isExpanded ? 'auto' : 0,
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                {item.open ? (
                                                    <FaChevronDown className="text-white/80 text-xs" />
                                                ) : (
                                                    <FaChevronRight className="text-white/80 text-xs" />
                                                )}
                                            </div>
                                            {active && (
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                                            )}
                                        </button>
                                        {item.open && item.submenu && (
                                            <ul 
                                                className="mt-1 space-y-1"
                                                style={{
                                                    marginLeft: isExpanded ? '2rem' : 0,
                                                    opacity: isExpanded ? 1 : 0,
                                                    maxHeight: isExpanded ? '500px' : 0,
                                                    overflow: 'hidden',
                                                    transition: 'all 0.3s',
                                                    pointerEvents: isExpanded ? 'auto' : 'none'
                                                }}
                                            >
                                                {item.submenu.map((subItem, subIndex) => (
                                                    <li key={subIndex}>
                                                        <Link
                                                            to={subItem.path}
                                                            className={`block px-3 py-2 rounded-lg text-sm whitespace-nowrap ${
                                                                location.pathname === subItem.path
                                                                    ? 'text-white font-medium bg-white/20'
                                                                    : 'text-white/80 hover:text-white hover:bg-white/10'
                                                            }`}
                                                        >
                                                            {subItem.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        to={item.path}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative ${
                                            active
                                                ? 'bg-white/20 text-white'
                                                : 'text-white/90 hover:bg-white/10'
                                        }`}
                                        style={{ minHeight: '40px' }}
                                    >
                                        <div 
                                            className="flex-shrink-0 flex items-center justify-center" 
                                            style={{ width: '20px', height: '20px', flexShrink: 0 }}
                                        >
                                            <Icon 
                                                className={`${active ? 'text-white' : 'text-white/80'}`} 
                                                size={18}
                                                style={{ display: 'block', visibility: 'visible' }}
                                            />
                                        </div>
                                        <span 
                                            className="font-medium whitespace-nowrap"
                                            style={{
                                                opacity: isExpanded ? 1 : 0,
                                                width: isExpanded ? 'auto' : 0,
                                                overflow: 'hidden',
                                                transition: 'opacity 0.3s, width 0.3s',
                                                color: 'white'
                                            }}
                                        >
                                            {item.name}
                                        </span>
                                        {active && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                                        )}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    )
}

export default LeftDashboard