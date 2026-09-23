# International commercial readiness

Last reviewed: 23 September 2026

This checklist records the product decisions and external items to validate before selling the application internationally. It is not legal advice and does not determine regulatory status in any country.

## Current product scope

The current application is positioned as a local-first observation and education tool.

It:
- records observations entered by the user;
- displays charts, calendar and history;
- provides educational modules;
- can display a descriptive thermal-shift observation;
- supports Celsius/Fahrenheit;
- supports French, English, Spanish and Arabic;
- supports manual temperature entry and optional Web Bluetooth thermometer input where browser/device support exists;
- exports and imports local JSON backups.

It does not currently:
- diagnose disease;
- automatically confirm ovulation;
- calculate or guarantee “safe days”;
- provide personalized contraceptive recommendations;
- prescribe treatment;
- require a user account;
- send the observation journal to an application backend;
- include cloud synchronization;
- include behavioral advertising or analytics.

## Regulatory positioning

The intended purpose and marketing claims matter. A wellness/observation positioning should not be treated as a guarantee that the product is outside medical-device rules worldwide.

The United States FDA states that certain low-risk general-wellness software functions may fall outside the device definition when they are intended to encourage a healthy lifestyle and are unrelated to diagnosis, cure, mitigation, prevention or treatment of a disease or condition. FDA also states that software functions are assessed according to their function and intended use, not simply because they are web or mobile apps.

The European Union's MDR software guidance likewise evaluates software according to its intended medical purpose, and the guidance applies to apps regardless of whether they operate on a phone, cloud or another platform.

Therefore:
1. Keep product claims aligned with the actual current functions.
2. Do not advertise the current app as a contraceptive, diagnostic, ovulation-confirmation or treatment product unless the appropriate regulatory pathway has been assessed.
3. Before entering a specific regulated market, obtain a jurisdiction-specific assessment of intended purpose, claims, classification, privacy/data rules, consumer law and any registration/conformity requirements.
4. Reassess whenever a feature changes the intended purpose, especially personalized predictions, medical recommendations, risk alerts, treatment guidance or connected-device control.

## Connected thermometer

Bluetooth compatibility is deliberately presented as conditional.

Before commercial claims about a specific thermometer:
- identify the exact device model and manufacturer;
- verify its Bluetooth service/profile and characteristic behavior;
- test supported browsers and operating systems;
- verify units and precision;
- document connection failure and manual-entry fallback;
- determine whether the combined software/hardware intended purpose creates additional regulatory obligations in the target market.

Do not claim universal compatibility.

## Privacy and data

Current architecture is local-first. This reduces the need for a server-side health-data system but does not remove privacy obligations.

Before adding cloud accounts or synchronization, separately assess:
- controller/processor roles;
- lawful basis and notices;
- health/special-category data requirements where applicable;
- retention and deletion;
- international transfers;
- subprocessors;
- breach response;
- user access/export/erasure mechanisms;
- security controls.

The current export feature creates a JSON file controlled by the user. Marketing should clearly explain that the backup may contain sensitive personal information and must be stored securely.

## Commercial infrastructure still to choose

Before taking payment, choose and validate:
- seller/legal entity;
- country of establishment;
- payment processor and supported seller countries;
- tax/VAT/GST/sales-tax treatment;
- refund/cancellation rules;
- pricing currency and localization;
- customer support contact;
- receipt/invoice requirements;
- terms applicable to digital products;
- age requirements if applicable;
- chargeback handling.

Payment integration should be implemented only after the seller/payment structure is decided.

## Product-page claims to use carefully

Prefer factual descriptions such as:
- “Track your daily cycle observations.”
- “Record basal temperature and other observations.”
- “View your observations in charts, calendar and history.”
- “Learn how to interpret observations with educational modules.”
- “Your data is stored locally by default.”
- “Export and restore your data with a JSON backup.”

Avoid unsupported or overly broad claims such as:
- “guarantees contraception”;
- “100% safe days”;
- “guarantees ovulation detection”;
- “diagnoses hormonal disorders”;
- “prevents pregnancy”;
- “treats infertility”;
- “works with every Bluetooth thermometer”.

## Pre-launch checklist

### Technical
- [x] Automated unit/security checks
- [x] E2E browser tests
- [x] Mobile browser tests
- [x] Accessibility scan
- [x] Lighthouse audit
- [x] OWASP ZAP baseline scan
- [x] PWA manifest/service worker
- [x] Import/export
- [x] Privacy and terms pages
- [x] Four-language interface
- [x] Celsius/Fahrenheit
- [x] Manual Bluetooth fallback
- [x] Public GitHub Pages deployment

### Product
- [x] Local-first positioning
- [x] Non-diagnostic wording
- [x] No automatic contraceptive claim
- [x] No automatic ovulation-confirmation claim
- [x] Backup/restore instructions
- [x] Bluetooth limitations documented
- [ ] Final commercial pricing
- [ ] Customer support workflow
- [ ] Refund/cancellation policy adapted to seller jurisdiction
- [ ] Final product-page copy
- [ ] Payment provider and seller-country eligibility

### Legal/regulatory
- [ ] Seller entity and contracting party
- [ ] Target-country legal review
- [ ] Privacy/data-protection review for target markets
- [ ] Digital-product consumer-law review
- [ ] Tax review
- [ ] Regulatory classification review if medical claims are introduced
- [ ] Specific thermometer/hardware assessment if marketed as a connected medical solution

## Change-control rule

Any future feature involving prediction, contraception, fertility-status determination, medical alerts, diagnosis, treatment, personalized medical recommendations, cloud health records or integration with regulated medical hardware must trigger a new regulatory/privacy/security review before release.
