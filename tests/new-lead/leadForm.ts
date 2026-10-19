import type { Page } from '@playwright/test';
import { test } from '../fixtures';

/**
 * Shared helpers for TC-02-01 Google 表单提交：建 Lead、建 ⏸️ 售前群、写 Chat Activity
 * (flows: create-new-lead, svc-group-icons).
 *
 * submitLeadForm(page, options) fills and submits the employer requirement
 * Google Form (same form and selectors as tests/createLead.spec.ts). Answers
 * follow the P0「测试数据模板」 E1 payload: Both abroad and local transfers,
 * Myanmar only, 2 adults + 1 baby (8 months), 1 small dog, Q17 "Singapore
 * experienced only. Age 25 to 40." Questions the template leaves out are
 * answered "NIL" so they drop out of the requirement summary the same way.
 *
 * Contact numbers are random, made-up Singapore-format numbers (fakeSgNumber),
 * not real employers. The test only submits; QA checks the CRM Lead, the new
 * pre-sales group and the Chat Activity by hand. Submitted names / numbers are
 * listed under Annotations.
 */

/* Run Info -- to update in every test */
const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLScJG3VY6q545p3-r0BMPSNk-Vgta8gn50eRLLtoQiSgiKK2bQ/viewform';
// data-value of the "Country Code" dropdown option for +65 Singapore.
// createLead.spec.ts uses 'CN (+86)'; check the SG option's data-value if this one is not found.
export const sgCountryCode = 'SG (+65)';
// PRM option text on page 3; its value in brackets must match the PRM Contact's custom_prm_id.
const prmName = 'Mr. Page (R23116544) - Snr Manager';

export type LeadFormOptions = {
  /** FULL NAME answer -> CRM Lead first_name and the group name. */
  employerName: string;
  /** Contact Number exactly as typed into the form. */
  contact: string;
  /** Country Code data-value (required by the form). */
  countryCode?: string;
  email?: string;
  /** Q2 nationality checkboxes. */
  nationalities?: string[];
  /** Q17 special preferences (required; "NIL" = no special preference). */
  q17?: string;
  /** Override any text answer, keyed by the question text used to find it. */
  textAnswers?: Partial<Record<TextQuestion, string>>;
};

type TextQuestion =
  | 'EARLIEST date' | 'House type' | 'What race/ religion' | 'No. of adults'
  | 'Anybody that will be home' | 'Ages and Gender of the kid' | 'Ages and Gender of the elderly'
  | 'No. of car' | 'Any pet(s)' | 'What will be the 12 hours slot'
  | 'Name of Sponsor' | 'Name of liaising person';

const defaultTextAnswers: Record<TextQuestion, string> = {
  'EARLIEST date': 'ASAP',
  'House type': 'HDB 4-room',
  'What race/ religion': 'Chinese, Buddhist, No beef',
  'No. of adults': '2 adults (Sir, Mdm), 1 baby',
  'Anybody that will be home': 'NIL',
  'Ages and Gender of the kid': 'Boy, 8 months old',
  'Ages and Gender of the elderly': 'NIL',
  'No. of car': 'NIL',
  'Any pet(s)': '1 small dog',
  'What will be the 12 hours slot': '9AM to 9PM',
  'Name of Sponsor': 'NA',
  'Name of liaising person': 'NIL',
};

const tag = () => Math.floor(1000 + Math.random() * 9000);

/** Random made-up Singapore mobile number, 8 digits starting with 9 (not a real employer). */
export function fakeSgNumber() {
  return `9${Math.floor(1000000 + Math.random() * 9000000)}`;
}

/** Unique employer name, e.g. "Tester One 4821". */
export function employerName(base: string) {
  return `${base} ${tag()}`;
}

const delay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

