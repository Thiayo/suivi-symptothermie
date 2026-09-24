# RPS-02 traceability matrix

| Rule | Source | Type | Code | Tests | Validation |
|---|---|---|---|---|---|
| R01 six reference temperatures | S01 §1.5.1.1 | SOURCE_RULE | evaluateThermal | T03,T06,T08 | automated |
| R02 three higher values | S01 §1.5.1.1 | SOURCE_RULE | evaluateThermal | T06 | automated |
| R03 third high +0.20°C | S01 §1.5.1.1 | SOURCE_RULE | evaluateThermal | T06,T07 | automated |
| R04 fourth-value exception | S01 §1.5.1.1 | SOURCE_RULE | evaluateThermal | T05 | automated |
| R05 ignored low/on-line value | S01 §1.5.1.1 | SOURCE_RULE | candidateWithIgnoredLow | T31 | automated + expert review |
| R06 Peak definition | S01 §1.5.1.2 | SOURCE_RULE | cervical ontology (blocked) | T12-T17,C01-C24 | expert validation required |
| R07 Peak + 3 calendar days | S01 §1.5.2 | SOURCE_RULE | cervical ontology (blocked) | T14,T16,C01-C24 | expert validation required |
| R08 later of two criteria | S01 §1.5.2 | SOURCE_RULE | evaluateDoubleCheck | T18-T22 | automated |
| R09 descriptive states | SymRella product specification | SYMR_ADAPTATION | evaluateCycle | T01,T02,T34 | product review |
| R10 no diagnostic/contraceptive conclusions | SymRella product specification | SYMR_ADAPTATION | getTutorMessage | T34 | product/safety review |
| R11 preserve raw observations | SymRella architecture | SYMR_ADAPTATION | engine input contract | T08,T27,T30,P02,C01-C24 | automated |
| R12 temperature unit normalization | SymRella implementation | IMPLEMENTATION | fahrenheitToCelsius | T10,T26 | automated |
| R13 cervical ambiguity must remain unresolved | RPS-02-CERVICAL v0.3 | SYMR_ADAPTATION | cervical engine | T12-T17,C01-C24 | automated |
| R14 annotation independence | RPS-02-CERVICAL-ANNOTATION v0.1 | VALIDATION_PROTOCOL | annotation workflow | future inter-rater suite | expert validation |
| R15 multilingual invariance | RPS-02-CERVICAL-ANNOTATION v0.1 | VALIDATION_PROTOCOL | normalization layer | future multilingual suite | expert validation |

## Validation status
- Thermal core: implemented and unit-tested.
- Cervical taxonomy: PENDING EXPERT REVIEW. The current app has only four mucus UI categories; these are not claimed to reproduce the complete Sensiplan mucus taxonomy.
- Cervical corpus: 24 synthetic validation cases, deliberately kept at pending_expert for methodological review.
- Annotation protocol: defined; independent annotation and adjudication are required before any gold set is created.
- Double-check: implemented for the two explicit completion criteria above, but cervical completion remains blocked.
- Early-cycle Minus-8 / 5-day rules: NOT IMPLEMENTED because current product scope is descriptive rather than contraceptive.
- Expert approval: required before any future feature can expose fertile/infertile or contraceptive conclusions.
