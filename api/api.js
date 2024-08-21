import axios from 'axios';
import router from 'next/router';
import {
  __access_token_key,
  __reset_password_data_key,
  __user_key,
} from '../config/globalConfig';
import routes from '../config/routes';
import { addRedirectQuery, setFlashMessage } from '../helpers/helpers';
import { getLocal, getSession, removeBoth } from '../lib/localStorage';

const access_token =
  getLocal(__access_token_key) || getSession(__access_token_key);

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: { Authorization: `Bearer ${access_token}` },
});

api.interceptors.response.use(undefined, (err) => {
  const responseErrorAction = err?.response?.data?.action;

  if (responseErrorAction === 'logout') {
    removeBoth(__user_key);
    removeBoth(__access_token_key);
    setFlashMessage('Your session has expired, Please login again');
    router.push(routes.login.name + addRedirectQuery(router));
  }

  return Promise.reject(err);
});

export const getPaymentMethod = async () => api.get('/payment-method');
export const getUserProfile = async () => api.get('/user/profile');
export const getUserStat = async () => api.get('/my-stat');
export const getUserTransactions = async ({ pageParam = 1 }) =>
  api.get(`/usertransaction?page=${pageParam}`);
export const getUserOrders = async ({ pageParam = 1 }) =>
  api.get(`/myorder?page=${pageParam}`);
export const getUserTotalSpentAndTotalOrderCount = async () =>
  api.get('/user-total-spent-and-order-count');
export const getTopupPaymentMethod = async () =>
  api.get(`/topup-payment-method/active`);
export const getOrderDetailsById = async (id) => api.get(`/orders/${id}`);
export const getPopupNotice = async () => api.get('/notice-modal?type=popup');
export const getFlatNotice = async () =>
  api.get('/notice-modal?type=flat_page_top');
export const getMyShopLists = async ({ pageParam = 1 }) =>
  api.get(`/my-shop-lists?page=${pageParam}`);

export const getTopupPackage = async (id) => api.get(`/topuppackage/${id}`);

export const reSendOtp = async () => {
  const data = getSession(__reset_password_data_key);
  const user_id = data?.user?.id;

  if (!user_id) return undefined;
  return api.get(`/reset-password-otp/${user_id}`);
};

export default api;
