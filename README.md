# Suivi Symptothermie

Application web de suivi des observations du cycle et d’apprentissage.

## Principes

- Les observations sont conservées localement dans le navigateur.
- Les sauvegardes sont exportables/importables au format JSON.
- L’application affiche des repères descriptifs et pédagogiques ; elle ne fournit pas de diagnostic ni de recommandation contraceptive automatisée.
- Les données importées sont validées avant restauration et les fichiers de sauvegarde sont limités à 2 Mo.

## Vérification

`npm test`

`npm run check`
