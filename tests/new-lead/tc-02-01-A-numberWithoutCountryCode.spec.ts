import { test } from '../fixtures';
import { employerName, fakeSgNumber, submitLeadForm } from './leadForm';

// TC-02-01 A 号码无国家码: Contact Number "9xxx xxxx" (with a space), Country Code +65 Singapore.
// Expect: CRM Lead mobile_no = 65 + the 8 digits, e.g. "9123 4567" -> 6591234567.
test('TC-02-01 A contact number without country code', async ({ page }) => {
  test.setTimeout(5 * 60000);
  const number = fakeSgNumber();
  await submitLeadForm(page, {
    employerName: employerName('Tester A'),
    contact: `${number.slice(0, 4)} ${number.slice(4)}`,
  });
  test.info().annotations.push({ type: 'expected mobile_no', description: `65${number}` });
});
