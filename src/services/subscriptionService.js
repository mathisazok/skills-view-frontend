import axiosInstance from './axiosInstance';

/**
 * Service for subscription management - Integrates with backend Django subscriptions app
 */

export const subscriptionService = {
  /**
   * Subscribe to a new plan
   * @param {number} planId - Plan ID to subscribe to
   * @param {string} interval - Billing interval ('monthly' or 'yearly')
   * @returns {Promise}
   */
  subscribe: async (planId, interval = 'monthly') => {
    try {
      const response = await axiosInstance.post('/subscriptions/subscribe/', {
        plan_id: planId,
        interval: interval
      });
      return response.data;
    } catch (error) {
      console.error('Subscribe error:', error);
      throw error;
    }
  },

  /**
   * Change existing subscription plan
   * @param {number} newPlanId - New plan ID
   * @param {string} newInterval - Optional new interval
   * @returns {Promise}
   */
  changePlan: async (newPlanId, newInterval = null) => {
    try {
      const payload = { new_plan_id: newPlanId };
      if (newInterval) {
        payload.new_interval = newInterval;
      }
      const response = await axiosInstance.post('/subscriptions/change_plan/', payload);
      return response.data;
    } catch (error) {
      console.error('Change plan error:', error);
      throw error;
    }
  },

  /**
   * Get all available plans
   * @returns {Promise}
   */
  getPlans: async () => {
    try {
      const response = await axiosInstance.get('/plans/');
      return response.data;
    } catch (error) {
      console.error('Get plans error:', error);
      throw error;
    }
  },

  /**
   * Get current user's subscription
   * @returns {Promise}
   */
  getCurrentSubscription: async () => {
    try {
      const response = await axiosInstance.get('/subscriptions/current/');
      return response.data;
    } catch (error) {
      console.error('Get current subscription error:', error);
      throw error;
    }
  },

  /**
   * Cancel subscription
   * @param {boolean} immediate - Cancel immediately or at end of period
   * @returns {Promise}
   */
  cancelSubscription: async (immediate = false) => {
    try {
      const response = await axiosInstance.post('/subscriptions/cancel/', {
        immediate: immediate
      });
      return response.data;
    } catch (error) {
      console.error('Cancel subscription error:', error);
      throw error;
    }
  }
};

export default subscriptionService;
