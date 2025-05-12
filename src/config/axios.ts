import axios, { AxiosInstance } from 'axios';

const API = process.env.VUE_APP_BASE_URL;

const instance: AxiosInstance = axios.create({
    baseURL: API,
    timeout: 30_000,
})

export default instance;