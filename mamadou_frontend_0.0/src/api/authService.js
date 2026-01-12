import axiosInstance from './axiosInstance';

const authService = {
  sendOtp: async (email) => {
    try {
      const response = await axiosInstance.post('/api/auth/send-otp', {
        email,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  verifyOtp: async (email, otp) => {
    try {
      const response = await axiosInstance.post('/api/auth/verify-otp', {
        email,
        otp,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  register: async (fname, lname, email, password) => {
    try {
      const response = await axiosInstance.post('/api/auth/register', {
        fname,
        lname,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  simpleRegister: async (email, password, username) => {
    try {
      const response = await axiosInstance.post('/api/auth/simple-register', {
        email,
        password,
        username,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  login: async (email, password) => {
    try {
      const response = await axiosInstance.post('/api/auth/login', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  forgotPassword: async (email, password) => {
    try {
      const response = await axiosInstance.post('/api/auth/forgot-password', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  googleSignup: async (idToken) => {
    try {
      const response = await axiosInstance.post('/api/auth/google-signup', {
        idToken,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  googleSignin: async (idToken) => {
    try {
      const response = await axiosInstance.post('/api/auth/google-signin', {
        idToken,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default authService;
