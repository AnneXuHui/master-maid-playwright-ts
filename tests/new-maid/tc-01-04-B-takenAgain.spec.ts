import { test } from '../fixtures';
import { createMaidForQuote, delay, openGroup, quoteReply } from './maidSubmission';

// TC-01-04 B 重复下架: create a new test maid, close her ("closed"), then quote her
// profile message again and reply "Taken" (case-insensitive).
// Expect: 1st -> "<name> availability closed"; 2nd -> availability already 0, unchanged, no bot reply.
// QA deletes the test maid in CRM afterwards.
test('TC-01-04 B quote profile, reply "Taken" when already closed', async ({ page }) => {
  test.setTimeout(14 * 60000);
  await openGroup(page);

  const profile = await createMaidForQuote(page);
  await quoteReply(page, profile, 'closed');

  // Let the bot finish the "closed" update first.
  await delay(60000);

  await quoteReply(page, profile, 'Taken');

  await delay(5000);
});
