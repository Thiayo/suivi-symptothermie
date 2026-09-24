# RPS-02 — SymRella Executable Specification v0.1

Status: implementation baseline; expert validation required before any contraceptive use claim.

## Source/adaptation separation
Every rule is tagged SOURCE_RULE, SYMR_ADAPTATION, IMPLEMENTATION or VALIDATION.

## Primary sources
S01 — AWMF/DGGG S2k Guideline 015-095, version 1.1, section 1.5 and 1.9.
https://register.awmf.org/assets/guidelines/015-095l_S2k_Nicht-hormonelle-Empfaengnisverhuetung_2024-08.pdf

S02 — Sensiplan official method overview and FAQs.
https://www.sensiplan.de/en?page_id=4074
https://www.sensiplan.de/en/faqs

The guideline states that the Sensiplan example uses six low temperature values and three higher values; disturbed values are excluded. A rise is defined by three consecutive higher values, with the third at least 0.2°C above the highest of the preceding six. It also describes two exceptions: a fourth high value may complete the rise when the third is below +0.2°C, and one low/on-line value may occur between required higher values provided the third higher value reaches +0.2°C. The guideline defines the cervical Peak as the last day with the individually best mucus and the post-ovulatory double-check as the later of the evening of the third day after Peak or completion of the temperature evaluation.

## Definitive data model
Cycle: id, version, startedAt, endedAt, observations, previousCycleIds, engine.
DailyObservation: date, cycleDay, bleeding, temperature, cervical, disturbances, contextual, intercourse, notes.
TemperatureObservation: valueC, unitOriginal, measurementTime, measurementMethod, quality, disturbanceIds.
CervicalObservation: rawValue, sensation/appearance when available, quality, source.

The current UI's four mucus choices are retained as raw observations. Their ranking for a Peak is explicitly a SYMR_ADAPTATION_PENDING_EXPERT_REVIEW until reviewed by a qualified method expert; SymRella must not claim that these four UI categories reproduce the full Sensiplan mucus rule.

## Thermal engine
1. Normalize all temperatures to Celsius.
2. Sort by date.
3. Exclude values explicitly marked disturbed from calculation, while preserving them.
4. For each candidate inspect the six immediately preceding usable measurements.
5. Require three subsequent higher measurements.
6. The third higher measurement must be at least 0.20°C above the highest of the six preceding low values.
7. Exception 1: if the third is above the reference but below +0.20°C, a fourth value above the reference completes the thermal criterion.
8. Exception 2: one low/on-line value may occur between the required higher values; it is not counted as a qualifying high; the third qualifying high must still be at least +0.20°C.
9. If no rule is satisfied, return NO_SHIFT or INSUFFICIENT_DATA.
10. Never infer ovulation from this engine.

## Cervical engine
1. Keep the user's raw observation.
2. Current UI descriptive ranking: sec=0, collante=1, cremeuse=2, blanc-oeuf=3.
3. Peak is the last day with the maximum observed quality before deterioration.
4. Peak completion is calendar-day +3, not third observation.
5. A new higher observation resets the provisional Peak.
6. This ranking is a SYMR_ADAPTATION_PENDING_EXPERT_REVIEW.
7. Never infer ovulation or infertility.

## Double-check
Complete only when thermal status is SHIFT_CONFIRMED and cervical status is PEAK_PLUS_3_COMPLETED.
completionDay is the later of thermal confirmation date and cervical Peak+3 date.
The engine remains descriptive and never outputs contraceptive safe/unsafe days.

## Engine states
NO_DATA, OBSERVING, CERVICAL_TRANSITION, THERMAL_RISE_CANDIDATE, DOUBLE_CHECK_PENDING, DOUBLE_CHECK_COMPLETE, UNRESOLVED, DISTURBED, CYCLE_COMPLETE.

## Tutor message policy
Allowed: explain missing data, disturbed measurements, provisional thermal rise, cervical transition, incomplete double-check, completed descriptive criteria, unresolved patterns.
Forbidden automatic conclusions: ovulation confirmed, infertile, safe day, unsafe day, protected, contraception confirmed, diagnosis.

## Validation gate
No production integration of RPS-02 is accepted until unit tests pass, the traceability matrix is complete, cervical mapping is reviewed by a qualified method expert, the exact selected method/reference is declared in product documentation, and UI messages are reviewed for non-diagnostic/non-contraceptive wording.
