import axiosInstance from './axiosInstance';

/**
 * Service d'authentification - Intégré avec le backend Django
 */

export const authService = {
  /**
   * Connexion utilisateur
   * @param {string} email
   * @param {string} password
   * @returns {Promise}
   */
  login: async (email, password) => {
    try {
      // Call the JWT login endpoint
      const response = await axiosInstance.post('login/', { email, password });
      
      const { access, refresh } = response.data;
      
      // Store tokens in localStorage
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      
      // Fetch user profile
      const userProfile = await authService.getCurrentUserProfile();
      
      // Store user data
      localStorage.setItem('user', JSON.stringify(userProfile));

      return { success: true, user: userProfile, token: access };
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle specific error messages from backend
      if (error.response?.status === 401) {
        throw new Error('Identifiants invalides');
      } else if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      } else {
        throw new Error('Erreur de connexion. Veuillez réessayer.');
      }
    }
  },

  /**
   * Inscription nouvel utilisateur
   * @param {object} userData - { name, email, password, password_confirm, club_name }
   * @returns {Promise}
   */
  signup: async (userData) => {
    try {
      // Map frontend field names to backend field names
      const registrationData = {
        email: userData.email,
        password: userData.password,
        password_confirm: userData.password_confirm,
        name: userData.name,
        club_name: userData.clubName,
      };
      
      // Call the registration endpoint
      const response = await axiosInstance.post('users/register/', registrationData);
      
      // Return the newly created user data
      return response.data;
    } catch (error) {
      console.error('Signup error:', error);
      
      // Handle validation errors from backend
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Check for specific field errors
        if (errorData.email) {
          throw new Error(`Email: ${errorData.email[0]}`);
        } else if (errorData.password) {
          throw new Error(`Mot de passe: ${errorData.password[0]}`);
        } else if (errorData.password_confirm) {
          throw new Error(`Confirmation: ${errorData.password_confirm[0]}`);
        } else if (errorData.name) {
          throw new Error(`Nom: ${errorData.name[0]}`);
        } else if (errorData.club_name) {
          throw new Error(`Club: ${errorData.club_name[0]}`);
        } else if (errorData.detail) {
          throw new Error(errorData.detail);
        } else {
          throw new Error('Erreur lors de l\'inscription. Veuillez vérifier vos informations.');
        }
      } else {
        throw new Error('Erreur de connexion au serveur. Veuillez réessayer.');
      }
    }
  },

  /**
   * Récupérer le profil de l'utilisateur connecté
   * @returns {Promise}
   */
  getCurrentUserProfile: async () => {
    try {
      const response = await axiosInstance.get('users/me/');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  /**
   * Rafraîchir le token d'accès
   * @returns {Promise}
   */
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await axiosInstance.post('token/refresh/', {
        refresh: refreshToken,
      });
      
      const { access } = response.data;
      localStorage.setItem('accessToken', access);
      
      return access;
    } catch (error) {
      console.error('Token refresh error:', error);
      // Clear tokens and redirect to login
      authService.logout();
      throw error;
    }
  },

  /**
   * Déconnexion
   */
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  /**
   * Récupérer l'utilisateur actuel depuis le localStorage
   */
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Vérifier si l'utilisateur est connecté
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },

  /**
   * Obtenir le token d'accès
   */
  getAccessToken: () => {
    return localStorage.getItem('accessToken');
  },

  /**
   * Obtenir le token de rafraîchissement
   */
  getRefreshToken: () => {
    return localStorage.getItem('refreshToken');
  },
};

export default authService;
