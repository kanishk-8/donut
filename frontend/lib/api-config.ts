/**
 * API Configuration
 *
 * This file centralizes the backend API configuration.
 * Set the NEXT_PUBLIC_BACKEND_URL environment variable to override the default.
 */

export const API_CONFIG = {
    // Backend base URL - defaults to localhost:8080
    // Override with NEXT_PUBLIC_BACKEND_URL environment variable
    BACKEND_URL:
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/api",

    // API endpoints
    ENDPOINTS: {
        // Auth endpoints
        AUTH: {
            LOGIN: "/auth/login",
            SIGNUP: "/auth/sign-up",
            LOGOUT: "/auth/logout",
        },
        USER: {
            ME: "/user/me",
        },
        // Project endpoints
        PROJECTS: {
            LIST: "/user/projects",
            GET: (id: string) => `/user/projects/${id}`,
            CREATE: "/user/projects",
            UPDATE: (id: string) => `/user/projects/${id}`,
            DELETE: (id: string) => `/user/projects/${id}`,
        },
    },
};

/**
 * Helper to get full API URL
 */
export const getApiUrl = (endpoint: string): string => {
    return `${API_CONFIG.BACKEND_URL}${endpoint}`;
};
