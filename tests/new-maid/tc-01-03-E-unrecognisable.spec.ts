import { test } from '../fixtures';
import { delay, openGroup, sendPhoto, sendText } from './maidSubmission';

// TC-01-03 E 乱码资料: +++++ / 照片 / 两段随意文字（无姓名年龄等）/ =====
// Expect: after 3 recognition attempts the bot replies
// "Hmm, we tried 3 times but couldn't confidently match up the maid's information...", no CRM Maid.
test('TC-01-03 E unrecognisable profile text', async ({ page }) => {
  test.setTimeout(8 * 60000);
  await openGroup(page);

  await sendText(page, '+++++');
  await sendPhoto(page);
  await sendText(page, 'asdf qwer zxcv 1234 !!! ~~~ lorem ipsum ???');
  await sendText(page, 'blue sky rainy tuesday banana keyboard random words only');
  await sendText(page, '=====');

  await delay(5000);
});
