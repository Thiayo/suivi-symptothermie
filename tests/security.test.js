const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const page = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const manifest = fs.readFileSync(path.join(__dirname, '..', 'manifest.webmanifest'), 'utf8');
const serviceWorker = fs.readFileSync(path.join(__dirname, '..', 'sw.js'), 'utf8');

test('user-controlled text is escaped before being inserted into HTML', () => {
  assert.match(page, /function escapeHtml\(value\)\s*\{/);
  assert.match(page, /escapeHtml\(e\.notes\)/);
  assert.match(page, /e\.factors\.map\(f => escapeHtml/);
  assert.match(page, /escapeHtml\(e\.time\)/);
});

test('backup import is versioned, validated and size-limited', () => {
  assert.match(page, /function validBackup\(value\)/);
  assert.match(page, /value\.version!==APP_DATA_VERSION/);
  assert.match(page, /validEntryCollection\(value\.current\)/);
  assert.match(page, /value\.history\.every\(validStoredHistoryCycle\)/);
  assert.match(page, /file\.size>2\*1024\*1024/);
  assert.match(page, /JSON\.parse\(reader\.result\)/);
});

test('stored observations validate dates, temperatures, mucus and time', () => {
  assert.match(page, /function validStoredEntry\(e\)/);
  assert.match(page, /isValidDateKey\(e\.date\)/);
  assert.match(page, /validStoredTemperature\(e\.temp\)/);
  assert.match(page, /VALID_MUCUS\.includes\(e\.mucus\)/);
  assert.match(page, /validStoredTime\(e\.time\)/);
});

test('dangerous script execution primitives are absent', () => {
  assert.doesNotMatch(page, /\beval\s*\(/);
  assert.doesNotMatch(page, /document\.write\s*\(/);
  assert.doesNotMatch(page, /new Function\s*\(/);
});

test('supported languages localize the main observation controls', () => {
  assert.match(page, /Nombre para mostrar \(opcional\)/);
  assert.match(page, /اسم العرض \(اختياري\)/);
  assert.match(page, /const labels=\{/);
  assert.match(page, /Pegajoso/);
  assert.match(page, /لزج/);
  assert.match(page, /document\.querySelectorAll\('#f-bleeding option'\)/);
});
test('saving profile applies language/unit immediately', () => {
  assert.match(page, /memProfile=p;try\{localStorage\.setItem\(PROFILE_KEY,JSON\.stringify\(p\)\)/);
  assert.match(page, /applyLanguage\(\);renderProfile\(\);render\(\);document\.getElementById\('profile-status'\)\?\.focus\(\)/);
});
test('calendar month title follows selected language', () => {
  assert.match(page, /toLocaleDateString\(getLanguage\(\)==='ar'\?'ar':getLanguage\(\)==='es'\?'es':'fr'/);
});

test('temperature validation warning uses the selected display unit', () => {
  assert.match(page, /plage de contrôle \$\{getUnit\(\)==='f'\?'93,2–107,6 °F':'34–42 °C'\}/);
});

test('Bluetooth thermometer readings use the selected display unit', () => {
  assert.match(page, /function handleThermometerMeasurement\(event\)/);
  assert.match(page, /field\.value = celsiusToDisplay\(value\)\.toFixed\(2\)/);
  assert.match(page, /formatTemperature\(value, 2\)/);
});

test('destructive data actions require explicit confirmation', () => {
  assert.match(page, /function clearAllData\(\)/);
  assert.match(page, /function clearAllData\(\)[\s\S]*?if\(!confirm\(/);
});

test('calendar interactions use delegated events instead of inline handlers', () => {
  assert.match(page, /data-calendar-date=/);
  assert.match(page, /event\.target\.closest\('\[data-calendar-date\]'\)/);
  assert.doesNotMatch(page, /onclick="showCalendarDetail/);
  assert.doesNotMatch(page, /onkeydown="if\(event\.key===/);
});


test('all user interactions are wired without inline event attributes', () => {
  assert.doesNotMatch(page, /\bon(?:click|change|keydown|submit|input|focus|blur)=/i);
  assert.match(page, /data-action="open-lesson"/);
  assert.match(page, /data-action="answer-quiz"/);
  assert.match(page, /data-action="complete-lesson"/);
  assert.match(page, /data-action="calendar-prev"/);
  assert.match(page, /data-action="calendar-next"/);
  assert.match(page, /getElementById\('import-data'\)\?\.addEventListener\('change', importData\)/);
  assert.match(page, /action === 'answer-quiz'/);
  assert.match(page, /action === 'complete-lesson'/);
});


test('cycle archiving and full deletion roll back persistent storage on failure', () => {
  assert.match(page, /function startNewCycle\(\)[\s\S]*localStorage\.setItem\(HISTORY_KEY/);
  assert.match(page, /function startNewCycle\(\)[\s\S]*localStorage\.setItem\(CURRENT_KEY/);
  assert.match(page, /function startNewCycle\(\)[\s\S]*rollbackError/);
  assert.match(page, /function clearAllData\(\)[\s\S]*previous\[key\]/);
  assert.match(page, /function clearAllData\(\)[\s\S]*suppression durable n’a pas pu être confirmée/);
});


test('PWA shell is declared and service worker is registered safely', () => {
  assert.match(page, /<link rel="manifest" href="\.\/manifest\.webmanifest">/);
  assert.match(page, /navigator\.serviceWorker\.register\("\.\/sw\.js"\)/);
});


test('PWA files are structurally valid', () => {
  const data = JSON.parse(manifest);
  assert.equal(data.start_url, './');
  assert.equal(data.scope, './');
  assert.equal(data.display, 'standalone');
  assert.match(serviceWorker, /const CACHE_NAME = 'symptothermie-shell-v2'/);
  assert.match(serviceWorker, /self\.addEventListener\('install'/);
  assert.match(serviceWorker, /self\.addEventListener\('fetch'/);
});

test('les leçons et quiz rejettent les identifiants ou choix invalides', () => {
  assert.match(page, /const module = MODULES\.find\(item => item\.id === id\); if \(!module \|\| !module\.quiz/);
  assert.match(page, /Number\.isInteger\(choice\)/);
  assert.match(page, /if \(!MODULES\.some\(module => module\.id === id\)\) return/);
});

test('les notes et facteurs importés restent bornés et validés', () => {
  assert.match(page, /e\.notes\.length<=2000/);
  assert.match(page, /e\.factors\.length<=VALID_FACTORS\.length/);
  assert.match(page, /id="f-notes" maxlength="2000"/);
});


test('stored entry collections reject duplicate dates and excessive history size', () => {
  assert.match(page, /const MAX_ENTRIES_PER_CYCLE = 3700/);
  assert.match(page, /const MAX_HISTORY_CYCLES = 200/);
  assert.match(page, /function validEntryCollection\(entries\)/);
  assert.match(page, /const dates=new Set\(\)/);
  assert.match(page, /dates\.has\(entry\.date\)/);
  assert.match(page, /entries\.length>MAX_ENTRIES_PER_CYCLE/);
  assert.match(page, /value\.history\.length>MAX_HISTORY_CYCLES/);
});
