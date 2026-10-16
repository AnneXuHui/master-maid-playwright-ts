import type { Page } from '@playwright/test';
import { test, expect } from '../fixtures';
import path from 'path';

/**
 * Shared helpers for the maid-onboarding tests: TC-01-01 标准提交建档 and
 * TC-01-02 不完整 / 格式错误的提交 and
 * TC-01-03 重复建档、并发提交与无法识别的资料 (flows: create-new-maid, new-maid-trigger).
 *
 * sendMaidSubmissions(page, n) posts n complete submissions back to back into
 * the maid-onboarding group, each in order:
 *   +++++  ->  profile photo (caption = short bio)  ->  full bio text  ->  =====
 * The next +++++ is sent right after the previous =====, without waiting for
 * the bot. The test only sends; QA checks the bot replies
 * ("Thanks for sending the info..." / "successfully created <name>'s profile")
 * and the CRM Maid records by hand. Sent names are listed under Annotations.
 */

/* Run Info -- to update in every test */
export const groupName = 'Central Maid Bio - AI UAT';
// Any pre-sales (售前) group, used by TC-01-02 case I.
export const preSalesGroupName = '🍀👶🏻👵🏻🐶 ANNE XU - Helper Matching - JP';
const maidImg = path.resolve(__dirname, '../../images/maid.png');
const sampleDoc = path.resolve(__dirname, '../../images/sample.pdf');

type MaidSubmission = { id: string; name: string; shortBio: string; longBio: string };

// Every run gets a fresh suffix, so QA can tell this run's profiles apart
// from ones left by earlier runs.
function buildMaids(): MaidSubmission[] {
  const tag = () => Math.floor(1000 + Math.random() * 9000);
  const a = `Aye Aye Mon ${tag()}`;
  const b = `Thin Thin Aung ${tag()}`;
  const c = `Maria Santos ${tag()}`;

  return [
    {
      id: 'MD-A',
      name: a,
      shortBio: `*${a}* 🇲🇲 30 yo. 155 cm. 48 kg. Myanmar. DOB 1996-03-12. Ex-SG 3 years, baby care (8 months old), can cook, not afraid of dogs.`,
      longBio: `🍀 Ex-Singapore Myanmar 🇲🇲 helper
👤 Personal Background
•	Name: ${a}
•	Age: 30 yo [12/03/1996]
•	Nationality: Myanmar
•	Marital Status: Single
•	Education: High School (Grade 10)
•	Physical: 155cm & 48kg
•	Religion: Buddhist
•	Language: Simple English

💼 Work Experience
•	(2022 to 2025) Singapore, 3 years. Family of 2 adults + 1 baby (8 months old). Duties: baby care, housework, cooking, caring for the family's small dog.

🏠 General Household Chores
•	Cleaning, washing, ironing, sweeping, mopping, cooking Chinese food.

🐶 Not afraid of dogs, willing to take care of pets.
🧩 Expected salary: $650, 2 off days per month.`,
    },
    {
      id: 'MD-B',
      name: b,
      shortBio: `*${b}* 🇲🇲 28 yo. 158 cm. 50 kg. Myanmar. DOB 1998-07-05. Fresh, took care of 5 years old child in Myanmar.`,
      longBio: `🍀 Fresh Myanmar 🇲🇲 helper
👤 Personal Background
•	Name: ${b}
•	Age: 28 yo [05/07/1998]
•	Nationality: Myanmar
•	Marital Status: Single
•	Education: Middle School (Grade 8)
•	Physical: 158cm & 50kg
•	Religion: Buddhist
•	Language: Basic English

💼 Work Experience
•	(2021 to 2025) Myanmar only, took care of her neighbour's 5 years old boy, housework.
•	No overseas working experience.

🏠 General Household Chores
•	Cleaning, washing, sweeping, mopping, simple cooking.

🧩 Expected salary: $550, 1 off day per month.`,
    },
    {
      id: 'MD-C',
      name: c,
      shortBio: `*${c}* 🇵🇭 35 yo. 160 cm. 55 kg. Filipino. DOB 1991-01-20. Ex-HK 6 years, elderly care.`,
      longBio: `🍀 Ex-Hong Kong Filipino 🇵🇭 helper
👤 Personal Background
•	Name: ${c}
•	Age: 35 yo [20/01/1991]
•	Nationality: Filipino
•	Marital Status: Married, 2 children in Philippines
•	Education: College
•	Physical: 160cm & 55kg
•	Religion: Catholic
•	Language: Good English

💼 Work Experience
•	(2019 to 2025) Hong Kong, 6 years. Took care of an 80 years old bedridden grandma, housework, cooking.

🏠 General Household Chores
•	Cleaning, washing, ironing, marketing, cooking.

🧩 Expected salary: $750, 4 off days per month.`,
    },
  ];
}

export const delay = (ms = 3000) => new Promise(resolve => setTimeout(resolve, ms));

