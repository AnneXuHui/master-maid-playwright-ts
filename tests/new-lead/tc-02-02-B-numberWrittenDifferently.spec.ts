import { test } from '../fixtures';
import { defaultDuties, employerName, fakeSgNumber, submitLeadForm } from './leadForm';

// Fail a stuck step after 30 s with the step and element named in the error,
// instead of hanging until the test timeout. Scoped to this file only.
test.use({ actionTimeout: 30000 });

// TC-02-02 B 号码写法不同: the same employer submits again with the number written as
// "+65 (9xxx) xxxx" and changed requirements (Q16 + "Elderlycare", Q12 pets = "NIL").
// The test first creates its own lead with the plain number "9xxxxxxx".
// Expect: both numbers normalise to the same mobile_no (65 + 8 digits) -> overwrite branch:
// no new Lead / group, requirements and icons (👶🏻👵🏻) updated, group name unchanged.
test('TC-02-02 B same number written differently', async ({ page }) => {
  test.setTimeout(10 * 60000);
  const name = employerName('Tester Four');
  const number = fakeSgNumber();
  test.info().annotations.push({ type: 'expected mobile_no', description: `65${number}` });

  await test.step('1st form: create the lead with "9xxxxxxx"', async () => {
    await submitLeadForm(page, { employerName: name, contact: number, q17: 'NIL' });
  });

  // Let the flow create the Lead and the ⏸️ group first.
  await page.waitForTimeout(120000);

  await test.step('2nd form: same number as "+65 (9xxx) xxxx", changed requirements', async () => {
    await submitLeadForm(page, {
      employerName: name,
      contact: `+65 (${number.slice(0, 4)}) ${number.slice(4)}`,
      q17: 'NIL',
      duties: [...defaultDuties, 'Elderlycare'],
      textAnswers: { 'Any pet(s)': 'NIL' },
    });
  });
});
