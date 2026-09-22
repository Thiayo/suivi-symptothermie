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
