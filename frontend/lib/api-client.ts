import axios from "axios";
import { API_CONFIG, getApiUrl } from "./api-config";

const api = axios.create({
    baseURL: API_CONFIG.BACKEND_URL,
    withCredentials: true,
});

let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

const doRefresh = async () => {
    if (isRefreshing && refreshPromise) {
        return refreshPromise;
    }
    isRefreshing = true;
    refreshPromise = api.get(API_CONFIG.ENDPOINTS.USER.REFRESH).finally(() => {
        isRefreshing = false;
        refreshPromise = null;
    });
    return refreshPromise;
};

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;
        if (!originalRequest) return Promise.reject(error);

        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            try {
                await doRefresh();
                return api(originalRequest);
            } catch (refreshErr) {
                // refresh failed - optional: call logout endpoint or propagate error
                return Promise.reject(refreshErr);
            }
        }
        return Promise.reject(error);
    },
);

export default api;
