import { test } from '../fixtures';
import { delay, openGroup, sendText } from './maidSubmission';

// TC-01-02 H 只发 =====: send ===== alone in the onboarding group (no profile before it).
// Expect: reply includes "Missing: the +++++ start marker.", no CRM Maid.
test('TC-01-02 H only =====', async ({ page }) => {
  test.setTimeout(8 * 60000);
  await openGroup(page);

  await sendText(page, '=====');

  await delay(5000);
});
