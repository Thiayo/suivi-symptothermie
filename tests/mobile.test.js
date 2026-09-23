const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const page = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'manifest.webmanifest'), 'utf8'));

test('mobile viewport and responsive layout are present', () => {
  assert.match(page, /<meta name="viewport" content="width=device-width, initial-scale=1\.0">/);
  assert.match(page, /@media \(min-width:620px\)/);
  assert.match(page, /@media \(min-width: 620px\)/);
  assert.match(page, /\.form-grid\s*\{[\s\S]*?minmax\(140px, 1fr\)/);
});

test('mobile touch controls have usable base sizing', () => {
  assert.match(page, /\.btn\s*\{[\s\S]*?padding:\s*10px\s+18px/);
  assert.match(page, /\.calendar-head,\.calendar-day\{min-height:42px/);
  assert.match(page, /\.quiz button \{[\s\S]*?width:100%/);
});

test('horizontal content remains usable on narrow screens', () => {
  assert.match(page, /\.table-scroll\s*\{\s*overflow-x:\s*auto/);
  assert.match(page, /overflow-x:\s*auto/);
});

test('mobile form controls expose appropriate input modes and accessible labels', () => {
  assert.match(page, /id="f-temp"[^>]*inputmode="decimal"/);
  assert.match(page, /<label for="f-date">/);
  assert.match(page, /<label for="f-temp">/);
  assert.match(page, /<label for="f-time">/);
  assert.match(page, /<label for="f-bleeding">/);
  assert.match(page, /<label for="f-mucus">/);
});

test('calendar entries are keyboard accessible on mobile and desktop', () => {
  assert.match(page, /role="button" tabindex="0" aria-label="/);
  assert.match(page, /document\.addEventListener\('keydown', \(event\) =>/);
  assert.match(page, /event\.key !== 'Enter' && event\.key !== ' '/);
});

test('PWA mobile metadata is configured', () => {
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.start_url, './');
  assert.equal(manifest.scope, './');
  assert.ok(Array.isArray(manifest.icons) && manifest.icons.length > 0);
  assert.match(page, /apple-mobile-web-app-capable/);
});

test('mobile language and direction are applied from the selected profile', () => {
  assert.match(page, /root\.lang=lang/);
  assert.match(page, /root\.dir=lang==='ar'\?'rtl':'ltr'/);
  assert.match(page, /function detectBrowserLanguage\(\)/);
});

test('mobile temperature workflow supports Celsius, Fahrenheit and Bluetooth fallback', () => {
  assert.match(page, /function displayToCelsius\(value\)/);
  assert.match(page, /function celsiusToDisplay\(value\)/);
  assert.match(page, /function connectThermometer\(\)/);
  assert.match(page, /const THERMOMETER_SERVICE_UUID = 0x1809/);
  assert.match(page, /id="f-temp"/);
});

test('critical mobile actions use buttons with explicit button type', () => {
  const buttonTags = [...page.matchAll(/<button\b[^>]*>/gi)].map(m => m[0]);
  assert.ok(buttonTags.length > 20);
  for (const tag of buttonTags) assert.match(tag, /\btype="button"/);
});

test('wide chart content is contained in a horizontal scrolling region', () => {
  assert.match(page, /\.chart-wrap\s*\{\s*overflow-x:\s*auto/);
  assert.match(page, /\.table-scroll\s*\{\s*overflow-x:\s*auto/);
});


test('English is an explicit supported language with automatic detection and UI translations', () => {
  assert.match(page, /<option value="en">English<\\/option>/);
  assert.match(page, /code==='fr'\\|\\|code==='en'\\|\\|code==='es'\\|\\|code==='ar'/);
  assert.match(page, /\\['fr','en','es','ar'\\]\\.includes\(v\)/);
  assert.match(page, /en:\{title:'🌡️ Symptothermal Tracking'/);
  assert.match(page, /en:\{saved:'✓ Saved'/);
  assert.match(page, /en:\{saved:'✓ Observation saved/);
  assert.match(page, /MODULE_TRANSLATIONS=\\{\\nen:\[/);
  assert.match(page, /lang==='en'\?'en-US'/);
});
