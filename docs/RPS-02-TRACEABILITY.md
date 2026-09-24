# RPS-02 traceability matrix

| Rule | Source | Type | Code | Tests | Validation |
|---|---|---|---|---|---|
| R01 six reference temperatures | S01 §1.5.1.1 | SOURCE_RULE | evaluateThermal | T03,T06,T08 | automated |
| R02 three higher values | S01 §1.5.1.1 | SOURCE_RULE | evaluateThermal | T06 | automated |
| R03 third high +0.20°C | S01 §1.5.1.1 | SOURCE_RULE | evaluateThermal | T06,T07 | automated |
| R04 fourth-value exception | S01 §1.5.1.1 | SOURCE_RULE | evaluateThermal | T05 | automated |
| R05 ignored low/on-line value | S01 §1.5.1.1 | SOURCE_RULE | candidateWithIgnoredLow | T31 | automated + expert review |
| R06 Peak definition | S01 §1.5.1.2 | SOURCE_RULE | cervical ontology (blocked) | T12-T17 | expert validation required |
| R07 Peak + 3 calendar days | S01 §1.5.2 | SOURCE_RULE | cervical ontology (blocked) | T14,T16 | expert validation required |
| R08 later of two criteria | S01 §1.5.2 | SOURCE_RULE | evaluateDoubleCheck | T18-T22 | automated |
| R09 descriptive states | SymRella product specification | SYMR_ADAPTATION | evaluateCycle | T01,T02,T34 | product review |
| R10 no diagnostic/contraceptive conclusions | SymRella product specification | SYMR_ADAPTATION | getTutorMessage | T34 | product/safety review |
| R11 preserve raw observations | SymRella architecture | SYMR_ADAPTATION | engine input contract | T08,T27,T30,P02 | automated |
| R12 temperature unit normalization | SymRella implementation | IMPLEMENTATION | fahrenheitToCelsius | T10,T26 | automated |

## Validation status
- Thermal core: implemented and unit-tested.
- Cervical taxonomy: PENDING EXPERT REVIEW. The current app has only four mucus UI categories; these are not claimed to reproduce the complete Sensiplan mucus taxonomy.
- Double-check: implemented for the two explicit completion criteria above.
- Early-cycle Minus-8 / 5-day rules: NOT IMPLEMENTED because current product scope is descriptive rather than contraceptive.
- Expert approval: required before any future feature can expose fertile/infertile or contraceptive conclusions.
