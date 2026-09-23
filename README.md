# Suivi Symptothermie

Application web/PWA de suivi des observations du cycle et d'apprentissage, conçue selon une approche **local-first**.

## Accéder à l'application

**Application :** https://couple-et-sexualite.github.io/suivi-symptothermie/

L'application fonctionne dans un navigateur moderne et peut être installée comme PWA lorsque le navigateur et l'appareil le permettent.

## Fonctionnalités

- Saisie et modification des observations quotidiennes.
- Température basale en **Celsius ou Fahrenheit**.
- Saisie manuelle toujours disponible.
- Connexion à certains thermomètres Bluetooth compatibles avec le service Web Bluetooth Health Thermometer lorsque le navigateur et le matériel le permettent.
- Suivi de la glaire, des saignements et du contexte d'observation.
- Graphique, calendrier et historique.
- Repère descriptif **« Décalage thermique détecté »**, sans interprétation automatique d'ovulation.
- 8 modules pédagogiques avec quiz.
- Langue détectée automatiquement lors de la première utilisation, avec changement manuel possible dans le profil.
- Français, anglais, espagnol et arabe, avec prise en charge RTL pour l'arabe.
- Thème clair/sombre.
- Export et import des données au format JSON.
- Suppression complète des données locales depuis le profil.
- Fonctionnement local-first sans compte obligatoire.

## Données et confidentialité

Les observations sont conservées localement dans le navigateur par défaut. Les fonctions locales de l'application n'envoient pas le journal d'observations à un serveur applicatif.

Les sauvegardes JSON peuvent contenir des informations personnelles ou relatives à la santé : conservez-les dans un emplacement sécurisé et ne les partagez qu'avec une personne ou un service de confiance.

- [Politique de confidentialité](PRIVACY.md)
- [Conditions d'utilisation](TERMS.md)

## Important — limites médicales

Cette application est un **outil d'observation et d'éducation**. Elle ne constitue pas un dispositif de diagnostic et ne remplace pas un professionnel de santé.

Elle ne fournit pas automatiquement :
- de diagnostic ;
- de confirmation automatique de l'ovulation ;
- de « jours sûrs » ;
- de recommandation contraceptive personnalisée ;
- de traitement.

Les mesures peuvent être perturbées par différents facteurs, notamment maladie ou fièvre, médicaments, sommeil perturbé, voyage, alcool, post-partum, allaitement ou périménopause. Les contenus pédagogiques doivent être utilisés avec leurs limites et leur contexte.

## Sauvegarde et changement d'appareil

Comme les données sont locales, utilisez régulièrement **Exporter mes données**.

Avant de changer de navigateur ou d'appareil :

1. Exportez une sauvegarde JSON.
2. Conservez le fichier dans un emplacement sécurisé.
3. Ouvrez l'application sur le nouvel appareil.
4. Utilisez **Importer une sauvegarde**.
5. Vérifiez les données restaurées.

L'import remplace les données locales correspondantes après confirmation.

## Bluetooth

La connexion Bluetooth dépend notamment :
- du navigateur ;
- du système d'exploitation ;
- du matériel ;
- du support Web Bluetooth ;
- du service Bluetooth réellement exposé par le thermomètre.

La saisie manuelle reste disponible si Bluetooth n'est pas compatible.

## Installation PWA

Sur un navigateur compatible, utilisez l'option **Installer l'application** ou **Ajouter à l'écran d'accueil**.

L'application contient un manifeste PWA, un service worker et des icônes d'installation dédiées. Le fonctionnement hors connexion couvre le shell applicatif mis en cache ; certaines fonctions dépendant du navigateur ou d'Internet restent soumises à leurs propres contraintes.

## Vérification technique

Tests automatisés disponibles :

```bash
npm install
npm test
npm run check
npm run test:e2e
npm run test:e2e:mobile
npm run test:lighthouse
```

La suite E2E couvre Chromium, Firefox, WebKit, Chrome mobile et Safari mobile, ainsi que l'accessibilité avec axe-core.

## État du projet

Le projet est préparé pour une utilisation publique et une future commercialisation. Les éléments qui dépendent du contexte de commercialisation — paiement, comptes, synchronisation cloud, traitement de données à distance, obligations réglementaires et validation juridique dans les pays ciblés — doivent être ajoutés et vérifiés séparément avant leur mise en production.

## Licence et propriété

Aucune licence open source n'est accordée par défaut par ce dépôt. Les droits d'utilisation, de reproduction, de modification et de redistribution doivent être déterminés par le propriétaire du projet avant toute diffusion sous licence particulière.
