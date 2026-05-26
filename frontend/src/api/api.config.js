// src/api/api.config.js
// Central axios instance for Santa Bank Spring Boot backend.
//
// IMPORTANT:
// This backend does NOT use JWT refresh/access flow in the current codebase.
// So we keep the client simple: no Authorization headers, no refresh interceptor.
//
// If you later add auth tokens/cookies, this is the only file you should touch.

import axios from "axios";

// Spring Boot runs on 8080 by default.
// Prefer REACT_APP_API_BASE_URL (project docs). Keep REACT_APP_API_URL for compatibility.
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  process.env.REACT_APP_API_URL ||
  "http://localhost:8080";
const API_TIMEOUT = 30000;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  // Keep enabled: if backend later uses cookies/sessions, it will still work.
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const { response } = error;

    if (!response) {
      return Promise.reject(new Error("Network error. Please check your connection."));
    }

    // Backend sometimes returns plain text.
    const backendMessage =
      typeof response.data === "string" ? response.data : response.data?.message;

    const msg = backendMessage || (() => {
      switch (response.status) {
        case 400:
          return "Bad request.";
        case 401:
          return "Unauthorized.";
        case 403:
          return "Forbidden.";
        case 404:
          return "Not found.";
        case 422:
          return "Validation failed.";
        case 500:
          return "Server error. Please try again later.";
        default:
          return "An error occurred.";
      }
    })();

    return Promise.reject(new Error(msg));
  }
);

export const apiMethods = {
  get: (url, config = {}) => api.get(url, config),
  post: (url, data = {}, config = {}) => api.post(url, data, config),
  put: (url, data = {}, config = {}) => api.put(url, data, config),
  patch: (url, data = {}, config = {}) => api.patch(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),
};

export default api;
