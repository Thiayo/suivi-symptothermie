const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const page = fs.readFileSync(require('node:path').join(__dirname, '..', 'index.html'), 'utf8');

test('the eight requested learning modules are available', () => {
  for (const title of [
    'Comprendre le cycle', 'Comprendre la fertilité', 'Observer la glaire cervicale',
    'Prendre sa température', 'Lire son graphique', 'Comprendre le décalage thermique',
    'Situations particulières', 'Pratique'
  ]) assert.match(page, new RegExp(`title:'${title}'`));
});

test('learning progress uses a versioned and validated local model', () => {
  assert.match(page, /const LEARNING_VERSION = 1/);
  assert.match(page, /function validLearning\(value\)/);
  assert.match(page, /localStorage\.getItem\(LEARNING_KEY\)/);
  assert.match(page, /localStorage\.setItem\(LEARNING_KEY/);
});

test('completion, resuming and resetting are implemented', () => {
  assert.match(page, /function completeLesson\(id\)/);
  assert.match(page, /progress\.lastModule = id/);
  assert.match(page, /function resetLearning\(\)/);
  assert.match(page, /resume-learning/);
});

test('each module has a quiz with an explanatory result announced to assistive technology', () => {
  const quizzes = page.match(/quiz:\{q:/g) || [];
  assert.equal(quizzes.length, 8);
  assert.match(page, /function answerQuiz\(id, choice\)/);
  assert.match(page, /quiz-result[^>]*aria-live="polite"/);
  assert.match(page, /\$\{quiz\.explain\}/);
});


test('modules 6 to 8 keep the requested non-diagnostic educational scope', () => {
  assert.match(page, /Le principe général d’une hausse durable/);
  assert.match(page, /n’est pas, à elle seule, une preuve automatique d’ovulation/);
  for (const item of ['maladie','fièvre','sommeil perturbé','voyage','alcool','médicaments','postpartum','allaitement','périménopause']) assert.match(page, new RegExp(item));
  for (const item of ['Exercice 1 — Glaire','Exercice 2 — Température perturbée','Exercice 3 — Graphique','Exercice 4 — Observation ou interprétation','Exercice 5 — Donnée manquante']) assert.match(page, new RegExp(item));
  assert.match(page, /Sources et limites/);
});

test('contextual learning links are available from observations and graph', () => {
  assert.match(page, /openLesson\('m4'\)/);
  assert.match(page, /openLesson\('m3'\)/);
  assert.match(page, /openLesson\('m5'\)/);
  assert.match(page, /openLesson\('m6'\)/);
});

test('the learning module list starts collapsed and the toggle can actually hide it', () => {
  assert.match(page, /id="toggle-modules"[^>]*aria-expanded="false"[^>]*aria-controls="module-list"/);
  assert.match(page, /id="module-list"[^>]*hidden/);
  assert.match(page, /\.module-list\[hidden\]\s*\{\s*display:none\s*!important;/);
  assert.match(page, /const expanded = list\.hidden;/);
  assert.match(page, /list\.hidden = !expanded;/);
  assert.match(page, /button\.setAttribute\('aria-expanded', String\(expanded\)\)/);
});
