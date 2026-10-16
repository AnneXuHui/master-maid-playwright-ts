import { test } from '../fixtures';
import { buildIncompleteMaid, delay, openGroup, revokeLastMessage, sendPhoto, sendText } from './maidSubmission';

// TC-01-02 F 部分撤回: complete profile + one unrelated text that is revoked.
// Expect: profile created normally, the revoked message has no effect.
// QA deletes the test maid in CRM afterwards.
test('TC-01-02 F unrelated message revoked', async ({ page }) => {
  test.setTimeout(10 * 60000);
  const maid = buildIncompleteMaid();
  await openGroup(page);

  await sendText(page, '+++++');
  await sendPhoto(page, maid.shortBio);

  await sendText(page, 'sorry, wrong message');
  await revokeLastMessage(page);

  await sendText(page, maid.longBio);
  await sendText(page, '=====');

  await delay(5000);
});
