import { test } from '../fixtures';
import { buildTestMaid, delay, openGroup, sendPhoto, sendText } from './maidSubmission';

// TC-01-03 C 连发 =====: complete profile, then a second ===== within 2 seconds of the first.
// Expect: only one CRM Maid; the 2nd ===== gets
// "Your submission is already being processed. 🙏 Please wait a moment — no need to resend +++++."
// QA checks the bot replies / CRM by hand, then deletes the test maid.
test('TC-01-03 C ===== sent twice within 2 seconds', async ({ page }) => {
  test.setTimeout(8 * 60000);
  const maid = buildTestMaid('Test Concurrent');
  await openGroup(page);

  await sendText(page, '+++++');
  await sendPhoto(page, maid.shortBio);
  await sendText(page, maid.longBio);

  // Two ===== back to back (~1 second apart).
  await sendText(page, '=====', 500);
  await sendText(page, '=====', 500);

  await delay(5000);
});
