# 🤖 Configuration GitHub Actions pour Déploiement Automatique

Ce guide explique comment configurer le déploiement automatique vers cPanel O2 Switch à chaque push sur la branche `main`.

## 📋 Prérequis

- [x] Repository GitHub pour votre projet
- [x] Accès aux paramètres du repository (Settings)
- [x] Informations de connexion FTP de votre cPanel O2 Switch

---

## 🔑 Étape 1 : Configurer les Secrets GitHub

Les secrets permettent de stocker de manière sécurisée vos identifiants FTP sans les exposer dans le code.

### 1.1 Aller dans les paramètres du repository

1. Ouvrez votre repository sur GitHub
2. Cliquez sur **Settings** (Paramètres)
3. Dans le menu de gauche, cliquez sur **Secrets and variables** → **Actions**
4. Cliquez sur **New repository secret**

### 1.2 Ajouter les secrets suivants

Créez **4 secrets** avec les valeurs correspondantes :

#### Secret 1: `FTP_SERVER`
- **Nom** : `FTP_SERVER`
- **Valeur** : `ftp.votredomaine.com` ou `ftp.o2switch.fr`
- **Description** : Adresse du serveur FTP

#### Secret 2: `FTP_USERNAME`
- **Nom** : `FTP_USERNAME`
- **Valeur** : Votre nom d'utilisateur cPanel (généralement celui de votre email)
- **Description** : Nom d'utilisateur FTP

#### Secret 3: `FTP_PASSWORD`
- **Nom** : `FTP_PASSWORD`
- **Valeur** : Votre mot de passe cPanel
- **Description** : Mot de passe FTP

⚠️ **IMPORTANT** : Ne partagez JAMAIS ce mot de passe publiquement !

#### Secret 4: `FTP_SERVER_DIR`
- **Nom** : `FTP_SERVER_DIR`
- **Valeur** : `/public_html/` (ou le chemin vers votre dossier web)
- **Description** : Dossier de destination sur le serveur

**Exemples de FTP_SERVER_DIR :**
- Site principal : `/public_html/`
- Sous-domaine : `/domains/sub.votredomaine.com/public_html/`
- Dossier spécifique : `/public_html/app/`

#### Secret 5 (optionnel): `VITE_API_URL`
- **Nom** : `VITE_API_URL`
- **Valeur** : `https://api.votredomaine.com`
- **Description** : URL de votre API backend

---

## ✅ Étape 2 : Vérifier le Workflow

Le fichier `.github/workflows/deploy-cpanel.yml` a déjà été créé dans votre projet.

### Structure du workflow :

```yaml
name: 🚀 Deploy to cPanel O2 Switch

on:
  push:
    branches:
      - main  # Déploie automatiquement sur push vers main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - Checkout du code
      - Setup Node.js
      - Installation des dépendances
      - Build de l'application
      - Déploiement via FTP
```

### Comment ça fonctionne :

1. **Trigger** : Chaque fois que vous pushez sur la branche `main`
2. **Build** : GitHub Actions build votre application React
3. **Deploy** : Les fichiers du dossier `dist/` sont envoyés sur votre cPanel via FTP
4. **Notification** : Vous recevez une notification de succès ou d'échec

---

## 🚀 Étape 3 : Premier Déploiement

### 3.1 Committer le workflow

```bash
git add .github/workflows/deploy-cpanel.yml
git commit -m "ci: add GitHub Actions deployment workflow"
git push origin main
```

### 3.2 Vérifier le déploiement

1. Allez sur GitHub → Votre repository → **Actions**
2. Vous devriez voir le workflow "🚀 Deploy to cPanel O2 Switch" en cours
3. Cliquez dessus pour voir les logs en temps réel
4. Attendez que toutes les étapes soient ✅ vertes

### 3.3 Tester le site

Une fois le workflow terminé :
- Ouvrez `https://votredomaine.com`
- Vérifiez que le site s'affiche correctement
- Testez la navigation et le refresh des pages

---

## 🔄 Utilisation Quotidienne

Maintenant, chaque fois que vous voulez déployer :

```bash
# 1. Faites vos modifications
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin main

# 2. GitHub Actions s'occupe du reste automatiquement !
# - Build
# - Tests (si configurés)
# - Déploiement
```

**Plus besoin de :**
- Builder manuellement avec `npm run build`
- Se connecter à FileZilla
- Uploader les fichiers un par un
- Vérifier que tout est bien uploadé

Tout est automatique ! 🎉

---

## 🔧 Déploiement Manuel (optionnel)

Vous pouvez aussi déclencher le déploiement manuellement sans pusher de code :

1. Allez sur GitHub → Actions
2. Cliquez sur "🚀 Deploy to cPanel O2 Switch"
3. Cliquez sur **Run workflow** (bouton droit)
4. Sélectionnez la branche `main`
5. Cliquez sur **Run workflow**

---

## 🐛 Dépannage

### Problème : Le workflow échoue à l'étape "Deploy to cPanel via FTP"

