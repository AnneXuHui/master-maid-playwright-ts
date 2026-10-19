import { test } from '../fixtures';
import { employerName, fakeSgNumber, submitLeadForm } from './leadForm';

// TC-02-01 D 国籍多选: Q2 = ["Myanmar only", "Filipino only"].
// Expect: the 2nd line of the requirement summary is "Myanmar, Filipino only."
test('TC-02-01 D multiple nationalities', async ({ page }) => {
  test.setTimeout(5 * 60000);
  await submitLeadForm(page, {
    employerName: employerName('Tester D'),
    contact: fakeSgNumber(),
    nationalities: ['Myanmar only', 'Filipino only'],
  });
});
