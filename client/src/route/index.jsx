import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import OtpVerification from "../pages/OtpVerification";
import ResetPassword from "../pages/ResetPassword";
import UserMenuMobile from "../pages/UserMenuMobile";
import Dashboard from "../layouts/Dashboard";
import Profile from "../pages/Profile";
import MyOrders from "../pages/MyOrders";
import Address from "../pages/Address";
import CategoryPage from "../pages/CategoryPage";
import SubCategoryPage from "../pages/SubCategoryPage";
import UploadProduct from "../pages/UploadProduct";
import ProductAdmin from "../pages/ProductAdmin";
import UploadCategory from "../pages/UploadCategory";
import UploadSubCategory from "../pages/UploadSubCategory";
import AdminPermision from "../layouts/AdminPermision";
import ProductListPage from "../pages/ProductListPage";
import ProductDisplayPage from "../pages/ProductDisplayPage";
import CartMobile from "../pages/CartMobile";
import CheckoutPage from "../pages/CheckoutPage";
import Success from "../pages/Success";
import Cancel from "../pages/Cancel";
import Product from "../pages/Product";
import HotOffers from "../pages/HotOffers";
import SalePage from "../pages/SalePage";
import DashboardPage from "../pages/DashboardPage";
import ManageOrder from "../pages/ManageOrder";
import CheckPayment from "../pages/CheckPayment";
import UserAdmin from "../pages/UserAdmin";
import OrderDetail from "../pages/OrderDetail";
import ManageVoucher from "../pages/ManageVoucher";
import AddVoucher from "../pages/AddVoucher";

const router = createBrowserRouter([
    {
        path : "/",
        element : <App/>,
        children : [
            {
                path : "",
                element : <Home/>
            },
            {
                path : "search",
                element : <SearchPage/>
            },
            {
                path : 'login',
                element : <Login/>
            },
            {
                path : "register",
                element : <Register/>
            },
            {
                path : "forgot-password",
                element : <ForgotPassword/>
            },
            {
                path : "verification-otp",
                element : <OtpVerification/>
            },
            {
                path : "reset-password",
                element : <ResetPassword/>
            },
            {
                path : "user",
                element : <UserMenuMobile/>
            },
            {
                path : "hot-offers",
                element : <HotOffers/>
            },
            {
                path : "sale",
                element : <SalePage/>
            },
            {
                path : "profile",
                element : <Profile/>
            },
            {
                path : "myorders",
                element : <MyOrders/>
            },
            {
                path : "dashboard",
                element : <Dashboard/>,
                children : [
                    {
                        path : "profile-setting",
                        element : <Profile/>
                    },
                    
                    {
                        path : "address",
                        element : <Address/>
                    },
                    {
                        path : '',
                        element : <AdminPermision><DashboardPage/></AdminPermision>
                    },
                    {
                        path : 'category',
                        element : <AdminPermision><CategoryPage/></AdminPermision>
                    },
                    {
                        path : 'upload-category',
                        element : <AdminPermision><UploadCategory/></AdminPermision>
                    },
                    {
                        path : 'manage-order',
                        element : <AdminPermision><ManageOrder/></AdminPermision>
                    },
                    {
                        path : 'order-detail/:orderId',
                        element : <AdminPermision><OrderDetail/></AdminPermision>
                    },
                    {
                        path : "subcategory",
                        element : <AdminPermision><SubCategoryPage/></AdminPermision>
                    },
                    {
                        path : "upload-subcategory",
                        element : <AdminPermision><UploadSubCategory/></AdminPermision>
                    },
                    {
                        path : 'upload-product',
                        element : <AdminPermision><UploadProduct/></AdminPermision>
                    },
                    {
                        path : 'product',
                        element : <AdminPermision><ProductAdmin/></AdminPermision>
                    },
                    {
                        path : 'users',
                        element : <AdminPermision><UserAdmin/></AdminPermision>
                    },
                    {
                        path : 'voucher',
                        element : <AdminPermision><ManageVoucher/></AdminPermision>
                    },
                    {
                        path : 'add-voucher',
                        element : <AdminPermision><AddVoucher/></AdminPermision>
                    }
                ]
            },
            {
                path : ":category",
                children : [
                    {
                        path : ":subCategory",
                        element : <ProductListPage/>
                    }
                ]
            },
            {
                path : "product",
                element : <Product/>
            },
            {
                path : "product/:product",
                element : <ProductDisplayPage/>
            },
            {
                path : 'cart',
                element : <CartMobile/>
            },
            {
                path : "checkout",
                element : <CheckoutPage/>
            },
            {
                path : "success",
                element : <Success/>
            },
            {
                path : 'cancel',
                element : <Cancel/>
            },
            {
                path : "check-payment",
                element : <CheckPayment/>
            }
        ]
    }
])

export default router