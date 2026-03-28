import axios from "axios";
import { API_CONFIG } from "./api-config";

/**
 * Main API client used by the app.
 * - includes a timeout to avoid hanging requests
 * - withCredentials true so cookies are sent
 */
const api = axios.create({
    baseURL: API_CONFIG.BACKEND_URL,
    withCredentials: true,
    timeout: 10000, // 10s timeout to avoid indefinite hanging
});

/**
 * Separate client used exclusively for refreshing tokens.
 * This client intentionally has no interceptors so the refresh request
 * can't trigger the response interceptor and cause recursion.
 */
const refreshClient = axios.create({
    baseURL: API_CONFIG.BACKEND_URL,
    withCredentials: true,
    timeout: 10000,
});

let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

/**
 * Performs a single refresh request using the refreshClient.
 * Multiple callers will wait on the same promise (single-flight).
 */
const doRefresh = async () => {
    if (isRefreshing && refreshPromise) {
        return refreshPromise;
    }
    isRefreshing = true;
    refreshPromise = (async () => {
        try {
            const res = await refreshClient.get(
                API_CONFIG.ENDPOINTS.USER.REFRESH,
            );
            return res;
        } finally {
            isRefreshing = false;
            refreshPromise = null;
        }
    })();
    return refreshPromise;
};

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error?.config;
        if (!originalRequest) return Promise.reject(error);

        // Avoid attempting refresh for the refresh endpoint itself
        const isRefreshEndpoint =
            originalRequest.url &&
            originalRequest.url
                .toString()
                .includes(API_CONFIG.ENDPOINTS.USER.REFRESH);

        if (
            !isRefreshEndpoint &&
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            try {
                await doRefresh();
                // After successful refresh, retry the original request with the main client
                return api(originalRequest);
            } catch (refreshErr) {
                // Refresh failed — propagate the original refresh error
                return Promise.reject(refreshErr);
            }
        }
        return Promise.reject(error);
    },
);

export default api;
