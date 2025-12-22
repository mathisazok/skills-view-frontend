# 🚀 Guide de Déploiement - cPanel O2 Switch

Ce guide vous explique comment déployer votre application React (Skills View) sur un hébergement cPanel O2 Switch.

## 📋 Prérequis

- [x] Un compte d'hébergement O2 Switch actif
- [x] Accès à votre cPanel
- [x] Node.js installé localement (pour le build)
- [x] Accès FTP ou SSH (optionnel mais recommandé)

---

## 🎯 Méthode 1 : Déploiement Manuel (Recommandé pour débutants)

### Étape 1 : Build de l'application

Sur votre ordinateur local, dans le dossier du projet :

```bash
# Installer les dépendances si ce n'est pas déjà fait
npm install

# Créer le build de production
npm run build
```

Cette commande crée un dossier `dist/` contenant tous les fichiers optimisés pour la production.

### Étape 2 : Connexion à cPanel

1. Allez sur `https://o2switch.fr/cpanel` (ou l'URL fournie par O2 Switch)
2. Connectez-vous avec vos identifiants cPanel
3. Cherchez et cliquez sur **"Gestionnaire de fichiers"** (File Manager)

### Étape 3 : Préparation du dossier public_html

1. Dans le gestionnaire de fichiers, naviguez vers le dossier `public_html`
2. **Important** : Si c'est un nouveau site :
   - Supprimez tous les fichiers par défaut (index.html, etc.)
3. **Important** : Si vous remplacez un site existant :
   - Faites une sauvegarde avant de supprimer !
   - Téléchargez tous les fichiers actuels en local (backup)
   - Puis supprimez-les

### Étape 4 : Upload des fichiers

1. Cliquez sur **"Téléverser"** (Upload) dans le gestionnaire de fichiers
2. Sélectionnez **TOUS les fichiers et dossiers** dans le dossier `dist/` de votre ordinateur
   - ⚠️ Ne uploadez PAS le dossier `dist/` lui-même
   - Uploadez uniquement son CONTENU (index.html, assets/, .htaccess, etc.)

**Structure correcte dans public_html :**
```
public_html/
├── index.html
├── .htaccess
├── assets/
│   ├── index-abc123.js
│   ├── index-def456.css
│   └── ...
└── ...autres fichiers du build
```

**Structure INCORRECTE (à éviter) :**
```
public_html/
└── dist/          ❌ NE FAITES PAS ÇA
    ├── index.html
    ├── assets/
    └── ...
```

### Étape 5 : Vérification du fichier .htaccess

1. Assurez-vous que le fichier `.htaccess` est bien présent dans `public_html`
2. Si vous ne le voyez pas :
   - Activez l'affichage des fichiers cachés : Paramètres → "Afficher les fichiers cachés" (Show Hidden Files)
3. Vérifiez son contenu (il doit rediriger toutes les requêtes vers index.html)

### Étape 6 : Test du site

1. Ouvrez votre navigateur
2. Allez sur votre nom de domaine : `https://votredomaine.com`
3. Le site devrait s'afficher ! 🎉

**Tests à effectuer :**
- [ ] La page d'accueil s'affiche correctement
- [ ] Le CSS Tailwind est bien chargé (le design est bon)
- [ ] Les images s'affichent
- [ ] La navigation fonctionne (cliquer sur les liens)
- [ ] **IMPORTANT** : Rafraîchir la page (F5) sur une route comme `/login` → ça doit fonctionner sans erreur 404

---

## ⚡ Méthode 2 : Déploiement Automatique via Script

J'ai créé un script bash qui automatise le processus.

### Étape 1 : Configuration du script

Ouvrez le fichier `deploy-cpanel.sh` et modifiez ces variables :

```bash
CPANEL_USER="votre_nom_utilisateur_cpanel"
CPANEL_HOST="ftp.votredomaine.com"  # ou ftp.o2switch.fr
CPANEL_REMOTE_PATH="/public_html"
```

### Étape 2 : Rendre le script exécutable

```bash
chmod +x deploy-cpanel.sh
```

### Étape 3 : Lancer le déploiement

```bash
./deploy-cpanel.sh
```

Le script vous propose 3 options :
1. **FTP** : Upload automatique via FTP (nécessite `lftp`)
2. **Git** : Déploiement via Git (nécessite SSH)
3. **Manuel** : Affiche les instructions manuelles

---

## 🔧 Méthode 3 : Déploiement via FTP (FileZilla)

Si vous préférez utiliser FileZilla ou un autre client FTP :

### Étape 1 : Build local

```bash
npm run build
```

### Étape 2 : Configuration FileZilla

1. Téléchargez FileZilla : https://filezilla-project.org/
2. Ouvrez FileZilla et configurez une nouvelle connexion :
   - **Hôte** : `ftp.votredomaine.com` ou `ftp.o2switch.fr`
   - **Nom d'utilisateur** : Votre nom d'utilisateur cPanel
   - **Mot de passe** : Votre mot de passe cPanel
   - **Port** : 21 (FTP) ou 22 (SFTP si disponible)

### Étape 3 : Upload

1. Connectez-vous
2. Côté serveur (à droite), naviguez vers `/public_html`
3. Côté local (à gauche), naviguez vers votre dossier `dist/`
4. Sélectionnez **tous les fichiers** dans `dist/`
5. Faites un glisser-déposer vers `public_html`
6. Attendez que l'upload se termine

---

## 🌐 Méthode 4 : Déploiement via Git (Avancé)

O2 Switch supporte Git ! Cette méthode permet des déploiements automatiques.

### Étape 1 : Activer Git sur cPanel

1. Dans cPanel, cherchez **"Git Version Control"**
2. Cliquez sur **"Create"**
3. Configurez :
   - **Clone URL** : URL de votre repository GitHub
   - **Repository Path** : `/home/votre_user/repositories/skills-view`
   - **Repository Name** : `skills-view`

### Étape 2 : Créer un script de déploiement post-receive

Créez un fichier `.cpanel.yml` à la racine de votre projet :

```yaml
---
deployment:
  tasks:
    - export DEPLOYPATH=/home/votre_user/public_html/
    - /bin/cp -R dist/* $DEPLOYPATH
```

### Étape 3 : Configuration du workflow

1. Quand vous pushez sur GitHub
2. cPanel pull automatiquement les changements
3. Le script `.cpanel.yml` copie les fichiers de `dist/` vers `public_html/`

⚠️ **Note** : Cette méthode nécessite que vous commitiez le dossier `dist/`, ce qui n'est pas recommandé habituellement.

**Alternative meilleure** : Utilisez GitHub Actions pour builder et déployer automatiquement.

---

## 🤖 Méthode 5 : GitHub Actions + FTP (Automatisation complète)

Créez `.github/workflows/deploy.yml` :

```yaml
name: Deploy to cPanel O2 Switch

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install dependencies
      run: npm install

    - name: Build
      run: npm run build

    - name: Deploy via FTP
      uses: SamKirkland/FTP-Deploy-Action@4.3.0
      with:
        server: ftp.votredomaine.com
        username: ${{ secrets.FTP_USERNAME }}
        password: ${{ secrets.FTP_PASSWORD }}
        local-dir: ./dist/
        server-dir: /public_html/
```

### Configuration des secrets GitHub

1. Allez sur GitHub → Settings → Secrets and variables → Actions
2. Ajoutez :
   - `FTP_USERNAME` : Votre nom d'utilisateur cPanel
   - `FTP_PASSWORD` : Votre mot de passe cPanel

Maintenant, chaque push sur `main` déploie automatiquement ! 🎉

---

## 🔒 Configuration Post-Déploiement

### 1. Vérifier le HTTPS

O2 Switch offre Let's Encrypt gratuit :

1. Dans cPanel, cherchez **"SSL/TLS Status"**
2. Cochez votre domaine
3. Cliquez sur **"Run AutoSSL"**
4. Attendez quelques minutes
5. Votre site sera accessible en HTTPS !

### 2. Configuration des Variables d'Environnement

Si votre app utilise des variables d'environnement (API keys, etc.) :

**Option A : Fichier .env dans le build**

Créez `.env.production` localement :

```env
VITE_API_URL=https://api.votredomaine.com
```

Puis rebuild : `npm run build`

**Option B : Hardcoder temporairement**

Dans `src/services/axiosInstance.js`, remplacez :

```js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
```

Par :

```js
const API_URL = 'https://api.votredomaine.com'
```

⚠️ Pas idéal, mais ça marche pour un déploiement rapide.

### 3. Configurer le domaine principal

Si votre site est dans un sous-dossier :

1. Dans cPanel → **"Domaines"** ou **"Addon Domains"**
2. Configurez votre domaine pour pointer vers `/public_html`

---

## 🐛 Dépannage

### Problème : Page blanche après déploiement

**Solution 1** : Vérifier la console du navigateur (F12)
- S'il y a des erreurs 404 pour les fichiers JS/CSS
- C'est probablement un problème de chemin

**Solution 2** : Vérifier vite.config.js

Ajoutez la base URL :

```js
export default defineConfig({
  base: '/', // ou '/nom-du-sous-dossier/' si dans un sous-dossier
  plugins: [react(), tailwindcss()],
})
```

Puis rebuild : `npm run build`

### Problème : Erreur 404 lors du refresh de la page

**Cause** : Le fichier `.htaccess` n'est pas présent ou mal configuré

**Solution** :
1. Vérifiez que `.htaccess` est bien dans `public_html`
2. Vérifiez son contenu (voir le fichier `public/.htaccess` du projet)
3. Si nécessaire, créez-le manuellement dans cPanel

### Problème : CSS ne se charge pas

**Cause** : Tailwind n'est pas compilé correctement

**Solution** :
```bash
# Supprimer node_modules et package-lock.json
rm -rf node_modules package-lock.json

# Réinstaller
npm install

# Rebuild
npm run build
```

### Problème : Les images ne s'affichent pas

**Cause** : Chemins d'images incorrects

**Solution** :
- Utilisez toujours des chemins relatifs pour les images : `src/assets/logo.png`
- Ou importez-les dans les composants React : `import logo from './assets/logo.png'`

### Problème : Erreur CORS avec l'API

**Cause** : L'API backend n'autorise pas les requêtes depuis votre domaine

**Solution côté backend** :
```js
// Express.js
app.use(cors({
  origin: ['https://votredomaine.com', 'http://localhost:5173']
}))
```

### Problème : Upload FTP très lent

**Solution** :
- Compressez le dossier `dist/` en ZIP
- Uploadez le ZIP via cPanel File Manager
- Extraire le ZIP directement sur le serveur (plus rapide)

---

## 📊 Optimisations Post-Déploiement

### 1. Activer la compression Gzip

Déjà inclus dans le `.htaccess` fourni !

### 2. Optimiser les images

Avant le build, optimisez vos images :

```bash
npm install -D vite-plugin-image-optimizer

# Puis ajoutez dans vite.config.js
```

### 3. Analyse de la taille du bundle

```bash
npm run build -- --mode analyze
```

### 4. CDN (optionnel)

O2 Switch a Cloudflare intégré :
1. cPanel → Cloudflare
2. Activez-le pour votre domaine
3. Bénéficiez d'un CDN gratuit !

---

## ✅ Checklist Finale

Après le déploiement, vérifiez :

- [ ] Site accessible via HTTPS
- [ ] Page d'accueil s'affiche correctement
- [ ] Navigation fonctionne (tous les liens)
- [ ] Refresh d'une page fonctionne (pas de 404)
- [ ] Login/Signup fonctionnent
- [ ] Dashboard accessible
- [ ] Images chargent correctement
- [ ] Appels API fonctionnent (vérifier CORS)
- [ ] Responsive sur mobile/tablette
- [ ] Performance correcte (< 3s de chargement)
- [ ] Console du navigateur sans erreurs critiques

---

## 📞 Support O2 Switch

Si vous rencontrez des problèmes :

- **Documentation** : https://faq.o2switch.fr/
- **Support** : Ticket via votre espace client
- **Chat** : Chat en direct sur o2switch.fr

---

## 🎉 Félicitations !

Votre application React est maintenant en ligne ! 🚀

**Prochaines étapes recommandées :**
1. Configurer Google Analytics
2. Mettre en place un monitoring (UptimeRobot)
3. Configurer un nom de domaine personnalisé
4. Ajouter un favicon
5. Optimiser le SEO (meta tags, sitemap.xml)

---

## 📝 Notes Importantes

### Mises à jour futures

Pour mettre à jour votre site après des modifications :

```bash
# 1. Modifier votre code
# 2. Rebuild
npm run build

# 3. Re-upload le contenu de dist/ vers public_html
# (Écrasez les fichiers existants)
```

### Rollback en cas de problème

Gardez toujours une sauvegarde du dossier `dist/` précédent :

```bash
# Avant chaque déploiement
cp -r dist dist-backup-$(date +%Y%m%d)
```

---

**Créé avec ❤️ pour Skills View**

*Dernière mise à jour : Décembre 2024*
