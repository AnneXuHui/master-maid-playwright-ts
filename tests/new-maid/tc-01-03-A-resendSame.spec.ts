import { test } from '../fixtures';
import { buildTestMaid, delay, openGroup, submitMaid } from './maidSubmission';

// TC-01-03 A 原样重发: a profile that already exists in CRM is submitted again unchanged.
// The test first creates the profile itself, waits for it to be created, then resends it as is.
// Expect: 1st -> created; 2nd -> "Looks like this maid's profile has already been created! ✅ ...",
// no second CRM Maid. QA checks the bot replies / CRM by hand, then deletes the test maid.
test('TC-01-03 A resend an existing profile unchanged', async ({ page }) => {
  test.setTimeout(12 * 60000);
  const maid = buildTestMaid('Test Duplicate');
  await openGroup(page);

  await submitMaid(page, maid);

  // Let the bot finish creating the first profile before resending.
  await delay(120000);

  await submitMaid(page, maid);

  await delay(5000);
});
