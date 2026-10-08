import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { lessons } from '../../src/content';
import { makeQuestion, STORAGE_KEY, type Progress } from '../../src/model';

async function progress(page: Page): Promise<Progress> { return page.evaluate(key => JSON.parse(localStorage.getItem(key)!), STORAGE_KEY); }
async function chooseLesson(page: Page, lessonId: string) {
  const lesson = lessons.find(l => l.id === lessonId)!;
  await page.goto('/');
  await page.locator('.sidebar').getByRole('button', { name: 'Yollar', exact: true }).click();
  await page.locator('.full-path').nth(['mix', 'music', 'exam'].indexOf(lesson.path)).getByRole('button', { name: 'Yolu keşfet' }).click();
  await page.locator('.lesson-row').nth(lesson.level - 1).getByRole('button', { name: 'Pratiğe başla' }).click();
  await expect(page.getByRole('heading', { name: lesson.title.tr, exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Hazırım, dinleyelim' }).click();
}
async function listen(page: Page) {
  const p = await progress(page), lesson = lessons.find(l => l.id === p.session!.lessonId)!;
  const player = page.locator('.exercise .audio-player');
  if (lesson.path === 'mix' || lesson.path === 'exam') {
    await player.locator('.ab-button').nth(0).click();
    if (lesson.path === 'exam') await expect(player.getByRole('button', { name: 'Dinle', exact: true })).toBeVisible();
    await player.locator('.ab-button').nth(1).click();
  } else await player.getByRole('button', { name: 'Dinle', exact: true }).click();
  await expect(page.locator('.answer-option').first()).toBeEnabled({ timeout: 10_000 });
}

test('completes a five-question EQ practice and resumes without double scoring', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Pratiğe başla', exact: true }).click();
  await expect(page.getByText('Önce örnek dinle', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Hazırım, dinleyelim' }).click();
  for (let i = 0; i < 5; i++) {
    await expect(page.locator('.answer-option').first()).toBeDisabled();
    await listen(page);
    const p = await progress(page), s = p.session!;
    const q = makeQuestion(s.lessonId, s.seed, s.index);
    await page.getByTestId(`answer-${q.correct}`).click();
    await expect(page.getByText('Evet, duydun.', { exact: true })).toBeVisible();
    if (i === 0) {
      await page.reload();
      await expect(page.getByText('Evet, duydun.', { exact: true })).toBeVisible();
      expect((await progress(page)).attempts).toHaveLength(1);
    }
    await page.getByRole('button', { name: i === 4 ? 'Pratiği bitir' : 'Sonraki soru', exact: true }).click();
  }
  await expect(page.getByRole('heading', { name: 'Bugün kulağına zaman ayırdın.' })).toBeVisible();
  const p = await progress(page);
  expect(p.session).toBeNull(); expect(p.results).toHaveLength(1); expect(p.attempts).toHaveLength(5);
  expect(p.results[0].correct).toBe(5);
});

for (const lesson of lessons) {
  test(`${lesson.id}: real audio, incorrect feedback and safe replay`, async ({ page }) => {
    await chooseLesson(page, lesson.id);
    await listen(page);
    const p = await progress(page), s = p.session!;
    const q = makeQuestion(s.lessonId, s.seed, 0);
    const wrong = q.options.find(o => o.id !== q.correct)!;
    await page.getByTestId(`answer-${wrong.id}`).click();
    await expect(page.getByText('Birlikte tekrar dinleyelim.', { exact: true })).toBeVisible();
    await expect(page.getByTestId(`answer-${q.correct}`)).toHaveClass(/is-correct/);
    expect((await progress(page)).attempts[0].correct).toBe(false);
    await page.locator('.exercise .audio-player').getByRole('button', { name: 'Dinle', exact: true }).click();
    await expect(page.locator('.exercise .audio-player')).toHaveClass(/is-playing/);
    expect((await progress(page)).attempts).toHaveLength(1);
  });
}

test('actual EQ buffers are level matched, unclipped and start at the same audio-clock time', async ({ page }) => {
  await page.addInitScript(() => {
    const evidence: { when: number; rms: number; peak: number; loop: boolean }[] = [];
    (window as unknown as { audioEvidence: typeof evidence }).audioEvidence = evidence;
    const original = AudioBufferSourceNode.prototype.start;
    AudioBufferSourceNode.prototype.start = function(when = 0, offset = 0, duration?: number) {
      if (this.buffer) {
        const data = this.buffer.getChannelData(0);
        let squares = 0, peak = 0;
        for (const value of data) { squares += value * value; peak = Math.max(peak, Math.abs(value)); }
        evidence.push({ when, rms: Math.sqrt(squares / data.length), peak, loop: this.loop });
      }
      if (duration === undefined) return original.call(this, when, offset);
      return original.call(this, when, offset, duration);
    };
  });
  await chooseLesson(page, 'eq-3');
  await listen(page);
  const evidence = await page.evaluate(() => (window as unknown as { audioEvidence: { when: number; rms: number; peak: number; loop: boolean }[] }).audioEvidence.filter(x => x.loop).slice(-2));
  expect(evidence).toHaveLength(2);
  expect(evidence[0].rms).toBeGreaterThan(0.01);
  expect(Math.abs(20 * Math.log10(evidence[0].rms / evidence[1].rms))).toBeLessThan(0.001);
  expect(evidence[0].when).toBe(evidence[1].when);
  expect(Math.max(...evidence.map(e => e.peak))).toBeLessThanOrEqual(0.720001);
});

test('language switch preserves the active question and records', async ({ page }) => {
  await chooseLesson(page, 'interval-2');
  const before = (await progress(page)).session;
  await page.locator('.topbar').getByRole('button', { name: 'EN', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'What is the interval between the notes?' })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  expect((await progress(page)).session).toEqual(before);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'What is the interval between the notes?' })).toBeVisible();
});

test('storage denial still permits practice and gives clear feedback', async ({ page }) => {
  await page.addInitScript(() => { Storage.prototype.setItem = () => { throw new DOMException('blocked', 'QuotaExceededError'); }; });
  await page.goto('/');
  await expect(page.getByText(/Tarayıcı kayıt yapamıyor/)).toBeVisible();
  await page.getByRole('button', { name: 'Pratiğe başla', exact: true }).click();
  await page.getByRole('button', { name: 'Hazırım, dinleyelim' }).click();
  await page.locator('.ab-button').nth(0).click(); await page.locator('.ab-button').nth(1).click();
  await expect(page.locator('.answer-option').first()).toBeEnabled();
  await page.locator('.answer-option').first().click();
  await expect(page.locator('.feedback')).toBeVisible();
});

test('malformed saved data recovers to a usable app', async ({ page }) => {
  await page.addInitScript(key => localStorage.setItem(key, '{"version":1,"locale":"en","session":{"lessonId":"nope"},"attempts":[null]}'), STORAGE_KEY);
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'A better mix starts with better listening.' })).toBeVisible();
  await page.getByRole('button', { name: 'Start practice', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Frequency regions', exact: true })).toBeVisible();
});

