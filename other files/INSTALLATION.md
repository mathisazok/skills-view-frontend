# 🚀 Guide d'Installation et Configuration - Skills View

## Étape 1 : Préparation de l'environnement

### Vérifier Node.js
```bash
node --version  # Doit être v18 ou supérieur
npm --version   # Doit être v9 ou supérieur
```

Si vous n'avez pas Node.js, téléchargez-le depuis https://nodejs.org

## Étape 2 : Installation des dépendances

```bash
# Se placer dans le répertoire du projet
cd skills-view

# Installer toutes les dépendances
npm install

# Ou avec yarn
yarn install
```

## Étape 3 : Configuration

### Créer le fichier .env
Copiez `.env.example` en `.env`:
```bash
cp .env.example .env
```

### Modifier les variables (optionnel)
```bash
# .env
VITE_API_URL=http://localhost:3000/api
VITE_ENV=development
```

## Étape 4 : Lancer le serveur de développement

```bash
npm run dev
```

L'application s'ouvrira automatiquement sur `http://localhost:5173`

## 📱 Tester les différentes pages

### Landing Page
- URL: `http://localhost:5173/`
- Contient tous les sections : Hero, Services, Features, Reviews, Pricing, CTA

### Login Page
- URL: `http://localhost:5173/login`
- Credentials de test:
  - Email: `john@example.com`
  - Password: `password123`

### Dashboard
- URL: `http://localhost:5173/dashboard` (après login)
- Affiche un aperçu des matchs et stats

## 🏗️ Structure de fichiers créée

```
skills-view/
├── src/
│   ├── components/
│   │   ├── Button.jsx              # Bouton réutilisable
│   │   ├── Navbar.jsx              # Barre de navigation
│   │   ├── Footer.jsx              # Footer
│   │   ├── Input.jsx               # Champ d'input
│   │   ├── ServiceCard.jsx         # Carte service
│   │   ├── ReviewCard.jsx          # Carte review
│   │   └── PricingCard.jsx         # Carte pricing
│   ├── pages/
│   │   ├── LandingPage.jsx         # Page d'accueil
│   │   ├── LoginPage.jsx           # Page login/signup
│   │   └── Dashboard.jsx           # Dashboard
│   ├── services/
│   │   ├── axiosInstance.js        # Configuration Axios
│   │   ├── authService.js          # Services d'auth
│   │   └── matchService.js         # Services matchs
│   ├── utils/
│   │   ├── validators.js           # Validateurs
│   │   └── mockData.js             # Données mock
│   ├── App.jsx                     # Router principal
│   ├── main.jsx                    # Entrée
│   └── index.css                   # Styles globaux
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── README.md
└── .env.example
```

## 🔧 Commandes disponibles

```bash
# Démarrer le dev server
npm run dev

# Build pour production
npm run build

# Prévisualiser le build
npm run preview

# Lint le code
npm run lint
```

## 🎨 Personnalisation

### Modifier les couleurs
Dans `tailwind.config.js`:
```javascript
colors: {
  primary: '#6EBA6E',      // Couleur principale
  dark: '#0B1024',         // Fond
  'slate-custom': '#334155' // Avis
}
```

### Modifier les données
Dans `src/utils/mockData.js`:
```javascript
export const landingPageData = {
  // ... modifier les données ici
}
```

## 🔌 Intégration Backend

### Services API existants

**AuthService** (`src/services/authService.js`):
- `login(email, password)`
- `signup(userData)`
- `logout()`
- `getCurrentUser()`
- `isAuthenticated()`

**MatchService** (`src/services/matchService.js`):
- `getAllMatches()`
- `getLatestMatch()`
- `getMatchById(id)`
- `uploadVideo(file, matchData)`
- `getRecordedClips()`

### Remplacer les mock calls

Décommentez et adaptez les appels Axios réels:

```javascript
// Avant (mock)
return { success: true, data: mockMatches };

// Après (vrai API)
const response = await axiosInstance.get('/matches');
return response.data;
```

## ⚡ Performance

- ✅ Code splitting automatique avec Vite
- ✅ Lazy loading des routes possibles
- ✅ Images optimisées via Unsplash
- ✅ CSS Tailwind optimisé

## 🐛 Troubleshooting

### Port 5173 déjà utilisé
```bash
npm run dev -- --port 3000
```

### Problème de dépendances
```bash
rm -rf node_modules package-lock.json
npm install
```

### Module non trouvé
```bash
# Vérifier que les imports utilisent des chemins relatifs corrects
# Exemple: import Button from '../components/Button'
```

## 📚 Ressources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Axios](https://axios-http.com)

## ✅ Checklist de déploiement

- [ ] Variables d'environnement configurées
- [ ] Tests passent
- [ ] Build production testé (`npm run build`)
- [ ] Pas d'erreurs console
- [ ] Responsive sur mobile/tablet/desktop
- [ ] API backend intégrée
- [ ] Auth tokens stockés sécurisés

## 🎉 Prêt à développer!

Votre boilerplate React est maintenant configuré et prêt pour le développement. Bon coding! 🚀
