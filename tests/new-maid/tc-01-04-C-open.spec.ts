import { test } from '../fixtures';
import { createMaidForQuote, delay, openGroup, quoteReply } from './maidSubmission';

// TC-01-04 C 上架: create a new test maid, close her ("closed"), then quote her
// profile message again and reply "open".
// Expect: 1st -> "<name> availability closed"; 2nd -> availability 0 -> 1,
// bot replies "<name> availability reopen". QA deletes the test maid in CRM afterwards.
test('TC-01-04 C quote profile, reply "open"', async ({ page }) => {
  test.setTimeout(14 * 60000);
  await openGroup(page);

  const profile = await createMaidForQuote(page);
  await quoteReply(page, profile, 'closed');

  // Let the bot finish the "closed" update first.
  await delay(60000);

  await quoteReply(page, profile, 'open');

  await delay(5000);
});