export async function openGroup(page: Page, name = groupName) {
  // 1. Open WhatsApp Web
  await page.goto('https://web.whatsapp.com/');

  // 2. Wait for the search bar (the 'App is ready' signal)
  const searchBar = page.getByRole('textbox', { name: /搜索或开始新聊天|Search or start a new chat/ });
  await expect(searchBar).toBeVisible({ timeout: 300000 });

  // 3. Search and open the group
  await searchBar.click();
  await searchBar.fill(name);
  await delay();
  await page.keyboard.press('Enter');
  await delay();

  await page.locator('[data-testid="conversation-compose-box-input"]').waitFor({ state: 'visible', timeout: 15000 });
}

/** waitMs: pause before and after pressing Enter (shorten it to send messages in quick succession). */
export async function sendText(page: Page, text: string, waitMs = 3000) {
  const messageInput = page.locator('[data-testid="conversation-compose-box-input"]');
  await messageInput.click();
  await messageInput.fill(text);
  await delay(waitMs);
  await page.keyboard.press('Enter');
  await delay(waitMs);
}

/** Attach a file through the paperclip menu and send it, optionally with a caption. */
async function sendAttachment(page: Page, menuItem: RegExp, file: string, caption?: string) {
  // The attach icon no longer carries data-testid="ic-attach-file"; match its
  // accessible name instead (中文版: "附加").
  await page.getByRole('button', { name: /^(附加|Attach)$/ }).click();
  await delay();

  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.getByRole('menuitem', { name: menuItem }).click(),
  ]);
  await fileChooser.setFiles(file);
  await delay();

  const captionInput = page.locator('div[contenteditable="true"][data-tab="undefined"]');
  await captionInput.waitFor({ state: 'visible', timeout: 20000 });
  if (caption) {
    await captionInput.fill(caption);
    await delay();
  }
  await captionInput.click();
  await page.keyboard.press('Enter');
  await delay();
}

export async function sendPhoto(page: Page, caption?: string) {
  await sendAttachment(page, /照片和视频|Photos & videos/i, maidImg, caption);
}

export async function sendDocument(page: Page, file = sampleDoc) {
  await sendAttachment(page, /^(文档|Document)$/i, file);
}

/** Unsend ("对所有人删除" / "Delete for everyone") the newest message in the chat. */
export async function revokeLastMessage(page: Page) {
  await test.step('Revoke last message', async () => {
    // Right-click the bubble itself, not the row: a row spans the full chat
    // width, so its centre is empty space next to a short right-aligned text
    // bubble and the menu would open for a neighbouring message instead.
    const lastBubble = page.locator('[data-testid="msg-container"]').last();
    await lastBubble.scrollIntoViewIfNeeded();
    await lastBubble.click({ button: 'right' });
    await page.getByRole('menuitem', { name: /^(删除|Delete)$/ }).click();

    // The menu item only puts the chat into select mode ("已选1项" bar at the
    // bottom, message pre-ticked); the actual delete is the bar's trash button.
    // Match it by accessible name or by its trash icon, whichever is present.
    const trashButton = page.getByRole('button', { name: /^(删除|Delete)/ })
      .or(page.getByRole('button').filter({ has: page.locator('[data-icon*="delete"]') }))
      .last();
    await trashButton.click();

    // Confirm dialog "要删除消息吗？": 对所有人删除 / 从我这端删除 / 取消
    await page.getByRole('button', { name: /[对为]所有人删除|Delete for everyone/ }).click();
    // First-time "you deleted this for everyone" notice, if WhatsApp shows one.
    const okButton = page.getByRole('button', { name: /^(确定|OK)$/ });
    if (await okButton.isVisible({ timeout: 3000 }).catch(() => false)) await okButton.click();
    await delay();
  });
}

/** +++++  ->  photo with short bio caption  ->  full bio  ->  ===== */
export async function submitMaid(page: Page, maid: MaidSubmission) {
  await test.step(`Submit ${maid.id} (${maid.name})`, async () => {
    await sendText(page, '+++++');
    await sendPhoto(page, maid.shortBio);
    await sendText(page, maid.longBio);
    await sendText(page, '=====');
  });
}

export async function sendMaidSubmissions(page: Page, count: number) {
  // Login wait + ~1 minute per submission, with headroom.
  test.setTimeout(5 * 60000 + count * 3 * 60000);

  const maids = buildMaids().slice(0, count);
  await openGroup(page);

  // Send all submissions back to back, without waiting for the bot.
  for (const maid of maids) {
    await submitMaid(page, maid);
    test.info().annotations.push({ type: 'sent', description: `${maid.id} = ${maid.name}` });
  }

  // Short delay to ensure delivery before closing
  await delay(5000);
}

/** Test profile "<prefix> <suffix>" (MD-A's bio under a new name), not kept after the test. */
export function buildTestMaid(prefix: string): MaidSubmission {
  const maid = buildMaids()[0];
  const name = `${prefix} ${Math.floor(1000 + Math.random() * 9000)}`;
  test.info().annotations.push({ type: 'maid', description: name });
  return {
    id: 'TEST',
    name,
    shortBio: maid.shortBio.replace(maid.name, name),
    longBio: maid.longBio.replace(maid.name, name),
  };
}

/** TC-01-02 test profile: "Test Incomplete <suffix>". */
export function buildIncompleteMaid(): MaidSubmission {
  return buildTestMaid('Test Incomplete');
}
