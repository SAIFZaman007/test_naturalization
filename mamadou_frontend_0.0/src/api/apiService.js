/**
 * Professional API Service
 * 
 * This service handles all axios operations:
 * - GET, POST, PUT, PATCH, DELETE requests
 * - File upload/download
 * - Request cancellation
 * - Retry logic
 * - Error handling
 * - Response caching
 * - Request/Response interceptors
 */

import axiosInstance from './axiosInstance';
import { toast } from 'react-toastify';

/**
 * API Response Structure
 */
class ApiResponse {
  constructor(success, data = null, message = '', errors = null) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.errors = errors;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Main API Service Class
 */
class ApiService {
  constructor() {
    this.axiosInstance = axiosInstance;
    this.cancelTokens = new Map();
    this.cache = new Map();
  }

  /**
   * Response Handler - Handles successful responses
   */
  handleResponse(response) {
    const { data, status } = response;

    // Check if backend already sends structured response
    if (data && typeof data === 'object' && 'success' in data) {
      return data;
    }

    // Create structured response
    return new ApiResponse(
      true,
      data,
      data?.message || 'Success',
      null
    );
  }

  /**
   * Error Handler - Handles all errors
   */
  handleError(error) {
    // Network error
    if (!error.response) {
      toast.error('Network error occurred. Please check your internet connection.');
      return new ApiResponse(
        false,
        null,
        'Network error. Please check your connection.',
        null
      );
    }

    const { status, data } = error.response;
    let message = data?.message || 'Something went wrong.';

    // Handle different error codes
    switch (status) {
      case 400:
        toast.error(message);
        break;
      case 401:
        toast.error('Session expired. Please login again.');
        break;
      case 403:
        toast.error('You do not have permission to perform this action.');
        break;
      case 404:
        toast.error('Data not found.');
        break;
      case 422:
        // Validation errors - show error for each field
        if (data?.errors) {
          Object.values(data.errors).forEach((err) => {
            toast.error(Array.isArray(err) ? err[0] : err);
          });
        } else if (data?.detail) {
          toast.error(data.detail);
        }
        break;
      case 429:
        toast.error('Too many requests. Please wait a moment.');
        break;
      case 500:
      case 502:
      case 503:
        toast.error('Server error occurred. Please try again later.');
        break;
      default:
        toast.error(message);
    }

    return new ApiResponse(
      false,
      null,
      message,
      data?.errors || null
    );
  }

