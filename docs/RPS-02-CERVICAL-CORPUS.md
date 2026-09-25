# RPS-02 — Corpus cervical de validation v0.1

## Statut
Corpus de validation méthodologique. Les annotations « gold » cliniques ne sont pas préremplies. Toute décision de niveau 2 (règle cervicale/Peak) doit être validée par des évaluateurs qualifiés avant activation.

## Objectif
Construire un corpus couvrant les observations simples, ambiguës et contextuelles nécessaires pour tester :
- conservation de la donnée brute ;
- normalisation déterministe ;
- séparation sensation/apparence/contexte ;
- gestion des données manquantes et contradictoires ;
- robustesse multilingue ;
- blocage de l'interprétation non validée ;
- préparation d'une future évaluation inter-évaluateurs.

## Principe
Un cas de test n'est pas une vérité clinique. Les cas synthétiques servent à tester le comportement du logiciel et du protocole d'annotation. Ils ne doivent pas être utilisés pour entraîner ou justifier une règle clinique sans validation externe.

## Jeu de cas
| ID | Situation | Dimension principale | Risque à tester | Gold |
|---|---|---|---|---|
| C01 | aucune observation | none | absence de donnée | pending |
| C02 | sensation sèche, rien observé | sensation + appearance | distinction sensation/aspect | pending |
| C03 | aucune sensation, rien observé | sensation + appearance | valeur neutre | pending |
| C04 | humide, rien visible | sensation | ne pas inventer un aspect | pending |
| C05 | humide + aspect crémeux | sensation + appearance | combinaison | pending |
| C06 | humide + aspect transparent | sensation + appearance | vocabulaire visuel | pending |
| C07 | glissant + transparent | sensation + appearance | signal multidimensionnel | pending |
| C08 | glissant sans aspect | sensation | donnée partielle | pending |
| C09 | aspect collant sans sensation | appearance | donnée partielle | pending |
| C10 | aspect aqueux + sensation humide | appearance + sensation | normalisation | pending |
| C11 | aspect filant | appearance | ambiguïté sur la qualité | pending |
| C12 | « blanc d'œuf » | appearance | métaphore linguistique | pending |
| C13 | quantité importante sans qualité décrite | amount | ne pas inférer une qualité | pending |
| C14 | saignement + mucus décrit | context + appearance | contexte particulier | pending |
| C15 | postpartum + observation | context | contexte particulier | pending |
| C16 | allaitement + observation | context | contexte particulier | pending |
| C17 | post-hormonal + observation | context | contexte particulier | pending |
| C18 | médicament + observation | context | contexte particulier | pending |
| C19 | infection suspectée signalée | context | ne pas diagnostiquer | pending |
| C20 | deux observations contradictoires le même jour | conflict | conflit intra-journalier | pending |
| C21 | traduction française→anglaise | language | invariance | pending |
| C22 | terme local sans équivalent certain | language | ne pas sur-normaliser | pending |
| C23 | correction d'une observation antérieure | correction | audit/version | pending |
| C24 | suppression d'une observation | correction | recalcul déterministe | pending |

## Règle d'or
Si l'information ne peut pas être déterminée à partir de la donnée saisie, le corpus doit conserver unknown, other, ambiguous ou pending_expert plutôt que produire une classification supposée.

## Sortie attendue d'une annotation
Chaque annotation future doit contenir :
- caseId
- reviewerId
- ontologyVersion
- observedFeatures
- normalizedFeatures
- ambiguity
- candidateInterpretations
- goldStatus
- rationale
- source
- timestamp
- signature

## Accord
Les évaluateurs annotent indépendamment avant toute adjudication. L'accord brut, les désaccords par dimension et les cas nécessitant adjudication sont conservés séparément. Aucun consensus artificiel ne doit être créé pour augmenter un score.
