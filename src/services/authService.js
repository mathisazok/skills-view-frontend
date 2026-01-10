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
      console.log('🔐 [AUTH] Attempting login for:', email);

      // Call the JWT login endpoint
      const response = await axiosInstance.post('login/', { email, password });

      console.log('✅ [AUTH] Login successful');
      const { access, refresh } = response.data;

      // Store tokens in localStorage
      try {
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
      } catch (storageError) {
        console.error('Error storing tokens in localStorage:', storageError);
        throw new Error('Impossible de sauvegarder la session. Vérifiez les paramètres du navigateur.');
      }

      // Fetch user profile
      const userProfile = await authService.getCurrentUserProfile();

      // Store user data
      try {
        localStorage.setItem('user', JSON.stringify(userProfile));
      } catch (storageError) {
        console.error('Error storing user data in localStorage:', storageError);
        // Non-critical, continue anyway
      }

      return { success: true, user: userProfile, token: access };
    } catch (error) {
      console.error('❌ [AUTH] Login error:', error);

      // Handle network errors
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        throw new Error('Impossible de se connecter au serveur. Vérifiez que le backend est démarré sur http://localhost:3000');
      }

      // Handle timeout errors
      if (error.code === 'ECONNABORTED') {
        throw new Error('La connexion a pris trop de temps. Vérifiez votre connexion internet.');
      }

      // Handle specific error messages from backend
      if (error.response?.status === 401) {
        throw new Error('Identifiants invalides');
      } else if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      } else if (error.response) {
        throw new Error(`Erreur serveur (${error.response.status}). Veuillez réessayer.`);
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
      try {
        localStorage.setItem('accessToken', access);
      } catch (storageError) {
        console.error('Error storing access token:', storageError);
        throw new Error('Impossible de sauvegarder le token');
      }

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
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Error clearing localStorage during logout:', error);
      // Continue anyway - logout should always succeed
    }
  },

  /**
   * Récupérer l'utilisateur actuel depuis le localStorage
   */
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem('user');
      return null;
    }
  },

  /**
   * Vérifier si l'utilisateur est connecté
   */
  isAuthenticated: () => {
    try {
      return !!localStorage.getItem('accessToken');
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return false;
    }
  },

  /**
   * Obtenir le token d'accès
   */
  getAccessToken: () => {
    try {
      return localStorage.getItem('accessToken');
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return null;
    }
  },

  /**
   * Obtenir le token de rafraîchissement
   */
  getRefreshToken: () => {
    try {
      return localStorage.getItem('refreshToken');
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return null;
    }
  },
};

export default authService;
