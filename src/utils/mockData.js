import MainImage from '../assets/hero-image.png';
import icon1 from '../assets/icons-services/base_feature_icon_1.svg';
import icon2 from '../assets/icons-services/base_feature_icon_2.svg';
import icon3 from '../assets/icons-services/base_feature_icon_3.svg';
import icon4 from '../assets/icons-services/base_feature_icon_4.svg';
import icon5 from '../assets/icons-services/base_feature_icon_5.svg';
import icon6 from '../assets/icons-services/base_feature_icon_6.svg';
import analyseMatch from '../assets/analyse_match.png';
import fcLyon from '../assets/reviews/FC Lyon Logo.svg';
import asVilleurbanne from '../assets/reviews/AS Villeurbanne U18 Logo.svg';
import olympiqueRillieux from '../assets/reviews/Olympique Rillieux Logo.svg';
export const landingPageData = {
  navbar: {
    logo: 'Skills View',
    links: [
      { label: 'Accueil', href: '#' },
      { label: 'Services', href: '#services' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Contact', href: '#contact' },
    ],
  },

  hero: {
    title: 'L\'analyse vidéo et les données enfin accessibles à tous les clubs',
    // Uniquement les mots/phrases à colorer différemment
    highlightedWords: [
            { text: 'tous les clubs', color: 'text-primary' },

      { text: 'accessibles', color: 'text-primary' },
    ],
    subtitle: 'Une plateforme tout-en-un pour analyser vos matchs, <br/>suivre vos joueurs et booster vos performances.',
    buttons: [
      { label: 'Essayer gratuitement', primary: true  , link:'/pricing'},
      { label: 'Reserver un visio', primary: false , link:'https://cal.com/mathis-skillsview/30min?overlayCalendar=true'},
    ],
    floatingCard: {
      title: 'Total Stats',
      value: '12,000',
    },
    MainImage: MainImage,
  },

  services: {
    title: 'Jusqu’ici, l’analyse pro était réservée à l’élite. Plus maintenant.',
    items: [
      {
        id: 1,
        icon: icon1,
        title: 'Tout-en-un',
        description: 'Analyse vidéo, génération de statistiques et comparaison des performances, tout sur une seule interface.',
      },
      {
        id: 2,
        icon: icon2,
        title: 'Automatisé',
        description: 'Les vidéos de match sont analysées automatiquement pour détecter joueurs, actions et événements clés.',
      },
      {
        id: 3,
        icon: icon3,
        title: 'Séquençage auto',
        description: 'Chaque action est extraite, classée et prête à être consultée ou compilée.',
      },
      {
        id: 4,
        icon: icon4,
        title: 'Statistiques',
        description: 'Analyse globale ou individuelle, comparaison entre matchs ou joueurs, graphiques interactifs.',
      },
      {
        id: 5,
        icon:icon5,
        title: 'Espace personnel',
        description: 'Suivi de tous les matchs, vidéos, statistiques et profils joueurs dans un compte unique.',
      },
      {
        id: 6,
        icon: icon6,
        title: 'Accesibilité',
        description: 'Interface intuitive, compatible avec plusieurs angles de caméra et vidéos de qualité variable, adaptée aux clubs amateurs.',
      },
    ],
  },

  features: {
    title: 'Pourquoi choisir Skills View?',
    description: 'Nous offrons la solution la plus complète pour l\'analyse de matchs de football',
    image: analyseMatch,
  },

  reviews: {
    title: 'Validé sur le terrain par des clubs comme le vôtre.',
    items: [
      {
        id: 1,
        text: 'On gagne 3h d’analyse par match. C\'est un game-changer pour notre staff et nos joueurs.',
        author: 'Coach Martin',
        team: 'AS Villeurbanne U18',
        image:asVilleurbanne ,
      },
      {
        id: 2,
        text: 'La simplicité est bluffante. En 15 minutes, le match est analysé. Nos causeries sont beaucoup plus percutantes.',
        author: 'Julie Dubois',
        team: 'FC Lyon Féminines',
        image: fcLyon,
      },
      {
        id: 3,
        text: 'Les joueurs adorent revoir leurs actions et leurs stats. L\'engagement est monté en flèche.',
        author: 'Pierre Bernard',
        team: 'Olympique Rillieux U15',
        image: olympiqueRillieux,
      },
    ],
  },

  pricing: {
    title: 'Plans de Tarification',
    items: [
      {
        id: 1,
        name: 'Free',
        description:'Idéale pour découvrir SkillsView et tester ses fonctionnalités.',
        price: 0,
        period: 'par mois',
        annualPrice: 0,
        features: [
          'Import jusqu\'à 1 matchs/mois',
          'Découpage automatique',
          'Statistiques globale',
          'Espace personnel.',
          'Support limité.',
        ],
        cta: 'Souscrire',
        free:true 
      },
      {
        id: 2,
        name: 'Professional',
        description:'Pour les clubs réguliers souhaitant un suivi plus complet et des analyses approfondies.',
        price: 19,
        period: 'par mois',
        annualPrice: 199,
        features: [
          'Import jusqu\'à 3 matchs/mois',
          'Classification des actions ',
          'Statistique individuel.',
          'Visualisation dynamique.',
          'Support prioritaire.',
        ],
        cta: 'Souscrire',
        popular: true,
        
      },
      {
        id: 3,
        name: 'Ultimate',
        description:"Pour les clubs réguliers souhaitant un suivi professionel et personnalisé.",
        price: 39,
        period: 'par mois',
        annualPrice: 421,
        features: [
          'Import ilimités',
          'Annotation des actions.',
          'Statistiques avancés.',
          'Mode collaboratif.',
          'Assistance téléphonique.',
        ],
        cta: 'Souscrire',
      },
    ],
  },

  cta: {
    title: 'Rejoignez la nouvelle génération d\'analyse sportive.',
    subtitle: 'Passez au niveau supérieur. Sans effort, sans vous ruiner.',
    buttons: [
      { label: 'Démarrer maintenant', primary: true , link:'/pricing' },
      { label: 'Réserver une visio personnalisée', primary: false ,  link:'https://cal.com/mathis-skillsview/30min?overlayCalendar=true' },
    ],
  },

  footer: {
    logo: 'Skills View',
    tagline: 'La plateforme d\'analyse vidéo pour les clubs de football',
    sections: [
      {
        title: 'Produit',
        links: [
          { label: 'Accueil', href: '#' },
          { label: 'Fonctionnalités', href: '#' },
          { label: 'Pricing', href: '#' },
          { label: 'Blog', href: '#' },
        ],
      },
      {
        title: 'Entreprise',
        links: [
          { label: 'À propos', href: '#' },
          { label: 'Carrières', href: '#' },
          { label: 'Contact', href: '#' },
          { label: 'Partenaires', href: '#' },
        ],
      },
      {
        title: 'Légal',
        links: [
          { label: 'Politique de confidentialité', href: '#' },
          { label: 'Conditions d\'utilisation', href: '#' },
          { label: 'Cookies', href: '#' },
          { label: 'RGPD', href: '#' },
        ],
      },
    ],
  },
};

export default landingPageData;
