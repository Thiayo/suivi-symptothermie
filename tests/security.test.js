const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const page = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

test('user-controlled text is escaped before being inserted into HTML', () => {
  assert.match(page, /function escapeHtml\(value\)\s*\{/);
  assert.match(page, /escapeHtml\(e\.notes\)/);
  assert.match(page, /e\.factors\.map\(f => escapeHtml/);
  assert.match(page, /escapeHtml\(e\.time\)/);
});

test('backup import is versioned, validated and size-limited', () => {
  assert.match(page, /function validBackup\(value\)/);
  assert.match(page, /value\.version!==APP_DATA_VERSION/);
  assert.match(page, /value\.current\.every\(validStoredEntry\)/);
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

test('destructive data actions require explicit confirmation', () => {
  assert.match(page, /function clearAllData\(\)/);
  assert.match(page, /function clearAllData\(\)\{if\(\s*!?confirm\(/);
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
