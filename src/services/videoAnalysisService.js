import axiosInstance from './axiosInstance';

/**
 * Service for Video Analysis API operations
 * Handles upload, listing, details, status polling, and deletion of video analyses.
 */
const videoAnalysisService = {
  /**
   * Upload a video for analysis
   * @param {File} videoFile - Video file to upload
   * @param {string} title - Optional title for the analysis
   * @returns {Promise} - Response containing analysis ID and status
   */
  uploadVideo: async (videoFile, title = '') => {
    const formData = new FormData();
    formData.append('video', videoFile);
    if (title) {
      formData.append('title', title);
    }

    try {
      const response = await axiosInstance.post('video-analysis/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    }
  },

  /**
   * Get list of video analyses
   * @param {object} params - Query parameters (status, page, page_size)
   * @returns {Promise} - Paginated list of analyses
   */
  getAnalyses: async (params = {}) => {
    try {
      const response = await axiosInstance.get('video-analysis/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching analyses:', error);
      throw error;
    }
  },

  /**
   * Get details of a specific analysis
   * @param {number|string} id - Analysis ID
   * @returns {Promise} - Detailed analysis object
   */
  getAnalysisDetails: async (id) => {
    try {
      const response = await axiosInstance.get(`video-analysis/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching analysis details for ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get current status of an analysis (lightweight endpoint for polling)
   * @param {number|string} id - Analysis ID
   * @returns {Promise} - Status object
   */
  getAnalysisStatus: async (id) => {
    try {
      const response = await axiosInstance.get(`video-analysis/${id}/status/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching status for ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete an analysis
   * @param {number|string} id - Analysis ID
   * @returns {Promise} - Success response
   */
  deleteAnalysis: async (id) => {
    try {
      await axiosInstance.delete(`video-analysis/${id}/`);
      return { success: true };
    } catch (error) {
      console.error(`Error deleting analysis ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Download PDF for specific team report
   * @param {number|string} id - Analysis ID
   * @param {string} type - Report type ('Home' or 'Away')
   * @returns {Promise} - Blob response
   */
  downloadPDF: async (id, type) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axiosInstance.get(
        `video-analysis/${id}/download_pdf/`,
        {
          params: { type },
          responseType: 'blob', // Important for file download
          headers: {
            'Authorization': `Bearer ${token}` // Explicitly add token for blob requests
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error downloading PDF for type ${type}:`, error);
      throw error;
    }
  },

  /**
   * Download ZIP file containing all analysis artifacts
   * @param {number|string} id - Analysis ID
   * @returns {Promise} - Blob response containing ZIP file
   */
  downloadZIP: async (id) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axiosInstance.get(
        `video-analysis/${id}/download_zip/`,
        {
          responseType: 'blob', // Important for file download
          headers: {
            'Authorization': `Bearer ${token}` // Explicitly add token for blob requests
          }
        }
      );
      return response;
    } catch (error) {
      console.error(`Error downloading ZIP for analysis ID ${id}:`, error);
      throw error;
    }
  },

};

export default videoAnalysisService;
