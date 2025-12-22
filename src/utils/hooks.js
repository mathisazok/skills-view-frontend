import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Hook personnalisé pour gérer un formulaire
 * @param {object} initialValues - Valeurs initiales du formulaire
 * @param {function} onSubmit - Fonction appelée à la soumission
 */
export const useForm = (initialValues, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Effacer l'erreur du champ
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  }, [errors]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        await onSubmit(values);
      } catch (error) {
        setErrors({ submit: error.message });
      } finally {
        setLoading(false);
      }
    },
    [values, onSubmit]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  return {
    values,
    errors,
    loading,
    setErrors,
    handleChange,
    handleSubmit,
    reset,
  };
};

/**
 * Hook pour gérer un état modal/dropdown
 */
export const useToggle = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return { isOpen, toggle, open, close };
};

/**
 * Hook pour les appels API
 */
export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunction(...args);
      setData(result.data || result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [...dependencies, apiFunction]);

  return { data, loading, error, execute };
};

/**
 * Hook pour gérer l'authentification
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const authService = (await import('../services/authService')).default;
      const result = await authService.login(email, password);
      setUser(result.user);
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    const authService = (await import('../services/authService')).default;
    authService.logout();
    setUser(null);
  }, []);

  return { user, loading, login, logout };
};

/**
 * Hook pour les appels API avec pagination
 */
export const usePagination = (items = [], pageSize = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedItems = items.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(items.length / pageSize);

  const goToPage = useCallback((page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  return {
    paginatedItems,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
  };
};

/**
 * Hook pour détecter quand un élément entre en vue
 */
export const useInView = (options = {}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, {
      threshold: 0.1,
      ...options,
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return [ref, isVisible];
};

export default {
  useForm,
  useToggle,
  useApi,
  useAuth,
  usePagination,
  useInView,
};
