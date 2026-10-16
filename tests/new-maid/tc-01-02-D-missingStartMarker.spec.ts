import { test } from '../fixtures';
import { buildIncompleteMaid, delay, openGroup, sendPhoto, sendText } from './maidSubmission';

// TC-01-02 D 漏 +++++: 照片(带说明) / full bio / =====
// Expect: the "incomplete" reply with an extra line "Missing: the +++++ start marker.", no CRM Maid.
test('TC-01-02 D missing +++++', async ({ page }) => {
  test.setTimeout(8 * 60000);
  const maid = buildIncompleteMaid();
  await openGroup(page);

  await sendPhoto(page, maid.shortBio);
  await sendText(page, maid.longBio);
  await sendText(page, '=====');

  await delay(5000);
});
