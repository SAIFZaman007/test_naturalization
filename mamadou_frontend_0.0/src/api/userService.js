import api from './apiService';

const userService = {
  // Get current user profile
  async getProfile() {
    try {
      const response = await api.get('/users/info/me', {
        showToast: false
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile - FIXED ROUTE
  async updateProfile(data) {
    try {
      const response = await api.patch('/users/update/info', data, {
        showToast: true
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update profile photo
  async updateProfilePhoto(file) {
    try {
      const formData = new FormData();
      formData.append('profile_image', file);

      const response = await api.post('/users/update_profile_image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        showToast: false
      });

      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete profile photo
  async deleteProfilePhoto() {
    try {
      const response = await api.delete('/users/profile/photo', {
        showToast: false
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default userService;