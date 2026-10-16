import { test } from '../fixtures';
import { buildIncompleteMaid, delay, openGroup, sendPhoto, sendText } from './maidSubmission';

// TC-01-02 A 缺 full bio: +++++ / 照片(带说明) / =====
// Expect: "Oops! 😅 This profile is incomplete..." and no CRM Maid.
// Then resend the complete profile: expect it is created (claim lock released).
// QA checks the bot replies / CRM by hand, then deletes the test maid in CRM.
test('TC-01-02 A missing full bio, then resend complete', async ({ page }) => {
  test.setTimeout(10 * 60000);
  const maid = buildIncompleteMaid();
  await openGroup(page);

  await test.step('Incomplete: no full bio', async () => {
    await sendText(page, '+++++');
    await sendPhoto(page, maid.shortBio);
    await sendText(page, '=====');
  });

  // Give the bot time to reply "incomplete" and release the claim lock.
  await delay(60000);

  await test.step('Resend complete profile', async () => {
    await sendText(page, '+++++');
    await sendPhoto(page, maid.shortBio);
    await sendText(page, maid.longBio);
    await sendText(page, '=====');
  });

  await delay(5000);
});
