# RPS-02 — Audit méthodologique cervical v0.2

## Décision de conception

Le moteur SymRella ne doit **pas** transformer automatiquement les quatre choix UI actuels
(`sec`, `collante`, `cremeuse`, `blanc-oeuf`) en une taxonomie Sensiplan.

Les sources publiques consultées montrent que l'observation cervicale Sensiplan repose sur plusieurs dimensions, notamment le **ressenti** et l'**aspect** du mucus. Les documents d'exercices officiels montrent des descriptions plus fines que les quatre catégories actuelles : par exemple humide/sec, collant, crémeux, vitreux, grumeleux, élastique, extensible/spinnbar, ainsi que des changements de sensation. citeturn1search12turn1search13

La guideline AWMF/DGGG décrit le Peak comme le dernier jour présentant le mucus de meilleure qualité individuelle et le double contrôle comme le critère le plus tardif entre l'évaluation thermique et le troisième jour après le Peak. citeturn0search4

## Conséquence pour SymRella

### Règle SOURCE_RULE conservée

- Peak = dernier jour de la qualité de mucus individuellement la meilleure.
- Peak + 3 = troisième jour après le Peak.
- Double contrôle = critère thermique et critère cervical, avec la date la plus tardive.

### Adaptation SymRella suspendue

La table suivante n'est **pas** considérée comme une reproduction de Sensiplan :

| Valeur UI actuelle | Ancienne proposition | Décision RPS-02 v0.2 |
|---|---|---|
| sec | rang 0 | observation brute uniquement |
| collante | rang 1 | observation brute uniquement |
| cremeuse | rang 2 | observation brute uniquement |
| blanc-oeuf | rang 3 | observation brute uniquement |

Aucune hiérarchie automatique ne doit être utilisée pour déclarer un Peak tant qu'un référentiel cervical SymRella n'a pas été défini et validé.

## Pourquoi ce gel est nécessaire

Sensiplan indique lui-même que son application officielle a été développée intégralement à partir de son propre règlement et que son algorithme d'évaluation est un élément méthodologique spécifique. SymRella ne doit donc pas présenter une adaptation partielle comme étant l'algorithme Sensiplan. citeturn1search0

Sensiplan indique également que l'apprentissage et l'accompagnement par des conseillères qualifiées font partie de l'application correcte de la méthode. Son réseau actuel comprend des conseillères certifiées et sa formation est standardisée. citeturn0search1turn0search2

## Référentiel à faire valider

Avant toute sortie cervicale interprétative, un expert doit valider :

1. les dimensions observées : sensation, aspect, abondance et/ou autres dimensions retenues ;
2. le vocabulaire multilingue et ses équivalences ;
3. la représentation des observations ambiguës ;
4. la définition opérationnelle de la meilleure qualité individuelle ;
5. la gestion des plateaux, retours et nouvelles qualités supérieures ;
6. les règles de Peak et Peak+3 ;
7. les cas particuliers : saignement, pertes non cervicales, infection présumée, post-partum, allaitement, arrêt hormonal, etc. ;
8. les messages pédagogiques associés ;
9. la procédure de revue humaine lorsqu'une observation est indéterminée.

## Statut

- Thermique : implémenté et testé.
- Cervical : **observation brute seulement jusqu'à validation du référentiel**.
- Double contrôle : structure prête, mais ne peut devenir complet que lorsque les deux critères sont valides.
- Règles pré-ovulatoires de type Minus-8/5 : hors périmètre de cette version descriptive.
- Conclusion ovulation/infertilité/contraception : interdite dans ce moteur descriptif.

## Références

- AWMF/DGGG S2k 015-095, section 1.5 : https://register.awmf.org/assets/guidelines/015-095l_S2k_Nicht-hormonelle-Empfaengnisverhuetung_2024-08.pdf
- Sensiplan, méthode : https://www.sensiplan.de/
- Sensiplan, FAQ : https://www.sensiplan.de/faqs
- Sensiplan, programme d'exercices : https://www.sensiplan.de/storage/media/documents/46/sensiplan-loesungsheft-web.pdf
