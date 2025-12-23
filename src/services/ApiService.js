// src/services/ApiService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {},
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

  // ✅ Get Resources
  getResources(params = {}) {
    return this.api.get("resources", { params });
  }

  // ✅ Create Resource
  createResource(data) {
    return this.api.post("resources", data, { skipGlobalError: true });
  }

  // ✅ Get Users
  getUsers() {
    return this.api.get("admin/users");
  }

  // ✅ Get User Details
  getUserDetails(id) {
    return this.api.get(`admin/users/${id}`);
  }

  // ✅ Get Quiz Details
  getQuizDetails(id) {
    return this.api.get(`quizzes/quiz/${id}`);
  }

  getQuizQuestions(id) {
    return this.api.get(`quizzes/${id}/questions`);
  }

  // ✅ Create Quiz
  createQuiz(data) {
    return this.api.post("quizzes", data, { skipGlobalError: true });
  }

  // ✅ Update Quiz
  updateQuiz(id, data) {
    return this.api.put(`quizzes/quiz/${id}`, data, { skipGlobalError: true });
  }

  // ✅ Delete Quiz
  deleteQuiz(id) {
    return this.api.delete(`quizzes/quiz/${id}`, { skipGlobalError: true });
  }

  // ✅ Delete User
  deleteUser(id) {
    return this.api.delete(`admin/users/${id}`, { skipGlobalError: true });
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
