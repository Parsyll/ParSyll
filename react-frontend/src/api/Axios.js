import axios from 'axios';
import { getJWTToken } from '../helper/jwt';

const parseApp = axios.create({
  baseURL: process.env.REACT_APP_PARSEAPP_URL
  // baseURL: 'http://localhost:8000/'
});

parseApp.interceptors.request.use(config => {
    const token = getJWTToken();
    config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  });

export default parseApp;