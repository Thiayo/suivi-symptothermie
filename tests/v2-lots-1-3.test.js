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


test('les libellés du suivi restent descriptifs', () => {
  assert.match(page, /saignement menstruel observé/);
  assert.match(page, /plusieurs jours d’observations sont consignés/);
  assert.doesNotMatch(page, /flux menstruel normal/);
});

test('le repère thermique reste présenté comme un repère visuel', () => {
  assert.match(page, /referenceLine/);
  assert.match(page, /Repère visuel des températures/);
  assert.match(page, /pas un détecteur d'ovulation/);
  assert.doesNotMatch(page, /coverline/);
});

test('thermal chart wording stays descriptive', () => {
  assert.match(page, /function detectThermalReference\(entries\)/);
  assert.match(page, /id="thermal-badge"/);
  assert.match(page, /Repère thermique descriptif/);
  assert.doesNotMatch(page, /badge-ovu/);
  assert.doesNotMatch(page, /id="ovu-badge"/);
});


test('les zones principales du suivi sont accessibles', () => {
  assert.match(page, /id="chart-container"[^>]*role="img"/);
  assert.match(page, /id="today-summary"[^>]*role="region"/);
  assert.match(page, /id="calendar-detail"[^>]*tabindex="-1"/);
  assert.match(page, /detail\.focus\(\)/);
});


test('la validation des sauvegardes contrôle les valeurs des observations', () => {
  assert.match(page, /const validMucus = \['sec','collante','cremeuse','blanc-oeuf'\]/);
  assert.match(page, /const validBleeding = \['aucun','regles','spotting'\]/);
  assert.match(page, /validTime = value => value === null/);
  assert.match(page, /validMucus\.includes\(e\.mucus\)/);
  assert.match(page, /validBleeding\.includes\(e\.bleeding\)/);
  assert.match(page, /validTime\(e\.time\)/);
});


test('le graphique utilise la bonne ligne de référence et un résumé textuel', () => {
  assert.match(page, /yFor\(shift\.referenceLine\)/);
  assert.doesNotMatch(page, /yFor\(shift\.coverline\)/);
  assert.match(page, /id="chart-text-summary"/);
  assert.match(page, /aria-hidden="true"/);
  assert.match(page, /Résumé textuel/);
});


test('les champs du formulaire disposent d’une aide accessible', () => {
  assert.match(page, /id="f-temp"[^>]*aria-describedby="temp-help"/);
  assert.match(page, /id="temp-help"/);
  assert.match(page, /id="f-notes"[^>]*aria-describedby="notes-help"/);
  assert.match(page, /id="notes-help"/);
});


test('les suppressions demandent une confirmation et restent accessibles', () => {
  assert.match(page, /Supprimer l’observation du/);
  assert.match(page, /Supprimer définitivement le cycle du/);
  assert.match(page, /aria-label="Supprimer l’observation du/);
});


test('les heures de mesure sauvegardées utilisent un format horaire valide', () => {
  assert.match(page, /\(\?:\[01\]\\\\d\|2\[0-3\]\):\[0-5\]\\\\d/);
});


test('les champs heure et glaire disposent d’une aide accessible', () => {
  assert.match(page, /id="f-time"[^>]*aria-describedby="time-help"/);
  assert.match(page, /id="time-help"/);
  assert.match(page, /id="f-mucus"[^>]*aria-describedby="mucus-help"/);
  assert.match(page, /id="mucus-help"/);
});


test('les champs saignement et contexte disposent de repères accessibles', () => {
  assert.match(page, /id="f-bleeding"[^>]*aria-describedby="bleeding-help"/);
  assert.match(page, /id="bleeding-help"/);
  assert.match(page, /role="group" aria-labelledby="factors-label"/);
  assert.match(page, /id="factors-label"/);
});


test('le mode édition fournit une annonce accessible', () => {
  assert.match(page, /id="edit-status"[^>]*role="status"[^>]*aria-live="polite"/);
  assert.match(page, /function announceEditStatus\(message\)/);
  assert.match(page, /Modification de l’observation du/);
});


test('les dates des sauvegardes sont validées comme de vraies dates', () => {
  assert.match(page, /function isValidDateKey\(value\)/);
  assert.match(page, /localDateKey\(d\) === value/);
  assert.match(page, /isValidDateKey\(e\.date\)/);
});


test('les températures des sauvegardes restent dans une plage corporelle cohérente', () => {
  assert.match(page, /const validTemp = value =>/);
  assert.match(page, /value >= 34 && value <= 42/);
  assert.match(page, /validTemp\(e\.temp\)/);
});


test('les facteurs de contexte des sauvegardes utilisent les valeurs prévues', () => {
  assert.match(page, /\['maladie','sommeil','horaire','voyage','alcool','medicament'\]\.includes\(f\)/);
});


test('le profil des sauvegardes utilise des valeurs cohérentes', () => {
  assert.match(page, /const validProfile =/);
  assert.match(page, /\['observer','apprendre','suivi'\]\.includes\(value\.profile\.goal\)/);
});


test('les sauvegardes vérifient la date d’export', () => {
  assert.match(page, /typeof value\.exportedAt !== 'string'/);
  assert.match(page, /Date\.parse\(value\.exportedAt\)/);
});


test('la validation du profil correspond aux objectifs réellement proposés', () => {
  assert.match(page, /\['observer','apprendre','suivi'\]\.includes\(value\.profile\.goal\)/);
  assert.match(page, /value="suivi">Préparer un suivi/);
});


test('les opérations de sauvegarde disposent d’un statut accessible', () => {
  assert.match(page, /id="backup-status"[^>]*role="status"[^>]*aria-live="polite"/);
  assert.match(page, /Sauvegarde exportée/);
  assert.match(page, /Sauvegarde importée avec succès/);
});


test('l’enregistrement du profil dispose d’un statut accessible', () => {
  assert.match(page, /id="profile-status"[^>]*role="status"[^>]*aria-live="polite"/);
  assert.match(page, /function setProfileStatus\(message\)/);
  assert.match(page, /Profil enregistré/);
  assert.match(page, /Le profil n’a pas pu être enregistré/);
});


test('la validation du profil limite le nom importé à 80 caractères', () => {
  assert.match(page, /value\.profile\.name\.length <= 80/);
});


test('le statut de sauvegarde est focalisable après un import', () => {
  assert.match(page, /id="backup-status"[^>]*role="status"[^>]*aria-live="polite"[^>]*tabindex="-1"/);
  assert.match(page, /setBackupStatus\('Sauvegarde importée avec succès\.'\);const status=document\.getElementById\('backup-status'\);if\(status\)status\.focus\(\)/);
  assert.match(page, /La sauvegarde n’a pas été importée/);
});


test('la version du profil importé reste cohérente avec la version de l’application', () => {
  assert.match(page, /value\.profile\.version === undefined \|\| value\.profile\.version === APP_DATA_VERSION/);
});


test('les cycles archivés disposent d’un titre accessible', () => {
  assert.match(page, /<article class="history-item" aria-labelledby="history-cycle-\$\{i\}">/);
  assert.match(page, /<h3 id="history-cycle-\$\{i\}">Cycle du/);
});


test('les actions courantes disposent d’un statut accessible', () => {
  assert.match(page, /id="action-status"[^>]*role="status"[^>]*aria-live="polite"/);
  assert.match(page, /setActionStatus\('Merci de choisir une date\.'/);
  assert.doesNotMatch(page, /alert\('Merci de choisir une date\.'/);
  assert.doesNotMatch(page, /alert\('Le cycle en cours est déjà vide\.'/);
  assert.doesNotMatch(page, /alert\('Toutes les données locales ont été effacées\.'/);
});


test('l’export vérifie la présence d’une observation et nettoie le lien de téléchargement', () => {
  assert.match(page, /const current=loadCurrent\(\);if\(!current\.length\)/);
  assert.match(page, /document\.body\.appendChild\(a\);a\.click\(\);a\.remove\(\)/);
  assert.match(page, /setBackupStatus\('Sauvegarde exportée\.'/);
});


test('l’enregistrement du profil valide le nom et l’objectif', () => {
  assert.match(page, /name\.length>80/);
  assert.match(page, /\['observer','apprendre','suivi'\]\.includes\(goal\)/);
  assert.match(page, /Nom d’affichage ne peut pas dépasser 80 caractères/);
  assert.match(page, /Objectif de profil invalide/);
});


test('les erreurs de stockage local disposent d’un retour accessible', () => {
  assert.match(page, /id="storage-status"[^>]*role="status"[^>]*aria-live="polite"/);
  assert.match(page, /setStorageStatus\(message\)/);
  assert.match(page, /n’ont pas pu être enregistrées durablement/);
});


test('le chargement du stockage local vérifie les structures de base', () => {
  assert.match(page, /const parsed = raw \? JSON\.parse\(raw\) : \[\];/);
  assert.match(page, /if \(!Array\.isArray\(parsed\)\) throw new Error\('format'\)/);
  assert.match(page, /Une nouvelle saisie peut être enregistrée dans cette session/);
  assert.match(page, /utilise-la pour récupérer tes données/);
});
