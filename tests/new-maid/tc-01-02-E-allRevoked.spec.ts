import { test } from '../fixtures';
import { buildIncompleteMaid, delay, openGroup, revokeLastMessage, sendPhoto, sendText } from './maidSubmission';

// TC-01-02 E 全部撤回: +++++ / 照片 / short bio / full bio（三条都撤回）/ =====
// Expect: "Oops! 😅 This profile is incomplete..." (revoked shells ignored), no CRM Maid.
test('TC-01-02 E all content revoked', async ({ page }) => {
  test.setTimeout(10 * 60000);
  const maid = buildIncompleteMaid();
  await openGroup(page);

  await sendText(page, '+++++');

  await sendPhoto(page);
  await revokeLastMessage(page);

  await sendText(page, maid.shortBio);
  await revokeLastMessage(page);

  await sendText(page, maid.longBio);
  await revokeLastMessage(page);

  await sendText(page, '=====');

  await delay(5000);
});