export async function submitLeadForm(page: Page, options: LeadFormOptions) {
  const {
    employerName: name,
    contact,
    countryCode = sgCountryCode,
    email = 'qa-test@example.com',
    nationalities = ['Myanmar only'],
    q17 = 'Singapore experienced only. Age 25 to 40.',
  } = options;
  const answers = { ...defaultTextAnswers, ...options.textAnswers };

  test.info().annotations.push({
    type: 'lead',
    description: `${name} | Country Code: ${countryCode} | Contact: ${contact}`,
  });

  // Text question inside its list item; long answers may use a textarea.
  const textInput = (question: string) =>
    page.locator(`div[role="listitem"]:has-text("${question}") textarea, div[role="listitem"]:has-text("${question}") input[type="text"]`).first();
  const fill = async (question: TextQuestion) => {
    await textInput(question).fill(answers[question]);
    await delay();
  };

  await test.step(`Submit lead form: ${name}`, async () => {
    await page.goto(formUrl);

    // --- Page 1: requirements (Q1 - Q19) ---
    await page.getByLabel('Both abroad and local transfers').click();
    await delay();

    for (const nationality of nationalities) {
      await page.getByRole('checkbox', { name: nationality }).click();
      await delay();
    }

    await page.getByLabel('I have hired before, experienced employer').click();
    await delay();
    await fill('EARLIEST date');
    await page.getByLabel("Yes, Employer's declared income to IRAS is above $3k per month").click();
    await delay();
    await fill('House type');
    await page.getByLabel('Helper shares room with kids/ elderly').click();
    await delay();
    await fill('What race/ religion');
    await fill('No. of adults');
    await fill('Anybody that will be home');
    await fill('Ages and Gender of the kid');
    await fill('Ages and Gender of the elderly');
    await fill('No. of car');
    await fill('Any pet(s)');
    await page.getByLabel('Ok to give alternate Sundays off (2 Offs)').click();
    await delay();
    await fill('What will be the 12 hours slot');
    await page.getByLabel("Ok with handphone only during helper's meal breaks and after working hours (Recommended)", { exact: false }).click();
    await delay();

    for (const duty of ['Housework', 'Childcare/ Babycare', 'Cooking', 'Pets Care']) {
      await page.getByRole('checkbox', { name: duty }).click();
      await delay();
    }

    await textInput('Any other special preferences').fill(q17);
    await delay();

    await page.getByLabel('wake up 6am, end work latest 9pm (sleep by 10pm)').click();
    await delay();
    await page.getByLabel('Yes - to vaccine against measles').click();
    await delay();

    await page.getByRole('button', { name: /下一页|Next/ }).click();
    await delay();

    // --- Page 2: employer details ---
    await textInput('FULL NAME').fill(name);
    await delay();
    await page.getByLabel('Singapore Citizen (SC)/ Permanent Resident (PR)').click();
    await delay();
    await fill('Name of Sponsor');
    await fill('Name of liaising person');

    await page.locator('div[role="listitem"]:has-text("Country Code") div[role="listbox"]').click();
    await delay(); // wait for the dropdown animation
    await page.locator(`div[role="option"][data-value="${countryCode}"]`).click();
    await delay();

    await textInput('Contact Number').fill(contact);
    await delay();
    await textInput('Email Address').fill(email);
    await delay();
    await page.getByRole('button', { name: /下一页|Next/ }).click();
    await delay();

    // --- Page 3: PRM ---
    await page.locator('div[role="listbox"]').last().click();
    await delay();
    await page.getByRole('option', { name: prmName }).click();
    await delay();
    await page.getByRole('button', { name: /下一页|Next/ }).click();
    await delay();

    // --- Page 4: agreement ---
    await page.getByRole('radio', { name: 'I AGREE' }).click();
    await delay();
    await page.getByRole('checkbox', { name: 'I have employed 3 or more helpers within the past 12 months' }).click();
    await delay();

    await page.getByRole('button', { name: /提交|Submit/ }).click();
    await delay(5000);
  });
}
