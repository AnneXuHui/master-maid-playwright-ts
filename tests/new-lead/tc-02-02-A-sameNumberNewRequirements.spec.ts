import { test } from '../fixtures';
import { defaultDuties, employerName, fakeSgNumber, submitLeadForm } from './leadForm';

// Fail a stuck step after 30 s with the step and element named in the error,
// instead of hanging until the test timeout. Scoped to this file only.
test.use({ actionTimeout: 30000 });

// TC-02-02 A 同号改需求: the same employer (same number) submits a 2nd form with
// Q16 + "Elderlycare" and Q12 pets = "NIL", then the original form again to restore.
// The test first creates its own E4-style lead (Q17 = NIL), so it does not depend on L4.
// Expect after the 2nd form (QA checks by hand):
// - no new Lead / group; the group description is updated to the new requirements;
//   the group name is unchanged (⏸️ without icons);
// - Lead custom_requirements updated, custom_group_icons = 👶🏻👵🏻; flow output status = updated;
// - PRM, Lead status and group ownership unchanged, no re-matching.
// After the 3rd form: requirements and icons back to the original (👶🏻🐶).
test('TC-02-02 A same number, changed requirements', async ({ page }) => {
  test.setTimeout(15 * 60000);
  const name = employerName('Tester Four');
  const contact = fakeSgNumber();
  const original = { employerName: name, contact, q17: 'NIL' };

  await test.step('1st form: create the lead', async () => {
    await submitLeadForm(page, original);
  });

  // Let the flow create the Lead and the ⏸️ group first.
  await page.waitForTimeout(120000);

  await test.step('2nd form: Q16 + Elderlycare, Q12 = NIL', async () => {
    await submitLeadForm(page, {
      ...original,
      duties: [...defaultDuties, 'Elderlycare'],
      textAnswers: { 'Any pet(s)': 'NIL' },
    });
  });

  await page.waitForTimeout(120000);

  await test.step('3rd form: original requirements again (restore)', async () => {
    await submitLeadForm(page, original);
  });
});
