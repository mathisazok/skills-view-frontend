# Skills View  Frontend

Plateforme SaaS d'analyse vidéo de matchs de football avec React.js, TailwindCSS, React Router et Axios.

## 🚀 Démarrage Rapide

### Prérequis
- Node.js (v18+)
- npm ou yarn

### Installation

```bash
# Cloner le projet
cd skills-view

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Le serveur démarre sur `http://localhost:5173`

## 📁 Structure du Projet

```
skills-view/
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── Button.jsx
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Input.jsx
│   │   ├── ServiceCard.jsx
│   │   ├── ReviewCard.jsx
│   │   └── PricingCard.jsx
│   ├── pages/               # Pages principales
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   └── Dashboard.jsx
│   ├── services/            # Services API
│   │   ├── axiosInstance.js
│   │   ├── authService.js
│   │   └── matchService.js
│   ├── utils/               # Utilitaires
│   │   ├── validators.js
│   │   └── mockData.js
│   ├── assets/              # Images et fichiers statiques
│   ├── App.jsx              # Routing principal
│   ├── main.jsx
│   └── index.css            # Styles globaux
├── public/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── index.html
```

## 🎨 Couleurs Principales

- Primaire (vert): `#6EBA6E`
- Fond: `#0B1024` (noir)
- Avis: `#334155` (slate)
- Blanc: `#FFFFFF`

## 📄 Pages Implémentées

### 1. **Landing Page** (`/`)
- ✅ Navbar avec logo et liens
- ✅ Hero section avec images flottantes
- ✅ Section services (grid 3x2)
- ✅ Section features
- ✅ Section reviews
- ✅ Section pricing (3 plans)
- ✅ Call-to-action
- ✅ Footer complet

### 2. **Login/Signup Page** (`/login`)
- ✅ Formulaires avec validation
- ✅ Toggle entre Login et Signup
- ✅ Gestion des erreurs
- ✅ Mock authentication

### 3. **Dashboard** (`/dashboard`)
- ✅ Sidebar rétractable
- ✅ Vue d'ensemble avec stats
- ✅ Dernier match analysé
- ✅ Boutons pour actions principales
- ✅ Responsive mobile/tablet

## 🔧 Composants Réutilisables

### Button
```jsx
<Button primary onClick={handleClick}>
  Cliquez-moi
</Button>
```

### Input
```jsx
<Input
  type="email"
  label="Email"
  value={value}
  onChange={handleChange}
  error={error}
/>
```

### ServiceCard
```jsx
<ServiceCard
  icon="🎥"
  title="Analyse Vidéo"
  description="Description..."
  image="url"
/>
```

## 🔌 Services API

### AuthService
```javascript
import authService from './services/authService';

// Login
await authService.login(email, password);

// Signup
await authService.signup({ name, email, password, clubName });

// Logout
authService.logout();

// Vérifier auth
const isAuth = authService.isAuthenticated();
const user = authService.getCurrentUser();
```

### MatchService
```javascript
import matchService from './services/matchService';

// Récupérer tous les matchs
const matches = await matchService.getAllMatches();

// Récupérer le dernier match
const lastMatch = await matchService.getLatestMatch();

// Importer une vidéo
await matchService.uploadVideo(file, matchData);

// Récupérer les clips enregistrés
const clips = await matchService.getRecordedClips();
```

## ✅ Validations

Les formulaires incluent des validations pour :
- Email (format valide)
- Mot de passe (min 8 caractères)
- Nom (min 2 caractères)
- Nom de club (min 2 caractères)

## 📱 Responsiveness

- ✅ Mobile (< 768px)
- ✅ Tablet (768px - 1024px)
- ✅ Desktop (> 1024px)

## 🔮 Points d'Intégration Backend

Le code est préparé pour intégration backend réelle. Remplacez simplement les appels mock :

### Dans `authService.js`:
```javascript
// Actuel (mock)
const user = mockUsers.find(...);

// À remplacer par:
const response = await axiosInstance.post('/auth/login', { email, password });
```

### Dans `matchService.js`:
```javascript
// Actuel (mock)
return { success: true, data: mockMatches };

// À remplacer par:
const response = await axiosInstance.get('/matches');
```

## 📦 Build & Deployment

```bash
# Build pour production
npm run build

# Prévisualiser le build
npm run preview
```

## 🛠️ Technologies

- **React** 18.2+
- **Vite** (Build tool)
- **React Router** (Navigation)
- **TailwindCSS** (Styling)
- **Axios** (HTTP Client)
- **React Query** (État global - optionnel)

## 📝 Prochaines Étapes

1. **Backend Integration**
   - Remplacer les mock APIs par de vrais appels
   - Configurer `VITE_API_URL` dans `.env`

2. **Authentication**
   - Implémenter JWT tokens
   - Ajouter refresh token logic

3. **Pages Dashboard**
   - Développer les pages supplémentaires (Analyses, Clips, Subscription)
   - Ajouter les fonctionnalités d'import vidéo

4. **Amélioration UX**
   - Ajouter des animations
   - Implémenter des notifications toast
   - Ajouter un mode sombre/clair

5. **Testing**
   - Unit tests avec Vitest/Jest
   - E2E tests avec Playwright/Cypress

## 📄 Fichier .env

```env
# À créer à la racine du projet
VITE_API_URL=http://localhost:3000/api
```

## 📞 Support

Pour toute question ou problème, consultez la documentation React et TailwindCSS.

---

**Bon développement ! 🚀**
