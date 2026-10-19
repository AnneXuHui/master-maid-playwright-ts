import { test } from '../fixtures';
import { createMaidForQuote, delay, openGroup, quoteReply } from './maidSubmission';

// TC-01-04 A 下架: create a new test maid, then quote her profile message and reply "closed".
// Expect: CRM Maid availability 1 -> 0, bot replies "<name> availability closed".
// QA deletes the test maid in CRM afterwards.
test('TC-01-04 A quote profile, reply "closed"', async ({ page }) => {
  test.setTimeout(12 * 60000);
  await openGroup(page);

  const profile = await createMaidForQuote(page);
  await quoteReply(page, profile, 'closed');

  await delay(5000);
});
