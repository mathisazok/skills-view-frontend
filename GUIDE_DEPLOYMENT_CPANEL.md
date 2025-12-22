# Guide de Déploiement sur cPanel

## 📦 Étape 1 : Préparer l'application pour la production

### 1.1 Configurer la variable d'environnement

Ouvrez le fichier `.env` à la racine du projet et configurez l'URL de votre backend :

```env
VITE_API_URL=https://votre-backend.com/api
```

**Important** : Remplacez `https://votre-backend.com/api` par l'URL réelle de votre API backend.

### 1.2 Construire l'application

Exécutez la commande de build dans votre terminal :

```bash
npm install
npm run build
```

Cette commande va :
- Compiler votre code React
- Optimiser les fichiers pour la production
- Créer un dossier **`dist/`** contenant tous les fichiers prêts à déployer

## 📁 Étape 2 : Identifier les fichiers à uploader

Après le build, vous trouverez un nouveau dossier **`dist/`** dans votre projet. C'est **UNIQUEMENT** ce dossier que vous devez uploader sur cPanel.

Le dossier `dist/` contient :
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [autres fichiers optimisés]
└── [autres fichiers statiques]
```

## 🚀 Étape 3 : Upload sur cPanel

### 3.1 Connexion à cPanel

1. Connectez-vous à votre cPanel : `https://votredomaine.com:2083`
2. Identifiez-vous avec vos credentials

### 3.2 Accéder au gestionnaire de fichiers

1. Dans cPanel, cliquez sur **"Gestionnaire de fichiers"** (File Manager)
2. Naviguez vers le dossier **`public_html`** (ou le dossier de votre domaine)

### 3.3 Nettoyer le dossier (première fois)

Si c'est votre première installation :
- Supprimez tous les fichiers existants dans `public_html` (ou faites un backup)

### 3.4 Uploader les fichiers

**Option A : Upload via l'interface cPanel**
1. Dans le gestionnaire de fichiers, cliquez sur **"Upload"**
2. Sélectionnez **TOUS les fichiers** à l'intérieur du dossier `dist/`
3. Uploadez-les directement dans `public_html/`

**Option B : Upload via FTP (recommandé pour gros projets)**
1. Téléchargez un client FTP (FileZilla, WinSCP, etc.)
2. Connectez-vous avec vos identifiants FTP cPanel
3. Glissez-déposez tout le contenu du dossier `dist/` dans `public_html/`

**⚠️ IMPORTANT** : Uploadez le **CONTENU** du dossier `dist/`, pas le dossier `dist/` lui-même !

Structure finale dans `public_html/` :
```
public_html/
├── index.html          ✅
├── assets/             ✅
├── vite.svg            ✅
└── [autres fichiers]   ✅

❌ NE PAS AVOIR :
public_html/dist/...
```

## 🔧 Étape 4 : Configuration cPanel (important pour React Router)

### 4.1 Créer un fichier .htaccess

React Router nécessite une configuration spéciale pour que les routes fonctionnent.

1. Dans `public_html/`, créez un fichier `.htaccess`
2. Ajoutez ce contenu :

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

Ce fichier redirige toutes les requêtes vers `index.html`, permettant à React Router de gérer la navigation.

### 4.2 Vérifier les permissions

1. Sélectionnez tous les fichiers dans `public_html/`
2. Clic droit → **"Permissions"** ou **"Change Permissions"**
3. Fichiers : `644` (rw-r--r--)
4. Dossiers : `755` (rwxr-xr-x)

## ✅ Étape 5 : Tester le déploiement

1. Ouvrez votre navigateur
2. Accédez à votre domaine : `https://votredomaine.com`
3. Vérifiez que :
   - La page d'accueil se charge correctement
   - La navigation fonctionne (Dashboard, Login, etc.)
   - Les appels API fonctionnent (vérifiez dans la console développeur)

## 🔄 Mise à jour de l'application

Pour mettre à jour votre application après des modifications :

1. **Localement** :
   ```bash
   npm run build
   ```

2. **Sur cPanel** :
   - Supprimez les anciens fichiers dans `public_html/` (sauf `.htaccess`)
   - Uploadez le nouveau contenu du dossier `dist/`
   - Videz le cache de votre navigateur (Ctrl+F5)

## 🐛 Dépannage

### Problème : Page blanche après déploiement

**Solution** :
1. Ouvrez la console développeur (F12)
2. Vérifiez les erreurs de chargement
3. Assurez-vous que le fichier `.htaccess` est présent
4. Vérifiez les permissions des fichiers

### Problème : Erreurs 404 sur les routes

**Solution** : Le fichier `.htaccess` n'est pas configuré correctement. Suivez l'étape 4.1.

### Problème : Erreurs API (CORS)

**Solution** :
1. Vérifiez que `VITE_API_URL` dans `.env` est correct
2. Assurez-vous que votre backend autorise le nouveau domaine frontend dans sa configuration CORS
3. Exemple pour Django :
   ```python
   CORS_ALLOWED_ORIGINS = [
       "https://votredomaine.com",
   ]
   ```

### Problème : Les images ne se chargent pas

**Solution** :
1. Vérifiez que toutes les images sont dans le dossier `src/assets/` ou `public/`
2. Re-buildez l'application : `npm run build`

## 📝 Checklist de déploiement

- [ ] Fichier `.env` configuré avec `VITE_API_URL`
- [ ] `npm run build` exécuté avec succès
- [ ] Contenu du dossier `dist/` uploadé dans `public_html/`
- [ ] Fichier `.htaccess` créé avec la configuration React Router
- [ ] Permissions correctes (644 pour fichiers, 755 pour dossiers)
- [ ] Test sur le navigateur
- [ ] Vérification des appels API
- [ ] Backend configuré pour accepter les requêtes du nouveau domaine (CORS)

## 🎉 Félicitations !

Votre application React est maintenant déployée sur cPanel !

---

**💡 Astuce** : Pour automatiser les déploiements futurs, vous pouvez :
- Utiliser un script de déploiement FTP
- Configurer un pipeline CI/CD (GitHub Actions + FTP)
- Utiliser un service comme DeployBot ou Buddy
