import { test } from '../fixtures';
import { delay, findMessage, openGroup, quoteReply, sendText } from './maidSubmission';

// TC-01-04 E 引用非资料消息: send a plain chat message, then quote it and reply "closed".
// Expect: no maid found -> flow ends silently, no bot reply (see 待核实问题 create-new-maid).
test('TC-01-04 E quote a non-profile message, reply "closed"', async ({ page }) => {
  test.setTimeout(8 * 60000);
  await openGroup(page);

  const plainText = `just a normal chat message ${Math.floor(1000 + Math.random() * 9000)}`;
  await sendText(page, plainText);

  const message = await findMessage(page, [{ hasText: plainText }]);
  await quoteReply(page, message, 'closed');

  await delay(5000);
});
