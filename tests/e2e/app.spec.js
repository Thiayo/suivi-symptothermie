const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

async function resetApp(page) {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();
}

test.describe('professional end-to-end and mobile QA', () => {
  test('boots without JavaScript errors and exposes the six main areas', async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error') errors.push(message.text());
    });

    await resetApp(page);

    for (const hash of ['#accueil', '#graphique', '#calendrier', '#historique', '#apprendre', '#profil']) {
      await page.locator('nav a[href="' + hash + '"]').click();
      await expect(page.locator(hash)).toBeVisible();
    }

    expect(errors).toEqual([]);
  });

  test('records an observation and keeps it after a reload', async ({ page }) => {
    await resetApp(page);

    const date = await page.locator('#f-date').inputValue();
    await page.locator('#f-temp').fill('36.50');
    await page.locator('#f-time').fill('07:00');
    await page.locator('#f-mucus').selectOption('cremeuse');
    await page.locator('#f-bleeding').selectOption('aucun');
    await page.locator('#f-notes').fill('QA observation');
    await page.locator('#save-entry-btn').click();

    await expect(page.locator('#entry-action-status')).toContainText('Observation');
    await expect(page.locator('#today-summary')).toContainText('36.50');
    await page.reload();

    await expect(page.locator('#today-summary')).toContainText('36.50');
    await expect(page.locator('#calendar-grid [data-calendar-date="' + date + '"]')).toBeVisible();
  });

  test('switches to Fahrenheit and saves a valid converted measurement', async ({ page }) => {
    await resetApp(page);

    await page.locator('#profil').scrollIntoViewIfNeeded();
    await page.locator('#profile-unit').selectOption('f');
    await page.locator('#save-profile-btn').click();

    await expect(page.locator('#temp-unit-label')).toHaveText('°F');
    await page.locator('#f-temp').fill('98.60');
    await page.locator('#save-entry-btn').click();

    await expect(page.locator('#entry-action-status')).toContainText('Observation');
    await expect(page.locator('#today-summary')).toContainText('98.6');
  });

  for (const [lang, dir, expected] of [
    ['fr', 'ltr', 'Aujourd’hui'],
    ['en', 'ltr', 'Today'],
    ['es', 'ltr', 'Hoy'],
    ['ar', 'rtl', 'اليوم'],
  ]) {
    test('supports profile language ' + lang, async ({ page }) => {
      await resetApp(page);
      await page.locator('#profil').scrollIntoViewIfNeeded();
      await page.locator('#profile-language').selectOption(lang);
      await page.locator('#save-profile-btn').click();

      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page.locator('html')).toHaveAttribute('dir', dir);
      await expect(page.locator('#today-title')).toContainText(expected);
    });
  }

  test('supports keyboard access to a recorded calendar day', async ({ page }) => {
    await resetApp(page);
    await page.locator('#f-temp').fill('36.50');
    await page.locator('#save-entry-btn').click();

    const day = page.locator('#calendar-grid [data-calendar-date]').first();
    await day.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#calendar-detail')).toBeVisible();
    await expect(page.locator('#calendar-detail')).toContainText('36.5');
  });

  test('learning modules open and the module list toggles', async ({ page }) => {
    await resetApp(page);
    const toggle = page.locator('#toggle-modules');
    const list = page.locator('#module-list');

    await expect(list).toBeHidden();
    await toggle.click();
    await expect(list).toBeVisible();
    await expect(list.locator('[data-action="open-lesson"]').first()).toBeVisible();
    await toggle.click();
    await expect(list).toBeHidden();
  });

  test('backup export creates a JSON download after data exists', async ({ page }) => {
    await resetApp(page);
    await page.locator('#f-temp').fill('36.50');
    await page.locator('#save-entry-btn').click();

    const downloadPromise = page.waitForEvent('download');
    await page.locator('[data-action="export-data"]').click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe('suivi-symptothermie-sauvegarde.json');
  });

  test('critical accessibility issues are absent', async ({ page }) => {
    await resetApp(page);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const critical = results.violations.filter(v => v.impact === 'critical');
    expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);
  });

  test('service worker is available on a secure-compatible origin', async ({ page }) => {
    await resetApp(page);
    const supported = await page.evaluate(() => 'serviceWorker' in navigator);
    expect(supported).toBeTruthy();
    if (supported) {
      await page.evaluate(async () => {
        await navigator.serviceWorker.ready;
      });
    }
  });
});
