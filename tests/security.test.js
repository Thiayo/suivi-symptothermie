const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const page = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

test('user-controlled text is escaped before being inserted into HTML', () => {
  assert.match(page, /function escapeHtml\(value\)\s*\{/);
  assert.match(page, /escapeHtml\(e\.notes\)/);
  assert.match(page, /escapeHtml\(e\.factors/);
  assert.match(page, /escapeHtml\(e\.time/);
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
