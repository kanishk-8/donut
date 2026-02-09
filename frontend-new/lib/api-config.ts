/**
 * API Configuration
 *
 * This file centralizes the backend API configuration.
 * Set the NEXT_PUBLIC_BACKEND_URL environment variable to override the default.
 */

export const API_CONFIG = {
    // Backend base URL - defaults to localhost:8080
    // Override with NEXT_PUBLIC_BACKEND_URL environment variable
    BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080",

    // API endpoints
    ENDPOINTS: {
        // Auth endpoints
        AUTH: {
            LOGIN: "/auth/login",
            SIGNUP: "/auth/signup",
            LOGOUT: "/auth/logout",
            ME: "/auth/me",
        },
        // Project endpoints
        PROJECTS: {
            LIST: "/projects",
            GET: (id: string) => `/projects/${id}`,
            CREATE: "/projects",
            UPDATE: (id: string) => `/projects/${id}`,
            DELETE: (id: string) => `/projects/${id}`,
        },
    },
};

/**
 * Helper to get full API URL
 */
export const getApiUrl = (endpoint: string): string => {
    return `${API_CONFIG.BACKEND_URL}${endpoint}`;
};

/**
 * Helper to get auth headers
 */
export const getAuthHeaders = (): HeadersInit => {
    const token = typeof window !== "undefined" ? localStorage.getItem("donut_token") : null;

    return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};
