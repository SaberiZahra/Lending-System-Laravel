import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api', // آدرس بک‌اند لاراول
    withCredentials: true, // برای ارسال کوکی‌ها
});

export default api;
