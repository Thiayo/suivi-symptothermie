# RPS-02 — Guide d'annotation cervicale v0.1

## 1. Rôle de l'annotateur
L'annotateur décrit uniquement ce qui est explicitement présent dans l'observation. Il ne déduit ni ovulation, ni fertilité, ni infertilité, ni diagnostic.

## 2. Ordre obligatoire
1. Lire la donnée brute.
2. Identifier la langue et le contexte.
3. Extraire les dimensions explicitement observées.
4. Marquer les dimensions absentes comme inconnues, jamais comme négatives.
5. Normaliser vers un identifiant stable uniquement si l'équivalence est certaine.
6. Marquer toute ambiguïté.
7. Proposer une interprétation seulement si le référentiel validé l'autorise.
8. Laisser goldStatus=pending_expert lorsque l'interprétation méthodologique n'est pas validée.

## 3. Dimensions
### Sensation
Séparer ce qui est ressenti de ce qui est visuellement observé. Une sensation « humide » ne signifie pas automatiquement qu'une apparence particulière a été observée.

### Apparence
Conserver les termes de l'utilisatrice. Une métaphore ou un terme culturel/local n'est normalisé que si son équivalence est documentée.

### Quantité
La quantité est une dimension descriptive. Elle ne détermine pas seule la qualité cervicale.

### Contexte
Le contexte peut expliquer pourquoi une observation doit être revue, mais ne crée pas de qualité cervicale et ne permet aucun diagnostic automatique.

## 4. Données contradictoires
Deux valeurs incompatibles le même jour sont conservées. Le logiciel ne choisit pas silencieusement une valeur. Le cas reçoit ambiguity=conflict jusqu'à résolution documentée.

## 5. Multilingue
Les identifiants internes restent identiques entre langues. Une traduction doit être testée par retour vers la formulation originale lorsqu'elle est utilisée pour l'annotation. En cas d'équivalence incertaine : unknown ou ambiguous.

## 6. Cas particuliers
- saignement : conserver le contexte et les observations séparément ;
- postpartum/allaitement/post-hormonal : ne pas appliquer automatiquement une règle ordinaire ;
- médicament : enregistrer le contexte sans attribuer d'effet ;
- infection suspectée : conserver le signal déclaré sans diagnostic ;
- absence d'information : unknown, pas une valeur par défaut.

## 7. Peak
Dans RPS-02 v0.3, aucun annotateur ne doit inscrire un Peak comme vérité logicielle. Le champ peut contenir une hypothèse candidate documentée, mais goldStatus reste pending_expert jusqu'à validation du référentiel et du corpus.

## 8. Inter-évaluateurs
Chaque cas est annoté indépendamment par au moins deux évaluateurs. Les divergences sont classées :
- D1 vocabulaire ;
- D2 sensation ;
- D3 apparence ;
- D4 contexte ;
- D5 ambiguïté ;
- D6 interprétation méthodologique.

L'adjudication ne modifie jamais les annotations originales.

## 9. Critères de validation futurs
Avant activation :
- dictionnaire et traductions approuvés ;
- cas particuliers couverts ;
- accord inter-évaluateurs mesuré par dimension ;
- désaccords documentés ;
- adjudication signée ;
- version du référentiel figée ;
- tests logiciels verts ;
- revue des messages pédagogiques.

## 10. Interdits
Aucun annotateur ne doit transformer une observation en :
- « ovulation confirmée » ;
- « jour fertile » ;
- « jour infertile » ;
- « jour sûr/dangereux » ;
- diagnostic ;
- recommandation contraceptive.

Ces sorties exigeraient un référentiel validé et une évaluation clinique/méthodologique distincte.
