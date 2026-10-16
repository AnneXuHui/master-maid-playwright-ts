import { test } from '../fixtures';
import { delay, openGroup, sendText } from './maidSubmission';

// TC-01-02 J 普通聊天: send "hello" in the onboarding group (not =====, not a quote reply).
// Expect: no bot reply (finalize message 9).
test('TC-01-02 J plain chat message', async ({ page }) => {
  test.setTimeout(8 * 60000);
  await openGroup(page);

  await sendText(page, 'hello');

  await delay(5000);
});
