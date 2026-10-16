import { test } from '../fixtures';
import { sendMaidSubmissions } from './maidSubmission';

// TC-01-01: send 1 complete maid submission(s) back to back. QA checks the bot replies and CRM by hand.
test('TC-01-01 send 1 complete submission(s)', async ({ page }) => {
  await sendMaidSubmissions(page, 1);
});
