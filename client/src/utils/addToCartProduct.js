import toast from "react-hot-toast"
import SummaryApi from "../common/SummaryApi"
import Axios from "./Axios"
import AxiosToastError from "./AxiosToastError"

export const addToCartProduct = async(productId, qty) => {
    try {
        const response = await Axios({
            ...SummaryApi.addToCart,
            data : {
                quantity : qty,
                productId : productId
            }
        })

        const { data : responseData } = response

        if(responseData.success){
            toast.success(responseData.message)
            return responseData
        }

    } catch (error) {
        if (error.response?.data?.message) {
            toast.error(error.response.data.message)
        } else {
            AxiosToastError(error)
        }
        return { success: false }
    }
}

export const getCartItems = async() => {
    try {
        const response = await Axios({
            ...SummaryApi.getCartItems
        })

        const { data : responseData } = response

        if(responseData.success){
            return responseData 
        }
        return { success: false }
    } catch (error) {
        AxiosToastError(error)
        return { success: false }
    }
}