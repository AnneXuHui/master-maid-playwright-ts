import { test } from '../fixtures';
import { delay, openGroup, preSalesGroupName, sendText } from './maidSubmission';

// TC-01-02 I 非建档群: send ===== in a pre-sales group (preSalesGroupName in maidSubmission.ts).
// Expect: flow ends at finalize message 1, no bot reply.
test('TC-01-02 I ===== in a non-onboarding group', async ({ page }) => {
  test.setTimeout(8 * 60000);
  await openGroup(page, preSalesGroupName);

  await sendText(page, '=====');

  await delay(5000);
});
