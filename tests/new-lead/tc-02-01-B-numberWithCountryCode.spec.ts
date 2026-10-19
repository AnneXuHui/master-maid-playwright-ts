import { test } from '../fixtures';
import { employerName, fakeSgNumber, submitLeadForm } from './leadForm';

// TC-02-01 B 号码已含国家码: Contact Number "+65 9xxx-xxxx", Country Code +65 Singapore.
// Expect: 65 is not added twice, mobile_no = 65 + the 8 digits, e.g. 6591234567.
test('TC-02-01 B contact number already has country code', async ({ page }) => {
  test.setTimeout(5 * 60000);
  const number = fakeSgNumber();
  await submitLeadForm(page, {
    employerName: employerName('Tester B'),
    contact: `+65 ${number.slice(0, 4)}-${number.slice(4)}`,
  });
  test.info().annotations.push({ type: 'expected mobile_no', description: `65${number}` });
});
