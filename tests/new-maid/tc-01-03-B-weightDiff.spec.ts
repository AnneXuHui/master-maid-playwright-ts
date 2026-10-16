import { test } from '../fixtures';
import { buildTestMaid, delay, openGroup, submitMaid } from './maidSubmission';

// TC-01-03 B 体重差 0.5: resend an existing profile with only the weight changed 48 -> 48.5.
// The test first creates the profile itself, waits for it to be created, then resends it.
// Expect (current behaviour): the duplicate check does not match -> a 2nd CRM Maid is created.
// QA confirms whether the business accepts this, then deletes BOTH test maids in CRM.
test('TC-01-03 B resend with weight 48 -> 48.5', async ({ page }) => {
  test.setTimeout(12 * 60000);
  const maid = buildTestMaid('Test Duplicate');
  await openGroup(page);

  await submitMaid(page, maid);

  // Let the bot finish creating the first profile before resending.
  await delay(120000);

  await submitMaid(page, {
    ...maid,
    shortBio: maid.shortBio.replace('48 kg', '48.5 kg'),
    longBio: maid.longBio.replace('48kg', '48.5kg'),
  });

  await delay(5000);
});
