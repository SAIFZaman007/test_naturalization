import axiosInstance from "./axiosInstance";

const userService = {
  getProfile: async () => {
    try {
      const response = await axiosInstance.get("/api/trade-entrys/profile");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateProfilePhoto: async (file) => {
    try {
      const formData = new FormData();
      formData.append("profilePic", file);

      const response = await axiosInstance.put("/api/trade-entrys", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateProfile: async (data) => {
    try {
      const response = await axiosInstance.patch(
        "/api/trade-entrys/profile",
        data
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteProfilePhoto: async () => {
    try {
      const formData = new FormData();
      formData.append("profilePic", "");

      const response = await axiosInstance.put("/api/trade-entrys", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default userService;
