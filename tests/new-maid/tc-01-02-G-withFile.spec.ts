import { test } from '../fixtures';
import { buildIncompleteMaid, delay, openGroup, sendDocument, sendPhoto, sendText } from './maidSubmission';

// TC-01-02 G 夹带文件: complete profile + a PDF document (images/sample.pdf).
// Expect: the file is ignored, profile created from the rest.
// QA deletes the test maid in CRM afterwards.
test('TC-01-02 G complete profile with a PDF', async ({ page }) => {
  test.setTimeout(10 * 60000);
  const maid = buildIncompleteMaid();
  await openGroup(page);

  await sendText(page, '+++++');
  await sendPhoto(page, maid.shortBio);
  await sendDocument(page);
  await sendText(page, maid.longBio);
  await sendText(page, '=====');

  await delay(5000);
});
