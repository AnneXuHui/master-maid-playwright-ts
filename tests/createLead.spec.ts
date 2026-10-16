import { test, expect } from './fixtures';

test('Maid Requirement Form', async ({ page }) => {
  // 1. Setup and Timeouts
  test.setTimeout(300000); // 5 minutes total
  const delay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

  // Configuration for Google Form
  const formConfig = {
    url: 'https://docs.google.com/forms/d/e/1FAIpQLSeyeuyX-5T9EZFMTNTs5gLVH0QWvwiEbTHBqZh27Z5HiUePcA/viewform?usp=dialog',
    q1_transfer: 'Both abroad and local transfers',
    q2_nationalities: ['Myanmar only', 'Indonesian only'],
    q3_firstTime: 'I have hired before, experienced employer',
    q4_timeline: 'ASAP',
    q5_income: "Yes, Employer's declared income to IRAS is above $3k per month",
    q6a_house: 'HDB 4-room',
    q6b_room: 'Helper shares room with kids/ elderly',
    q6c_diet: 'Chinese, Buddhist, No beef',
    q7_household: '3 adults, 1 kid (Sir, Mdm, Mdm\'s mother, 1 daughter)',
    q8_home: "Yes, Mdm's mother",
    q9_kids: '13, female, no need to send and fetch',
    q10_elderly: '68 years old grandma',
    q11_cars: '1 car, wash once every 2 weeks',
    q12_pets: 'no',
    q13_offDays: 'Ok to give alternate Sundays off (2 Offs)',
    q14_slot: '9AM to 9PM',
    q15_phone: 'Ok with handphone only during helper\'s meal breaks and after working hours (Recommended)',
    q16_duties: ['Housework', 'Elderlycare', 'Cooking'],
    q17_special: 'NIL',
    q18_hours: 'wake up 6am, end work latest 9pm (sleep by 10pm)',
    q19_vaccine: 'Yes - to vaccine against measles',
    employerName: `ANNE DEV TEST ${Math.floor(100 + Math.random() * 900)}`,
    resStatus: 'Singapore Citizen (SC)/ Permanent Resident (PR)',
    sponsorName: 'NA',
    liaison: 'HX',
    countryCodeValue: 'CN (+86)', // Target the internal value
    contact: '18062500994',
    email: 'annexu@test.com',
    prmName: 'Mr. Cman (R1666888) - Manager',
    agreeContent: "I AGREE",
    employmentExperiences: ["I have employed 3 or more helpers within the past 12 months"]
  };

  // --- PART 1: GOOGLE FORM ---
  await page.goto(formConfig.url);

  // Question 1 - 19 Logic
  await page.getByLabel(formConfig.q1_transfer).click();
  await delay();

  for (const nationality of formConfig.q2_nationalities) {
    await page.getByRole('checkbox', { name: nationality }).click();
    await delay();
  }

  await page.getByLabel(formConfig.q3_firstTime).click();
  await delay();

  await page.locator('div[role="listitem"]:has-text("EARLIEST date") textarea, div[role="listitem"]:has-text("EARLIEST date") input[type="text"]').fill(formConfig.q4_timeline);
  await delay();

  await page.getByLabel(formConfig.q5_income).click();
  await delay();

  await page.locator('div[role="listitem"]:has-text("House type") input[type="text"]').fill(formConfig.q6a_house);
  await delay();

  await page.getByLabel(formConfig.q6b_room).click();
  await delay();

  await page.locator('div[role="listitem"]:has-text("What race/ religion") input[type="text"]').fill(formConfig.q6c_diet);
  await delay();

  await page.locator('div[role="listitem"]:has-text("No. of adults") textarea, div[role="listitem"]:has-text("No. of adults") input[type="text"]').fill(formConfig.q7_household);
  await delay();

  await page.locator('div[role="listitem"]:has-text("Anybody that will be home") input[type="text"]').fill(formConfig.q8_home);
  await delay();

  await page.locator('div[role="listitem"]:has-text("Ages and Gender of the kid") textarea, div[role="listitem"]:has-text("Ages and Gender of the kid") input[type="text"]').fill(formConfig.q9_kids);
  await delay();

  await page.locator('div[role="listitem"]:has-text("Ages and Gender of the elderly") textarea, div[role="listitem"]:has-text("Ages and Gender of the elderly") input[type="text"]').fill(formConfig.q10_elderly);
  await delay();

  await page.locator('div[role="listitem"]:has-text("No. of car") input[type="text"]').fill(formConfig.q11_cars);
  await delay();

  await page.locator('div[role="listitem"]:has-text("Any pet(s)") input[type="text"]').fill(formConfig.q12_pets);
  await delay();

  await page.getByLabel(formConfig.q13_offDays).click();
  await delay();

  await page.locator('div[role="listitem"]:has-text("What will be the 12 hours slot") input[type="text"]').fill(formConfig.q14_slot);
  await delay();

  await page.getByLabel(formConfig.q15_phone, { exact: false }).click();
  await delay();

  for (const duty of formConfig.q16_duties) {
    await page.getByRole('checkbox', { name: duty }).click();
    await delay();
  }

  await page.locator('div[role="listitem"]:has-text("Any other special preferences") textarea, div[role="listitem"]:has-text("Any other special preferences") input[type="text"]').fill(formConfig.q17_special);
  await delay();

  await page.getByLabel(formConfig.q18_hours).click();
  await delay();

  await page.getByLabel(formConfig.q19_vaccine).click();
  await delay();

  await page.getByRole('button', { name: /下一页|Next/ }).click();
  await delay();

  // --- Page 2 of Form ---
  await page.locator('div[role="listitem"]:has-text("FULL NAME") input[type="text"]').fill(formConfig.employerName);
  await delay();
  await page.getByLabel(formConfig.resStatus).click();
  await delay();
  await page.locator('div[role="listitem"]:has-text("Name of Sponsor") input[type="text"]').fill(formConfig.sponsorName);
  await delay();
  await page.locator('div[role="listitem"]:has-text("Name of liaising person") input[type="text"]').fill(formConfig.liaison);
  await delay();

  // FIX: Robust Country Code Selection
  const countryListbox = page.locator('div[role="listitem"]:has-text("Country Code") div[role="listbox"]');
  await countryListbox.click();
  await delay(1000); // Short wait for animation
  await page.locator(`div[role="option"][data-value="${formConfig.countryCodeValue}"]`).click();
  await delay();

  await page.locator('div[role="listitem"]:has-text("Contact Number") input[type="text"]').fill(formConfig.contact);
  await delay();
  await page.locator('div[role="listitem"]:has-text("Email Address") input[type="text"]').fill(formConfig.email);
  await delay();
  await page.getByRole('button', { name: /下一页|Next/ }).click();
  await delay();

  // --- Page 3 of Form ---
  const prmListbox = page.locator('div[role="listbox"]').last();
  await prmListbox.click();
  await delay(1000);
  await page.getByRole('option', { name: formConfig.prmName }).click();
  await delay();
  await page.getByRole('button', { name: /下一页|Next/ }).click();
  await delay();

  // --- Page 4 of Form ---
  await page.getByRole('radio', { name: formConfig.agreeContent }).click();
  await delay();
  for (const duty of formConfig.employmentExperiences) {
    await page.getByRole('checkbox', { name: duty }).click();
    await delay();
  }
  
  await page.getByRole('button', { name: /提交|Submit/ }).click();
  await delay(5000);
});