**Causes possibles :**

1. **Identifiants FTP incorrects**
   - Vérifiez les secrets `FTP_USERNAME` et `FTP_PASSWORD`
   - Testez la connexion FTP avec FileZilla pour confirmer

2. **Serveur FTP incorrect**
   - Vérifiez le secret `FTP_SERVER`
   - Essayez `ftp.votredomaine.com` ou `ftp.o2switch.fr`

3. **Chemin du dossier incorrect**
   - Vérifiez le secret `FTP_SERVER_DIR`
   - Assurez-vous qu'il commence et finit par un `/` : `/public_html/`

4. **Firewall ou restrictions FTP**
   - Contactez le support O2 Switch pour autoriser les connexions depuis les IP de GitHub Actions

### Problème : Le build réussit mais le site ne se met pas à jour

**Solutions :**

1. **Vider le cache du navigateur**
   - Appuyez sur `Ctrl+Shift+R` (Windows) ou `Cmd+Shift+R` (Mac)

2. **Vérifier que les fichiers ont bien été uploadés**
   - Connectez-vous à cPanel → File Manager
   - Vérifiez la date de modification des fichiers dans `public_html`
   - Ils devraient correspondre à l'heure du dernier déploiement

3. **Vérifier le fichier .htaccess**
   - Assurez-vous qu'il est présent dans `public_html`
   - Vérifiez qu'il n'a pas été écrasé

### Problème : Variables d'environnement non prises en compte

Si `VITE_API_URL` n'est pas correctement configuré :

1. Vérifiez que le secret `VITE_API_URL` existe dans GitHub
2. Vérifiez que la ligne suivante est présente dans le workflow :
   ```yaml
   env:
     VITE_API_URL: ${{ secrets.VITE_API_URL }}
   ```

---

## 📊 Monitoring et Logs

### Voir les logs de déploiement

1. GitHub → Actions
2. Cliquez sur le workflow qui vous intéresse
3. Chaque étape affiche ses logs détaillés
4. En cas d'erreur, les logs indiquent exactement où ça a échoué

### Recevoir des notifications

Par défaut, GitHub vous envoie un email si le déploiement échoue.

Pour personnaliser :
1. GitHub → Settings → Notifications
2. Configurez "Actions" selon vos préférences

---

## 🎯 Optimisations Avancées

### 1. Déployer uniquement si le build réussit

Déjà configuré dans le workflow ! Le déploiement ne se fait que si le build réussit.

### 2. Ajouter des tests avant le déploiement

Ajoutez avant l'étape de build :

```yaml
- name: 🧪 Run tests
  run: npm test
```

### 3. Déployer sur différents environnements

Créez plusieurs workflows :
- `deploy-staging.yml` : déploie sur `staging.votredomaine.com`
- `deploy-production.yml` : déploie sur `votredomaine.com`

### 4. Notification Slack/Discord

Ajoutez une étape de notification :

```yaml
- name: 📢 Notify Slack
  if: success()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Déploiement réussi sur production !'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 🔒 Sécurité

### Bonnes pratiques :

✅ **À FAIRE :**
- Toujours utiliser des secrets pour les identifiants
- Ne jamais committer `.env` ou `.env.production` avec des vraies valeurs
- Utiliser HTTPS pour l'API
- Configurer le SSL sur cPanel

❌ **À NE PAS FAIRE :**
- Ne jamais mettre des mots de passe en dur dans le code
- Ne jamais partager vos secrets GitHub
- Ne jamais committer node_modules

---

## 📚 Ressources Utiles

- [Documentation GitHub Actions](https://docs.github.com/en/actions)
- [FTP Deploy Action](https://github.com/SamKirkland/FTP-Deploy-Action)
- [FAQ O2 Switch](https://faq.o2switch.fr/)
- [Documentation Vite](https://vitejs.dev/guide/build.html)

---

## ✅ Checklist de Configuration

Avant de considérer que tout est configuré :

- [ ] Les 4 secrets FTP sont configurés sur GitHub
- [ ] Le workflow `.github/workflows/deploy-cpanel.yml` existe
- [ ] Un premier déploiement a réussi
- [ ] Le site est accessible et fonctionnel
- [ ] Le cache du navigateur a été vidé pour tester
- [ ] Les routes React fonctionnent (refresh de page)
- [ ] Les appels API fonctionnent
- [ ] Le HTTPS est activé

---

## 🎉 C'est Prêt !

Félicitations ! Votre déploiement continu est maintenant configuré.

**Workflow de développement idéal :**

```bash
# 1. Développer en local
npm run dev

# 2. Tester
# Vérifier que tout fonctionne

# 3. Committer et pusher
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin main

# 4. ☕ Prendre un café
# Pendant ce temps, GitHub Actions build et déploie automatiquement

# 5. 🎉 Votre site est mis à jour !
```

**Plus simple, plus rapide, plus fiable !**

---

*Dernière mise à jour : Décembre 2024*