test('production app and audio work offline', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
  await context.setOffline(true);
  await page.reload();
  await page.getByRole('button', { name: 'Pratiğe başla', exact: true }).click();
  await page.getByRole('button', { name: 'Hazırım, dinleyelim' }).click();
  await listen(page);
  await expect(page.locator('.audio-player')).toHaveClass(/is-playing/);
  await context.setOffline(false);
});

test('keyboard answers and mobile layout remain usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('.mobile-nav')).toBeVisible();
  await page.screenshot({ path: 'test-results/previews/home-mobile.png', fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Pratiğe başla', exact: true }).click();
  await page.getByRole('button', { name: 'Hazırım, dinleyelim' }).click();
  await page.locator('main').focus(); await page.keyboard.press('a'); await page.keyboard.press('b');
  await expect(page.locator('.answer-option').first()).toBeEnabled();
  await page.locator('main').focus(); await page.keyboard.press('1');
  await expect(page.locator('.feedback')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/previews/practice-mobile.png', fullPage: true });
});

test('desktop home renders without errors', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 1080 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'İyi bir miks, iyi bir dinlemeyle başlar.' })).toBeVisible();
  await page.screenshot({ path: 'test-results/previews/home-desktop.png', fullPage: true });
  expect(errors).toEqual([]);
});

test('subdirectory build installs and works offline', async ({ page, context }) => {
  await page.goto('/freq/');
  await expect(page.getByRole('heading', { name: 'İyi bir miks, iyi bir dinlemeyle başlar.' })).toBeVisible();
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await expect.poll(() => page.evaluate(() => navigator.serviceWorker.controller?.scriptURL.endsWith('/freq/sw.js'))).toBe(true);
  await context.setOffline(true);
  await page.reload();
  await page.getByRole('button', { name: 'Pratiğe başla', exact: true }).click();
  await page.getByRole('button', { name: 'Hazırım, dinleyelim' }).click();
  await listen(page);
  await expect(page.locator('.audio-player')).toHaveClass(/is-playing/);
});

test('core screens pass automated accessibility checks', async ({ page }) => {
  const audit = async () => {
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
  };
  await page.goto('/'); await audit();
  await page.getByRole('button', { name: 'Pratiğe başla', exact: true }).click(); await audit();
  await page.getByRole('button', { name: 'Hazırım, dinleyelim' }).click(); await audit();
  await listen(page); await page.locator('.answer-option').first().click(); await audit();
  await page.locator('.sidebar').getByRole('button', { name: 'Profil', exact: true }).click(); await audit();
});
