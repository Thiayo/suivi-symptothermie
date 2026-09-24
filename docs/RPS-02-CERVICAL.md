# RPS-02-CERVICAL — Référentiel d'observation v0.3

## 1. Objet

Ce document définit le modèle d'observation cervicale de SymRella, sans le présenter comme une reproduction du référentiel Sensiplan.

Les sources méthodologiques indiquent que la catégorisation du mucus dépend de la méthode et que, pour l'exemple Sensiplan, le Peak correspond au dernier jour présentant le meilleur mucus individuel. Le cycle sheet distingue notamment les dimensions « Sensation » et « Mucus Appearance ».

## 2. Architecture
- observation : ce que l'utilisatrice rapporte ;
- normalisation : traduction technique contrôlée ;
- interprétation : application d'un référentiel validé ;
- pédagogie : explication destinée à l'utilisatrice ;
- validation humaine : traitement des cas indéterminés.

Aucune traduction ne doit créer une information absente de l'observation originale.

## 3. Objet CervicalObservation

{ date, source, sensation, appearance, amount, context, rawValue, notes }

### sensation
- dry — sec
- not_dry — non sec
- moist — humide
- slippery — glissant
- unknown

### appearance
- none
- sticky
- creamy
- watery
- glassy
- stretchy
- egg_white_like
- lumpy
- other
- unknown

Cette liste est une proposition d'ontologie SymRella, pas une déclaration d'équivalence Sensiplan.

### amount
- none
- small
- moderate
- large
- unknown

L'abondance ne doit jamais être utilisée seule pour déterminer une qualité cervicale.

### context
- normal
- bleeding
- postpartum
- breastfeeding
- post_hormonal
- infection_suspected
- medication
- other
- unknown

Le contexte ne doit pas être utilisé pour inventer une qualité.

## 4. Conservation de la donnée originale
Chaque observation conserve la valeur saisie originale, la langue de saisie, les valeurs normalisées, la date/heure, la source et les éventuelles corrections.

Une modification ou suppression provoque une réévaluation déterministe de l'ensemble du cycle.

## 5. Interprétation
- Niveau 0 — Observation : toujours autorisé.
- Niveau 1 — Description : changements de sensation/aspect, observations répétées, données manquantes et perturbations peuvent être décrits.
- Niveau 2 — Règle cervicale : bloqué dans RPS-02 v0.3 jusqu'à validation expert.
- Niveau 3 — Double contrôle : reste PENDING tant que le critère cervical n'est pas validé.

Aucune peakDate ou peakPlusThreeDate ne doit être calculée par le moteur actuel.

## 6. Cas ambigus
Les observations contradictoires, incomplètes, linguistiquement ambiguës ou potentiellement liées à une autre cause restent unknown/other et ne sont pas automatiquement classées.

## 7. Multilingue
Le stockage interne utilise des identifiants stables. Les libellés utilisateur sont traduits séparément (fr, en, es, ar et futures langues). Une traduction ne modifie jamais la logique du moteur.

## 8. Validation expert
Avant activation d'une interprétation cervicale : validation de l'ontologie, des définitions, des cas mixtes et particuliers, des traductions, d'un corpus de cycles annotés, de la reproductibilité inter-évaluateurs et des messages pédagogiques, avec version/signature du référentiel approuvé.

## 9. Statut
RPS-02-CERVICAL v0.3 = PROPOSITION À VALIDER.

Ce référentiel est volontairement plus précis que les quatre boutons actuels, mais aucune nouvelle catégorie n'est présentée comme une règle officielle Sensiplan.