  /**
   * GET Request - For fetching data
   * 
   * @example
   * const result = await api.get('/users');
   * const result = await api.get('/users', { params: { page: 1 } });
   * const result = await api.get('/users', { cache: true });
   */
  async get(url, options = {}) {
    try {
      const { params = {}, cache = false, ...config } = options;

      // Check cache if enabled
      const cacheKey = `${url}?${JSON.stringify(params)}`;
      if (cache && this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < 300000) { // 5 minutes
          return cached.data;
        }
        this.cache.delete(cacheKey);
      }

      const response = await this.axiosInstance.get(url, {
        params,
        ...config,
      });

      const result = this.handleResponse(response);

      // Cache if enabled
      if (cache && result.success) {
        this.cache.set(cacheKey, {
          data: result,
          timestamp: Date.now(),
        });
      }

      return result;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * POST Request - For sending new data
   * 
   * @example
   * const result = await api.post('/users', { name: 'John', email: 'john@example.com' });
   * const result = await api.post('/login', credentials, { showToast: false });
   */
  async post(url, data = null, options = {}) {
    try {
      const { showToast = true, clearCache = true, ...config } = options;

      const response = await this.axiosInstance.post(url, data, config);
      const result = this.handleResponse(response);

      if (result.success && showToast && result.message) {
        toast.success(result.message);
      }

      // Clear cache after successful POST
      if (result.success && clearCache) {
        this.cache.clear();
      }

      return result;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * PUT Request - For updating data (complete replace)
   * 
   * @example
   * const result = await api.put('/users/1', { name: 'John Doe', email: 'john@example.com' });
   */
  async put(url, data = null, options = {}) {
    try {
      const { showToast = true, clearCache = true, ...config } = options;

      const response = await this.axiosInstance.put(url, data, config);
      const result = this.handleResponse(response);

      if (result.success && showToast && result.message) {
        toast.success(result.message);
      }

      if (result.success && clearCache) {
        this.cache.clear();
      }

      return result;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * PATCH Request - For updating data (partial update)
   * 
   * @example
   * const result = await api.patch('/users/1', { name: 'John Updated' });
   */
  async patch(url, data = null, options = {}) {
    try {
      const { showToast = true, clearCache = true, ...config } = options;

      const response = await this.axiosInstance.patch(url, data, config);
      const result = this.handleResponse(response);

      if (result.success && showToast && result.message) {
        toast.success(result.message);
      }

      if (result.success && clearCache) {
        this.cache.clear();
      }

      return result;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * DELETE Request - For deleting data
   * 
   * @example
   * const result = await api.delete('/users/1');
   * const result = await api.delete('/users/1', { data: { reason: 'spam' } });
   */
  async delete(url, options = {}) {
    try {
      const { showToast = true, clearCache = true, data = null, ...config } = options;

      const response = await this.axiosInstance.delete(url, {
        ...config,
        data,
      });

      const result = this.handleResponse(response);

      if (result.success && showToast) {
        toast.success(result.message || 'Successfully deleted.');
      }

      if (result.success && clearCache) {
        this.cache.clear();
      }

      return result;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * File Upload - For uploading files
   * 
   * @example
   * const result = await api.uploadFile('/upload', file, 'profilePic');
   * const result = await api.uploadFile('/upload', file, 'avatar', { 
   *   onProgress: (progress) => console.log(progress)
   * });
   */
  async uploadFile(url, file, fieldName = 'file', options = {}) {
    try {
      const { onProgress, additionalData = {}, ...config } = options;

      const formData = new FormData();
      formData.append(fieldName, file);

      // Add additional data
      Object.keys(additionalData).forEach((key) => {
        formData.append(key, additionalData[key]);
      });

      const response = await this.axiosInstance.post(url, formData, {
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(progress);
          }
        },
      });

      const result = this.handleResponse(response);

      if (result.success) {
        toast.success('File uploaded successfully.');
      }

      return result;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * File Download - For downloading files
   * 
   * @example
   * await api.downloadFile('/export/pdf', 'report.pdf');
   */
  async downloadFile(url, filename, options = {}) {
    try {
      const response = await this.axiosInstance.get(url, {
        ...options,
        responseType: 'blob',
      });

      // Create download link
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast.success('Download started.');
      return new ApiResponse(true, null, 'Download started');
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Batch Requests - For sending multiple requests together
   * 
   * @example
   * const results = await api.batchRequests([
   *   { method: 'get', url: '/users' },
   *   { method: 'get', url: '/posts' },
   *   { method: 'post', url: '/logs', data: { action: 'view' } }
   * ]);
   */
  async batchRequests(requests) {
    try {
      const promises = requests.map((req) => {
        const { method, url, data, options = {} } = req;

        switch (method.toLowerCase()) {
          case 'get':
            return this.get(url, options);
          case 'post':
            return this.post(url, data, options);
          case 'put':
            return this.put(url, data, options);
          case 'patch':
            return this.patch(url, data, options);
          case 'delete':
            return this.delete(url, options);
          default:
            return Promise.reject(new Error(`Unsupported method: ${method}`));
        }
      });

      const results = await Promise.allSettled(promises);

      return {
        success: results.every((r) => r.status === 'fulfilled' && r.value.success),
        results: results.map((r) =>
          r.status === 'fulfilled' ? r.value : { success: false, error: r.reason }
        ),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Request with Retry - Will retry on failure
   * 
   * @example
   * const result = await api.requestWithRetry('get', '/data', null, { retries: 3 });
   */
  async requestWithRetry(method, url, data = null, options = {}) {
    const { retries = 3, retryDelay = 1000, ...otherOptions } = options;
    let lastError;

    for (let i = 0; i <= retries; i++) {
      try {
        switch (method.toLowerCase()) {
          case 'get':
            return await this.get(url, otherOptions);
          case 'post':
            return await this.post(url, data, otherOptions);
          case 'put':
            return await this.put(url, data, otherOptions);
          case 'patch':
            return await this.patch(url, data, otherOptions);
          case 'delete':
            return await this.delete(url, otherOptions);
          default:
            throw new Error(`Unsupported method: ${method}`);
        }
      } catch (error) {
        lastError = error;
        if (i < retries) {
          // Wait before retry
          await new Promise((resolve) => setTimeout(resolve, retryDelay * (i + 1)));
        }
      }
    }

    return this.handleError(lastError);
  }

  /**
   * Cancel Request - For canceling ongoing requests
   * 
   * @example
   * const cancelToken = api.getCancelToken('search');
   * api.get('/search', { cancelToken });
   * // To cancel later
   * api.cancelRequest('search');
   */
  getCancelToken(key) {
    const source = this.axiosInstance.CancelToken.source();
    this.cancelTokens.set(key, source);
    return source.token;
  }

  cancelRequest(key) {
    const source = this.cancelTokens.get(key);
    if (source) {
      source.cancel(`Request ${key} cancelled by user.`);
      this.cancelTokens.delete(key);
    }
  }

  cancelAllRequests() {
    this.cancelTokens.forEach((source, key) => {
      source.cancel(`Request ${key} cancelled.`);
    });
    this.cancelTokens.clear();
  }

  /**
   * Clear Cache - For clearing cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Get Axios Instance - Direct axios instance access
   */
  getAxiosInstance() {
    return this.axiosInstance;
  }
}

// Create singleton instance
const api = new ApiService();

export default api;
export { ApiService, ApiResponse };
