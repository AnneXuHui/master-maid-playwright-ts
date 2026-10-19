import { test } from '../fixtures';
import { employerName, fakeSgNumber, submitLeadForm } from './leadForm';

// TC-02-01 主流程: submit the form for E1 - E4 (E1 / E2 full requirements, E3 / E4 Q17 = "NIL").
// Contact numbers are made-up 8-digit Singapore-format numbers, Country Code +65.
// Expect (QA checks by hand, see TC-02-01 预期):
// - CRM Lead: first_name = form full name, mobile_no = 65 + number, status = New,
//   custom_requirements = summary ("Both abroad and local transfers." / "Myanmar only." ...),
//   custom_group_icons: E1 / E2 = 👶🏻🇸🇬🐶, E3 / E4 = 👶🏻🐶.
// - New group "⏸️ <first_name> - Helper Matching - <PRM initial>", description = summary,
//   members BOT + PRM (admin), message "@PRM, please invite Employer at @<number>".
// - Chat Activity: group_type = pre_sales, activity = group_created, pending_confirmation = [].
// Register L1/G1 - L4/G4 from the submitted names (see Annotations).
const employers = [
  { id: 'E1', base: 'Tester One', withQ17: true },
  { id: 'E2', base: 'Tester Two', withQ17: true },
  { id: 'E3', base: 'Tester Three', withQ17: false },
  { id: 'E4', base: 'Tester Four', withQ17: false },
];

for (const employer of employers) {
  test(`TC-02-01 ${employer.id} submit lead form${employer.withQ17 ? '' : ' (Q17 = NIL)'}`, async ({ page }) => {
    test.setTimeout(5 * 60000);
    await submitLeadForm(page, {
      employerName: employerName(employer.base),
      contact: fakeSgNumber(),
      email: `${employer.id.toLowerCase()}-test@example.com`,
      q17: employer.withQ17 ? undefined : 'NIL',
    });
  });
}
