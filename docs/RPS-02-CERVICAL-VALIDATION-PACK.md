# RPS-02 — Pack de validation cervicale v0.1

## Contenu
1. `docs/RPS-02-CERVICAL.md` — ontologie proposée.
2. `docs/RPS-02-CERVICAL-AUDIT.md` — audit méthodologique et points bloquants.
3. `docs/RPS-02-CERVICAL-CORPUS.md` — 24 cas de validation.
4. `docs/RPS-02-CERVICAL-ANNOTATION.md` — protocole d'annotation.
5. `tests/fixtures/rps02-cervical-corpus.json` — corpus machine-readable.
6. `tests/rps02-cervical-corpus.test.js` — invariants logiciels.
7. `tests/rps02-cervical-corpus-fixture.test.js` — contrôle du corpus.
8. `docs/RPS-02-TRACEABILITY.md` — traçabilité règle/source/code/test/validation.

## Gate G0 — logiciel
Le moteur doit :
- conserver les données originales ;
- ne pas produire Peak ;
- ne pas produire Peak+3 ;
- signaler explicitement `interpretationBlocked=true` ;
- rester déterministe ;
- ne pas transformer contexte, quantité ou traduction en conclusion méthodologique.

## Gate G1 — méthode
Avant activation :
- référentiel cervical figé ;
- définitions approuvées ;
- vocabulaire multilingue validé ;
- cas particuliers définis ;
- règles Peak/Peak+3 documentées ;
- séparation explicite entre source externe et adaptation SymRella.

## Gate G2 — validation humaine
Deux évaluateurs qualifiés annotent indépendamment le corpus. Les annotations originales sont conservées. Les désaccords sont classés puis soumis à adjudication. L'adjudication produit une version signée du gold set ; elle ne remplace pas les annotations originales.

## Gate G3 — reproductibilité
Le corpus validé doit être versionné. Toute modification du référentiel ou de l'ontologie entraîne une nouvelle version du corpus et une nouvelle campagne de validation.

## Gate G4 — produit
Les textes utilisateur sont revus pour éviter toute conclusion diagnostique ou contraceptive non autorisée par le référentiel validé.

## Règle de déblocage
Aucun code ne doit passer du niveau descriptif au niveau interprétatif cervical sur la seule base des tests logiciels. Il faut simultanément satisfaire G0, G1, G2, G3 et G4.

## Statut actuel
- G0 : implémentation en cours de vérification CI.
- G1 : proposition non validée.
- G2 : non réalisée.
- G3 : infrastructure documentaire prête, validation non réalisée.
- G4 : garde-fous présents, revue finale à réaliser.

**Conclusion opérationnelle : le moteur cervical reste bloqué.**
