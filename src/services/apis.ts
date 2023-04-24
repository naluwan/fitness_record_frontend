import axios from 'axios';
import Cookies from 'js-cookie';
import type { Record } from 'types';

const JWT_TOKEN = 'JWT_TOKEN';
const API_URL = 'http://localhost:3000';
const axiosInstance = axios.create();

// 驗證token
export const getJWTToken = () => {
  return Cookies.get(JWT_TOKEN);
};

// 清除token
export const cleanToken = () => {
  Cookies.remove(JWT_TOKEN);
  delete axiosInstance.defaults.headers.authorization;
};

// 設定token
export const setToken = (token: string) => {
  Cookies.set(JWT_TOKEN, token);
  axiosInstance.defaults.headers.authorization = `Bearer ${token}`;
};

// 驗證token
export const verifyToken = async (token: string) => {
  try {
    const { data } = await axios.get(`${API_URL}/auth`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (err) {
    cleanToken();
    return Promise.reject(err);
  }
};

export const fetchRecords = async (): Promise<Record[] | unknown> => {
  try {
    const { data } = await axios.get(`${API_URL}/records`);
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
};