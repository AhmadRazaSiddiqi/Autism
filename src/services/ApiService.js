// src/services/ApiService.js
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/";

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // ✅ Auto attach token from localStorage
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    });
  }

  // ✅ Login
  async login(data) {
    const response = await this.api.post("auth/login", data);
    if (response?.data?.token) {
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response;
  }

  // ✅ Get Quizzes
  getQuizzes() {
    return this.api.get("quizzes");
  }

  // ✅ Get Dashboard Stats
  getDashboardStats() {
    return this.api.get("admin/dashboard");
  }

  // ✅ Get Users
  getUsers() {
    return this.api.get("admin/users");
  }

  get(path, params = {}) {
    return this.api.get(path, { params });
  }

  post(path, data) {
    return this.api.post(path, data);
  }

  put(path, data) {
    return this.api.put(path, data);
  }

  delete(path) {
    return this.api.delete(path);
  }

  bindInterceptors(requestCb, responseCb, errorCb) {
    this.api.interceptors.request.use(requestCb, errorCb);
    this.api.interceptors.response.use(responseCb, errorCb);
  }
}

export default new ApiService();
