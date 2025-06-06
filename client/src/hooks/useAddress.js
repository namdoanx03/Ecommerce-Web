import { useDispatch } from 'react-redux';
import { handleAddAddress } from '../store/addressSlice';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';

export const useAddress = () => {
  const dispatch = useDispatch();

  const fetchAddress = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getAddress,
      });
      if (response.data.success) {
        dispatch(handleAddAddress(response.data.data));
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const createAddress = async (data) => {
    try {
      const response = await Axios({
        ...SummaryApi.createAddress,
        data: {
          address_line: data.address_line,
          province: data.province,
          district: data.district,
          ward: data.ward,
          name: data.name,
          mobile: data.mobile,
          email: data.email
        }
      });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchAddress();
        return true;
      }
      return false;
    } catch (error) {
      AxiosToastError(error);
      return false;
    }
  };

  const updateAddress = async (data) => {
    try {
      const response = await Axios({
        ...SummaryApi.updateAddress,
        data: {
          ...data,
          _id: data._id
        }
      });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchAddress();
        return true;
      }
      return false;
    } catch (error) {
      AxiosToastError(error);
      return false;
    }
  };

  const deleteAddress = async (id) => {
    try {
      const response = await Axios({
        ...SummaryApi.disableAddress,
        data: { _id: id }
      });
      if (response.data.success) {
        toast.success('Đã xóa địa chỉ!');
        await fetchAddress();
        return true;
      }
      return false;
    } catch (error) {
      AxiosToastError(error);
      return false;
    }
  };

  return {
    fetchAddress,
    createAddress,
    updateAddress,
    deleteAddress
  };
}; 