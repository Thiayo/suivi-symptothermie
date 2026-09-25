# RPS-02 — Batterie automatisée du corpus cervical

## Objet
Cette suite vérifie le comportement logiciel, pas la validité clinique des catégories. Elle doit échouer si le moteur recommence à produire automatiquement Peak ou Peak+3 avant validation du référentiel.

## Invariants testés
- absence d'observation => NO_DATA ;
- présence d'une observation => PENDING_EXPERT_REVIEW ;
- interpretationBlocked=true ;
- peakDate=null ;
- peakPlusThreeDate=null ;
- conservation des champs bruts ;
- ordre déterministe ;
- aucune classification dérivée de la quantité seule ;
- aucune classification dérivée du contexte seul ;
- aucune différence de logique causée par la langue ;
- les cas ambigus restent bloqués.

## Critère de sortie
100 % des tests automatisés verts et revue experte du corpus avant activation de toute règle cervicale.
