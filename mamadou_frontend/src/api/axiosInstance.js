import axios from "axios";
import Cookies from "js-cookie";

const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://mamadou.mtscorporate.com/api/v1";

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

export const api = {
  get: (endpoint, config) => axiosInstance.get(endpoint, config),
  post: (endpoint, data, config) => axiosInstance.post(endpoint, data, config),
  put: (endpoint, data, config) => axiosInstance.put(endpoint, data, config),
  patch: (endpoint, data, config) => axiosInstance.patch(endpoint, data, config),
  delete: (endpoint, config) => axiosInstance.delete(endpoint, config),
};
