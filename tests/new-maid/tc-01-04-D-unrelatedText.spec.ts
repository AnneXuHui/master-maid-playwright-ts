import { test } from '../fixtures';
import { createMaidForQuote, delay, openGroup, quoteReply } from './maidSubmission';

// TC-01-04 D 无关文字: create a new test maid, then quote her profile message and reply "ok noted".
// Expect: no availability change (stays 1), no bot reply.
// QA deletes the test maid in CRM afterwards.
test('TC-01-04 D quote profile, reply unrelated text', async ({ page }) => {
  test.setTimeout(12 * 60000);
  await openGroup(page);

  const profile = await createMaidForQuote(page);
  await quoteReply(page, profile, 'ok noted');

  await delay(5000);
});
