import axios from "axios";

/**
 * Base Axios Instance
 * - JSON APIs
 * - Auto attach Bearer token
 * - Central error handling
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

/* ============================================================
   REQUEST INTERCEPTOR – ATTACH TOKEN
   ============================================================ */
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ============================================================
   RESPONSE INTERCEPTOR – HANDLE AUTH ERRORS
   ============================================================ */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    // Token expired / invalid
    if (status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("signup_phone");

      // Hard redirect to signup
      window.location.href = "/signup";
    }

    return Promise.reject(error);
  }
);
