import { test as base, chromium, type BrowserContext } from '@playwright/test';
import os from 'os';
import path from 'path';

export const test = base.extend<{ context: BrowserContext }>({
  // A launchPersistentContext-based context is NOT auto-traced by the test
  // runner the way the built-in `context`/`page` fixtures are, so we manage
  // tracing manually and attach the result ourselves so it still shows up in
  // the HTML report / UI mode timeline.
  //
  // The teardown MUST run inside finally: if the test throws, `use(context)`
  // rethrows immediately, and without finally the browser process is left
  // running and keeps a lock on this shared userDataDir -- every subsequent
  // run then fights over the same locked profile (reused/oddly sized window,
  // "context has been closed" errors, no trace ever attached).
  context: async ({}, use, testInfo) => {
    const userDataDir = path.join(os.homedir(), 'AppData', 'Local', 'Google', 'Chrome', 'User Data', 'PlaywrightProfile');

    const context = await chromium.launchPersistentContext(userDataDir, {
      channel: 'chrome',
      headless: false,
      // Explicit, safe window bounds. Chrome persists window placement
      // *inside the profile*, so leaving this unset doesn't mean "default"
      // -- it means "whatever was last saved" (e.g. still maximized from a
      // previous run). A modest size also keeps it clear of the taskbar.
      args: [
        '--no-first-run',
        '--no-default-browser-check',
        '--window-position=0,0',
        '--window-size=1280,720',
      ],
    });

    let startedTracing = false;
    try {
      await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
      startedTracing = true;
    } catch {
      // The test runner already traces this context (config `trace: 'on'`).
      // Leave that trace alone: stopping it here makes the runner's own stop
      // during context.close() fail with "Must start tracing before stopping",
      // which masks the test's real error.
    }

    try {
      await use(context);
    } finally {
      if (startedTracing) {
        try {
          const tracePath = testInfo.outputPath('trace.zip');
          await context.tracing.stop({ path: tracePath });
          await testInfo.attach('trace', { path: tracePath, contentType: 'application/zip' });
        } catch {
          // No active trace to stop.
        }
      }

      await context.close();
    }
  },
  page: async ({ context }, use) => {
    const page = context.pages()[0] ?? await context.newPage();
    await use(page);
  },
});

export { expect } from '@playwright/test';
