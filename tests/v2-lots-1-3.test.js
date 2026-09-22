const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const page = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

test('V2 navigation exposes the six requested areas', () => {
  for (const item of ['Accueil','Graphique','Calendrier','Historique','Apprendre','Profil']) assert.match(page, new RegExp('>' + item + '<'));
});

test('lots 1-3 recovery keeps local cycle and history storage', () => {
  for (const key of ['symptothermie_current_cycle','symptothermie_history','symptothermie_learning_progress']) assert.ok(page.includes(key));
  assert.match(page, /function loadCurrent\(\)/);
  assert.match(page, /function saveCurrent\(entries\)/);
  assert.match(page, /function loadHistory\(\)/);
  assert.match(page, /function saveHistory\(hist\)/);
});

test('calendar is descriptive and uses recorded observations', () => {
  assert.match(page, /id="calendar-grid"/);
  assert.match(page, /function renderCalendar\(\)/);
  assert.match(page, /function changeCalendarMonth\(delta\)/);
  assert.match(page, /Le calendrier affiche uniquement les observations enregistrées/);
});

test('profile and privacy data are versioned and local', () => {
  assert.match(page, /const APP_DATA_VERSION = 2/);
  assert.match(page, /const PROFILE_KEY = 'symptothermie_profile'/);
  assert.match(page, /function loadProfile\(\)/);
  assert.match(page, /function saveProfile\(\)/);
  assert.match(page, /Confidentialité/);
});

test('personal backup export/import is available', () => {
  assert.match(page, /function exportData\(\)/);
  assert.match(page, /function importData\(event\)/);
  assert.match(page, /suivi-symptothermie-sauvegarde\.json/);
  assert.match(page, /Array\.isArray\(p\.current\)/);
});

test('non-diagnostic protections from the learning lots remain present', () => {
  assert.match(page, /ne posent pas de diagnostic/);
  assert.match(page, /ne fournit pas de « jours sûrs »/);
  assert.match(page, /n’est pas, à elle seule, une preuve automatique d’ovulation/);
  assert.doesNotMatch(page, /detectLatePeriod/);
  assert.doesNotMatch(page, /renderLatePeriodBanner/);
});


test('observation context factors are stored and restored', () => {
  assert.match(page, /class="factor"/);
  assert.match(page, /value="maladie"/);
  assert.match(page, /value="sommeil"/);
  assert.match(page, /value="horaire"/);
  assert.match(page, /value="voyage"/);
  assert.match(page, /value="alcool"/);
  assert.match(page, /value="medicament"/);
  assert.match(page, /const factors = \[\.\.\.document\.querySelectorAll\('\.factor:checked'\)\]/);
  assert.match(page, /factors\);/);
});


test('les données affichées dans le contexte utilisateur sont échappées', () => {
  assert.match(page, /escapeHtml\(value\)/);
  assert.match(page, /factorLabels\[f\] \|\| f\)\.join/);
  assert.match(page, /escapeHtml\(e\.notes\)/);
  assert.match(page, /escapeHtml\(e\.time\)/);
  assert.match(page, /aria-live="polite"/);
});

test('journal displays recorded observation context', () => {
  assert.match(page, /factorLabels =/);
  assert.match(page, /Contexte :/);
  assert.match(page, /Notes \/ contexte/);
});


test('history provides descriptive cycle summaries', () => {
  assert.match(page, /function renderHistory\(\)/);
  assert.match(page, /température\(s\)/);
  assert.match(page, /période couverte/);
  assert.match(page, /Contexte renseigné sur/);
  assert.match(page, /aria-label="Supprimer ce cycle archivé"/);
});


test('backup import is versioned and validates entry structure', () => {
  assert.match(page, /function validBackup\\(value\\)/);
  assert.match(page, /value\\.version !== APP_DATA_VERSION/);
  assert.match(page, /validEntry = e =>/);
  assert.match(page, /Sauvegarde importée avec succès/);
});


test('thermal chart wording stays descriptive', () => {
  assert.match(page, /function detectThermalReference\(entries\)/);
  assert.match(page, /id="thermal-badge"/);
  assert.match(page, /Repère thermique descriptif/);
  assert.doesNotMatch(page, /badge-ovu/);
  assert.doesNotMatch(page, /id="ovu-badge"/);
});
