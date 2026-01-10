# 🔌 Guide d'Intégration API Backend - Skills View

## 📋 Vue d'ensemble

Ce guide explique comment remplacer les mock calls par de vrais appels à votre backend API.

---

## 🔑 Concept de Base

### Mock Setup (Actuel)
```javascript
// Mock - Retourne une donnée hardcodée
export const getAllMatches = async () => {
  return { success: true, data: mockMatches };
};
```

### Real API Setup (À faire)
```javascript
// Real API - Appel le backend
export const getAllMatches = async () => {
  const response = await axiosInstance.get('/matches');
  return response.data;
};
```

---

## 📡 Endpoints Backend Requis

### Authentication
```
POST   /auth/login
  Body: { email, password }
  Response: { user, token }

POST   /auth/signup
  Body: { name, email, password, clubName }
  Response: { user, token }

POST   /auth/logout
  Response: { success: true }

GET    /auth/me
  Response: { user }
```

### Matches
```
GET    /matches
  Response: [{ id, teamName, opponentName, date, score, stats }]

GET    /matches/:id
  Response: { id, teamName, opponentName, date, score, stats }

POST   /matches
  Body: { teamName, opponentName, date, score }
  Response: { id, teamName, opponentName, date, score }

POST   /matches/:id/upload
  Body: FormData avec video
  Response: { success: true, videoUrl }

GET    /clips
  Response: [{ id, title, duration, thumbnail }]
```

### Subscription
```
GET    /subscription/current
  Response: { plan, price, renews_at }

POST   /subscription/upgrade
  Body: { planId }
  Response: { success: true }
```

---

## 🔄 Étapes de Migration Mock → Real

### 1. Configurer votre URL API

#### .env
```env
VITE_API_URL=https://api.skillsview.com
```

#### src/services/axiosInstance.js
```javascript
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
});
```

### 2. Mettre à jour AuthService

#### Avant (Mock)
```javascript
export const authService = {
  login: async (email, password) => {
    const user = mockUsers.find(u => u.email === email && u.password === password);
    const mockToken = `token_${Date.now()}`;
    localStorage.setItem('authToken', mockToken);
    return { success: true, user, token: mockToken };
  },
};
```

#### Après (Real)
```javascript
export const authService = {
  login: async (email, password) => {
    const response = await axiosInstance.post('/auth/login', {
      email,
      password,
    });
    const { user, token } = response.data;
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    return { success: true, user, token };
  },
};
```

### 3. Mettre à jour MatchService

#### Avant (Mock)
```javascript
export const matchService = {
  getLatestMatch: async () => {
    return { success: true, data: mockMatches[0] };
  },
};
```

#### Après (Real)
```javascript
export const matchService = {
  getLatestMatch: async () => {
    const response = await axiosInstance.get('/matches/latest');
    return response.data;
  },
};
```

---

## 🔐 Gestion des Tokens

### Stockage Sécurisé du Token

