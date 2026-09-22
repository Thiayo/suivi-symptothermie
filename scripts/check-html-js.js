const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('index.html', 'utf8');
const scripts = [];
const re = /<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi;
for (const match of html.matchAll(re)) {
  if (match[1].trim()) scripts.push(match[1]);
}

if (scripts.length === 0) {
  throw new Error('Aucun bloc JavaScript inline trouvé dans index.html');
}

scripts.forEach((code, index) => {
  new vm.Script(code, { filename: `index.html — script ${index + 1}` });
});

console.log(`OK : ${scripts.length} bloc(s) JavaScript vérifié(s).`);
