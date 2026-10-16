import { test } from '../fixtures';
import { buildIncompleteMaid, delay, openGroup, sendPhoto, sendText } from './maidSubmission';

// TC-01-02 B 两段文字相同: +++++ / 照片(无说明) / 文字 X / 文字 X / =====
// Expect: "Oops! 😅 This profile is incomplete..." (two different texts needed), no CRM Maid.
test('TC-01-02 B two identical texts', async ({ page }) => {
  test.setTimeout(8 * 60000);
  const maid = buildIncompleteMaid();
  await openGroup(page);

  await sendText(page, '+++++');
  await sendPhoto(page);
  await sendText(page, maid.longBio);
  await sendText(page, maid.longBio);
  await sendText(page, '=====');

  await delay(5000);
});