```javascript
// authService.js - Configuration intercepteur

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Gérer expiration token
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré
      authService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Refresh Token (Optional)

```javascript
// services/authService.js
export const authService = {
  // ...
  
  refreshToken: async () => {
    try {
      const response = await axiosInstance.post('/auth/refresh', {
        refreshToken: localStorage.getItem('refreshToken'),
      });
      const { token } = response.data;
      localStorage.setItem('authToken', token);
      return token;
    } catch (error) {
      authService.logout();
      throw error;
    }
  },
};
```

---

## 📤 Upload Vidéo

### Avant (Mock)
```javascript
export const matchService = {
  uploadVideo: async (file, matchData) => {
    return {
      success: true,
      message: 'Vidéo uploadée avec succès',
      data: { id: Date.now(), ...matchData },
    };
  },
};
```

### Après (Real)
```javascript
export const matchService = {
  uploadVideo: async (file, matchData) => {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('teamName', matchData.teamName);
    formData.append('opponentName', matchData.opponentName);
    formData.append('date', matchData.date);

    const response = await axiosInstance.post('/matches/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log(`Upload progress: ${percentCompleted}%`);
      },
    });

    return response.data;
  },
};
```

---

## 🔍 Utilisation dans les Composants

### Avant (Mock - LoginPage.jsx)
```javascript
const handleLogin = async (e) => {
  e.preventDefault();
  try {
    await authService.login(loginData.email, loginData.password);
    navigate('/dashboard');
  } catch (error) {
    setErrors({ submit: error.message });
  }
};
```

### Après (Real - Pas de changement needed!)
```javascript
// Le code reste exactement le même!
// Les services gèrent tout
const handleLogin = async (e) => {
  e.preventDefault();
  try {
    await authService.login(loginData.email, loginData.password);
    navigate('/dashboard');
  } catch (error) {
    setErrors({ submit: error.message });
  }
};
```

---

## 🎯 Exemple Complet : Intégration Auth

### 1. Backend setup (Node.js/Express exemple)
```javascript
// backend/routes/auth.js
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Valider email/password
  const user = await User.findOne({ email });
  if (!user || !user.password.match(password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Créer JWT token
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
  
  res.json({
    user: { id: user.id, name: user.name, email: user.email },
    token,
  });
});
```

### 2. Frontend setup (React)
```javascript
// src/services/authService.js
export const authService = {
  login: async (email, password) => {
    const response = await axiosInstance.post('/auth/login', {
      email,
      password,
    });
    const { user, token } = response.data;
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    return { success: true, user, token };
  },
};
```

### 3. Utilisation dans le composant
```javascript
// src/pages/LoginPage.jsx
const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    await authService.login(loginData.email, loginData.password);
    navigate('/dashboard');
  } catch (error) {
    setErrors({ submit: error.message });
  } finally {
    setLoading(false);
  }
};
```

---

## 🛠️ Gestion des Erreurs

### Intercepteur d'Erreur Global

```javascript
// src/services/axiosInstance.js
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorData = error.response?.data || {};
    const errorMessage = errorData.message || error.message;

    // Log erreurs pour debugging
    if (import.meta.env.VITE_DEBUG === 'true') {
      console.error('API Error:', errorMessage);
    }

    // Gestion spécifique des erreurs
    if (error.response?.status === 401) {
      // Non authentifié
      authService.logout();
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Non autorisé
      console.error('Accès refusé');
    } else if (error.response?.status >= 500) {
      // Erreur serveur
      console.error('Erreur serveur');
    }

    return Promise.reject(new Error(errorMessage));
  }
);
```

---

## 📊 Monitoring d'API

### Logger les appels API

```javascript
// src/utils/apiLogger.js
export const logApiCall = (method, url, data, response) => {
  if (import.meta.env.VITE_DEBUG === 'true') {
    console.group(`API Call: ${method} ${url}`);
    console.log('Request:', data);
    console.log('Response:', response);
    console.groupEnd();
  }
};
```

### Intégrer dans axiosInstance

```javascript
axiosInstance.interceptors.request.use((config) => {
  config.metadata = { startTime: Date.now() };
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    const duration = Date.now() - response.config.metadata.startTime;
    logApiCall(
      response.config.method.toUpperCase(),
      response.config.url,
      response.config.data,
      response.data
    );
    console.log(`Duration: ${duration}ms`);
    return response;
  },
  (error) => Promise.reject(error)
);
```

---

## ✅ Checklist de Migration

- [ ] Endpoint `/auth/login` existe et fonctionne
- [ ] Endpoint `/auth/signup` existe et fonctionne
- [ ] Tokens JWT générés et validés
- [ ] CORS configuré correctement
- [ ] authService.js mis à jour
- [ ] matchService.js mis à jour
- [ ] Tests login/logout
- [ ] Tests API calls
- [ ] Variables d'environnement configurées
- [ ] Erreurs gérées proprement
- [ ] No console.log() avant production
- [ ] Monitoring activé

---

## 🚀 Prochaines Étapes

1. **Authentification avancée**
   - [ ] Remember me
   - [ ] Social login (Google, GitHub)
   - [ ] 2FA

2. **Optimisation**
   - [ ] Query caching avec React Query
   - [ ] Request debouncing
   - [ ] Pagination backend

3. **Sécurité**
   - [ ] CSRF protection
   - [ ] Rate limiting
   - [ ] Input validation côté backend

---

*Bon intégration! 🎉*
