import { test } from '../fixtures';
import { employerName, fakeSgNumber, submitLeadForm } from './leadForm';

// TC-02-01 E 空答案: some questions answered "-" / "NA" / "NIL".
// Expect: those questions do not appear in the requirement summary at all (no blank lines).
// Answered here: Q4 EARLIEST date = "-", Q11 No. of car = "NA", Q14 12 hours slot = "NIL".
test('TC-02-01 E empty answers "-" / "NA" / "NIL"', async ({ page }) => {
  test.setTimeout(5 * 60000);
  await submitLeadForm(page, {
    employerName: employerName('Tester E'),
    contact: fakeSgNumber(),
    textAnswers: {
      'EARLIEST date': '-',
      'No. of car': 'NA',
      'What will be the 12 hours slot': 'NIL',
    },
  });
});
