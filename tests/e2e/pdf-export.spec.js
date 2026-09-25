const { test, expect } = require('@playwright/test');

const SAMPLE_ENTRIES = [
  { date: '2026-09-20', temp: 36.42, mucus: 'sec', bleeding: 'regles', notes: 'Test export PDF', factors: [], time: '06:30' },
  { date: '2026-09-21', temp: 36.48, mucus: 'collante', bleeding: 'aucun', notes: '', factors: [], time: '06:31' },
  { date: '2026-09-22', temp: 36.57, mucus: 'cremeuse', bleeding: 'aucun', notes: '', factors: [], time: '06:32' },
  { date: '2026-09-23', temp: 36.61, mucus: 'blanc-oeuf', bleeding: 'aucun', notes: '', factors: [], time: '06:33' }
];

async function seedCycle(page) {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();
  await page.evaluate((entries) => {
    window.saveCurrent(entries);
    window.render();
    window.renderChart(window.loadCurrent());
    console.log('DIRECT_CHART', JSON.stringify({chart: document.getElementById('chart-container')?.innerHTML.slice(0,120), badge: Boolean(document.getElementById('thermal-badge'))}));
  }, SAMPLE_ENTRIES);
}

test.describe('SymRella — graphique et export PDF', () => {
  test('affiche le graphique et prépare une vue d’impression propre', async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(String(error)));
    page.on('console', message => { if (message.text().includes('DIRECT_CHART')) console.log('BROWSER', message.text()); });

    await seedCycle(page);

    await page.locator('nav a[href="#graphique"]').click();
    await expect(page.locator('#graphique')).toBeVisible();
    await expect(page.locator('#chart-container svg')).toHaveCount(1);
    await expect(page.locator('#table-container table')).toHaveCount(1);

    await page.evaluate(() => {
      window.print = () => {
        document.documentElement.dataset.printCalled = 'true';
      };
    });

    await page.locator('[data-action="export-pdf"]').click();

    await expect.poll(() => page.locator('#print-sheet').textContent()).toContain('Suivi Symptothermie');
    await expect(page.locator('#print-sheet svg')).toHaveCount(1);
    await expect(page.locator('#print-sheet table')).toHaveCount(1);
    await expect.poll(() => page.evaluate(() => document.documentElement.dataset.printCalled)).toBe('true');

    const printText = await page.locator('#print-sheet').innerText();
    expect(printText).not.toContain('Politique de confidentialité');
    expect(printText).not.toContain('Conditions d’utilisation');
    expect(pageErrors).toEqual([]);
  });

  test('génère réellement un PDF non vide avec le CSS print (Chromium)', async ({ page, browserName }, testInfo) => {
    test.skip(browserName !== 'chromium', 'page.pdf() est vérifié sur Chromium ; les autres navigateurs couvrent la vue print.');

    await seedCycle(page);
    await expect(page.locator('#chart-container svg')).toHaveCount(1);
    await page.evaluate(() => window.preparePrintView());

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true
    });

    expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    expect(pdf.length).toBeGreaterThan(5000);

    await testInfo.attach('symrella-export.pdf', {
      body: pdf,
      contentType: 'application/pdf'
    });
  });
});
