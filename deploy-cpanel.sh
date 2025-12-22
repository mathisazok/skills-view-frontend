#!/bin/bash

# 🚀 Script de déploiement automatique pour cPanel O2 Switch
# Ce script build l'application et la déploie sur votre hébergement cPanel

echo "╔════════════════════════════════════════╗"
echo "║  Déploiement cPanel O2 Switch - v1.0   ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration - À PERSONNALISER
CPANEL_USER=""          # Votre nom d'utilisateur cPanel
CPANEL_HOST=""          # Exemple: ftp.votredomaine.com
CPANEL_REMOTE_PATH=""   # Exemple: /public_html ou /domains/votredomaine.com/public_html
FTP_PORT=21

# Fonction pour afficher les messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Vérifier si les variables sont configurées
if [ -z "$CPANEL_USER" ] || [ -z "$CPANEL_HOST" ] || [ -z "$CPANEL_REMOTE_PATH" ]; then
    print_error "Configuration manquante !"
    print_info "Veuillez configurer les variables CPANEL_USER, CPANEL_HOST et CPANEL_REMOTE_PATH dans le script."
    exit 1
fi

# Étape 1: Vérifier Node.js
print_info "Vérification de Node.js..."
if ! command -v node &> /dev/null; then
    print_error "Node.js n'est pas installé !"
    exit 1
fi
print_success "Node.js $(node --version) détecté"

# Étape 2: Installer les dépendances
print_info "Installation des dépendances..."
npm install
if [ $? -ne 0 ]; then
    print_error "Échec de l'installation des dépendances"
    exit 1
fi
print_success "Dépendances installées"

# Étape 3: Build de production
print_info "Build de l'application pour la production..."
npm run build
if [ $? -ne 0 ]; then
    print_error "Échec du build"
    exit 1
fi
print_success "Build terminé avec succès"

# Étape 4: Vérifier que le dossier dist existe
if [ ! -d "dist" ]; then
    print_error "Le dossier 'dist' n'existe pas après le build"
    exit 1
fi

print_success "Dossier 'dist' créé : $(du -sh dist | cut -f1)"

# Étape 5: Déploiement
echo ""
print_info "═══════════════════════════════════════"
print_info "   OPTIONS DE DÉPLOIEMENT"
print_info "═══════════════════════════════════════"
echo ""
echo "1. Déploiement via FTP (lftp requis)"
echo "2. Déploiement via Git (accès SSH requis)"
echo "3. Déploiement manuel (instructions)"
echo "4. Annuler"
echo ""
read -p "Choisissez une option (1-4): " deploy_option

case $deploy_option in
    1)
        # Déploiement FTP
        print_info "Déploiement via FTP..."

        if ! command -v lftp &> /dev/null; then
            print_error "lftp n'est pas installé !"
            print_info "Installation: "
            print_info "  - Ubuntu/Debian: sudo apt-get install lftp"
            print_info "  - macOS: brew install lftp"
            print_info "  - Windows: utilisez WinSCP ou FileZilla"
            exit 1
        fi

        read -sp "Mot de passe cPanel: " CPANEL_PASSWORD
        echo ""

        print_info "Upload des fichiers vers $CPANEL_HOST..."

        lftp -u "$CPANEL_USER,$CPANEL_PASSWORD" "$CPANEL_HOST" <<EOF
set ftp:ssl-allow no
cd $CPANEL_REMOTE_PATH
mirror -R --delete --verbose dist/ ./
bye
EOF

        if [ $? -eq 0 ]; then
            print_success "Déploiement FTP terminé !"
        else
            print_error "Échec du déploiement FTP"
            exit 1
        fi
        ;;

    2)
        # Déploiement Git
        print_info "Déploiement via Git..."
        print_warning "Cette méthode nécessite que votre hébergeur ait configuré Git et un post-receive hook."
        print_info "Consultez la documentation O2 Switch pour plus d'informations."

        # Commit et push
        git add dist/
        git commit -m "Build: $(date +'%Y-%m-%d %H:%M:%S')"
        git push origin main

        print_success "Code poussé sur GitHub. Configurez le webhook sur cPanel."
        ;;

    3)
        # Instructions manuelles
        print_info "═══════════════════════════════════════"
        print_info "   DÉPLOIEMENT MANUEL"
        print_info "═══════════════════════════════════════"
        echo ""
        print_info "1. Le dossier 'dist' a été créé avec succès"
        print_info "2. Connectez-vous à votre cPanel O2 Switch"
        print_info "3. Allez dans 'Gestionnaire de fichiers' (File Manager)"
        print_info "4. Naviguez vers public_html (ou votre dossier web)"
        print_info "5. Supprimez tous les fichiers existants dans ce dossier"
        print_info "6. Uploadez TOUT le contenu du dossier 'dist' (pas le dossier lui-même)"
        print_info "7. Assurez-vous que le fichier .htaccess est présent"
        print_info "8. Testez votre site !"
        echo ""
        print_warning "Important: Uploadez le CONTENU de dist/, pas le dossier dist/ lui-même"
        ;;

    4)
        print_info "Déploiement annulé"
        exit 0
        ;;

    *)
        print_error "Option invalide"
        exit 1
        ;;
esac

echo ""
print_success "═══════════════════════════════════════"
print_success "   DÉPLOIEMENT TERMINÉ !"
print_success "═══════════════════════════════════════"
echo ""
print_info "Prochaines étapes:"
print_info "1. Testez votre site"
print_info "2. Vérifiez que le routing SPA fonctionne (rafraîchir une page)"
print_info "3. Configurez vos variables d'environnement si nécessaire"
print_info "4. Vérifiez la console du navigateur pour les erreurs"
echo ""
print_success "Bonne mise en ligne ! 🎉"
