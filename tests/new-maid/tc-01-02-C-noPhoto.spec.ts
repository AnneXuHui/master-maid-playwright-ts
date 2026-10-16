import { test } from '../fixtures';
import { buildIncompleteMaid, delay, openGroup, sendText } from './maidSubmission';

// TC-01-02 C 无照片: +++++ / short bio / full bio / =====
// Expect: "Oops! 😅 This profile is incomplete...", no CRM Maid.
test('TC-01-02 C no photo', async ({ page }) => {
  test.setTimeout(8 * 60000);
  const maid = buildIncompleteMaid();
  await openGroup(page);

  await sendText(page, '+++++');
  await sendText(page, maid.shortBio);
  await sendText(page, maid.longBio);
  await sendText(page, '=====');

  await delay(5000);
});
