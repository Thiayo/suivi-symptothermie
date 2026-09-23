# Suivi Symptothermie

Application web de suivi des observations du cycle et d’apprentissage.

## Principes

- Les observations sont conservées localement dans le navigateur.
- Les sauvegardes sont exportables/importables au format JSON.
- L’application affiche des repères descriptifs et pédagogiques ; elle ne fournit pas de diagnostic ni de recommandation contraceptive automatisée.
- Les données importées sont validées avant restauration et les fichiers de sauvegarde sont limités à 2 Mo.
- Sur les navigateurs compatibles, un thermomètre Bluetooth utilisant le standard Health Thermometer peut transmettre une mesure dans le champ température ; l’utilisateur conserve la validation et l’enregistrement de l’observation.
- La connexion Bluetooth Web n’est pas disponible dans tous les navigateurs ou appareils ; la saisie manuelle reste toujours disponible.

## Utilisation

Ouvrez l’application dans un navigateur moderne. Les données du journal restent sur l’appareil par défaut. Utilisez régulièrement l’export JSON pour conserver une copie de sauvegarde, surtout avant de changer d’appareil ou de navigateur.

## Confidentialité et limites

L’application est un outil d’observation et d’apprentissage. Elle ne remplace pas un professionnel de santé et ne fournit pas de diagnostic, de traitement ni de décision contraceptive automatisée. Les données du journal ne sont pas envoyées à un serveur par les fonctions locales de l’application.

## Vérification

`npm test`

`npm run check`
