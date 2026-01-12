import axiosInstance from './axiosInstance';

const tradeService = {
  createTrade: async (tradeData) => {
    try {
      const response = await axiosInstance.post('/api/trades', tradeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getTrades: async (page = 1, limit = 10) => {
    try {
      const response = await axiosInstance.get(
        `/api/trades?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getDashboardStats: async () => {
    try {
      const response = await axiosInstance.get('/api/trades/dashboard');
      const data = response.data;
      return Array.isArray(data) ? data[0] : data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteTrade: async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/trades/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default tradeService;
