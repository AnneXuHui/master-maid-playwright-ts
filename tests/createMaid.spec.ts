import { test, expect } from './fixtures';

test('WhatsApp Web Automation in Chrome', async ({ page }) => {
  // 1. Increase the overall test timeout to 2 minutes
  // This gives you plenty of time to scan the QR code
  test.setTimeout(120000);

  // 1. Open WhatsApp Web
  await page.goto('https://web.whatsapp.com/');

  // 2. Wait for the search bar (the 'App is ready' signal)
  const searchBar = page.getByRole('textbox', { name: '搜索或开始新聊天' });

  // This will now wait up to 30s without the test being killed
  await expect(searchBar).toBeVisible({ timeout: 300000 });

  // 3. Look for chat "Central Maid Bio - AI" or "DEV NEW MAID"
  const groupName ='DEV NEW MAID'
  await searchBar.click();
  await searchBar.fill(groupName);
  await page.waitForTimeout(3000);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(3000);

  // Ensure the chat has opened by checking for the message input
  // Use data-tab="10" which is the WhatsApp internal marker for the message input area
  // This works regardless of UI language (Chinese/English/etc.)
  const messageInput = page.locator('div[contenteditable="true"][data-tab="10"]');
  await messageInput.waitFor({ state: 'visible', timeout: 15000 });

  // 4. Send message "+++++"
  await messageInput.fill('+++++');
  await page.waitForTimeout(3000);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(3000);

  /* Maid Info -- to update in every test */
  const maidImg = 'F:\\Development\\BOA\\master-maid-playwrigth\\images\\maid.png';
  const shortBio = `Li Yan Heng 🌿 [you can call her Ei ] 🌿~ Fresh Myanmar🇲🇲 Helper ~
🍀Myanmar 24 yo[08/02/2002], 159cm & 53kg, Buddhist, High School (Grade 10), 3 siblings, No. 2, Single, cannot eat beef but can handle, Willing: Children/Elderly 

✅ 3 Year Experience in Myanmar in taking care of her own 81 yo Ahma👵 and her own sister 13yo👧. Then she knows how to do the House works sweeping, moping, cleaning, washing, ironing including cooking. She can speak simple English and willing to learn some new things. Then willing to take care children and elderly. 

💰Salary: $500 + $60 (Compensate for 3 off days) +1 off/
 Loan: $ 3,240
She loves dogs & cats and willing to take care.
🌸🎥 please see the interview video to have a feel of her English standard: 
https://drive.google.com/file/d/1qqxvjuC7Ga1ZGlVt8mnmNDUfzJ9sEnhC/view?usp=drive_link 
🗓️Passport is processing(after two weeks).`;

  const longBio = `🍀 🙏🍀 Hi everyone, I have recently interviewed Fresh Myanmar 🇲🇲helper. 
👤 Personal Background
•	Name: Li Yan Heng
•	Age: 24 yo[08/02/2002], 
•	Nationality: Myanmar
•	Marital Status: Single
•	Education: High School (Grade 10)
•	Physical: 159cm & 53kg (need to be verified)
•	Religion: Buddhist
•	Personal Details: No tattoos, no allergies, cannot eat beef but can handle
•	Motivation: She wishes to work in Singapore to earn more money and to support her family.

🏠 General Household Chores
•	She can do general house works, including cooking, cleaning, washing, ironing, sweeping and moping the floor.

🌟 Work Attitude
•	She is described as an experienced helper who is willing to learn new things.
•	She is willing to share room with others such as children/elderly.

 👧👦Experience with Child Care
•	in Myanmar, She has experience to take care of the children her own sister and willing to take care children.

👵👴 Experience with Elderly
•	(2022 to 2025)_in Myanmar, She has experience to take care of Elderly her own Grandma 81yo and she is willing to take care of Elderly.

💪💪 This is the profile for your consideration and she loves dogs🐶 & cats🐱 and is willing to take care.
🧩Salary: Basic $500 + $60 (compensation for 3 off days) + 1 off day
Loan : $ 3,240 [loan period is 6months]
Her passport is processing (after two weeks).

From Allink`;


  // 5. Click the attach (paperclip) icon -- WhatsApp Web no longer has a
  // separate round "+" button, the attach icon opens the menu directly.
  await page.getByTestId('ic-attach-file').click();
  await page.waitForTimeout(3000);

  // 6. Click "Photos & videos" (中文版: "照片和视频") and wait for the file picker to trigger
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.getByRole('menuitem', { name: /照片和视频|Photos & videos/i }).click(),
  ]);

  // 7. Upload your specific file
  await fileChooser.setFiles(maidImg);
  await page.waitForTimeout(3000);

  // 8. Handle the caption - after uploading a photo, WhatsApp shows a caption input
  const captionInput = page.locator('div[contenteditable="true"][data-tab="undefined"]');
  await captionInput.waitFor({ state: 'visible', timeout: 20000 });
  await captionInput.waitFor({ state: 'visible' });
  await captionInput.fill(shortBio);
  await page.waitForTimeout(3000);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(3000);

  // 9. Send message long bio
  await messageInput.fill(longBio);
  await page.waitForTimeout(3000);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(3000);

  // 10. Send message "====="
  await messageInput.fill('=====');
  await page.waitForTimeout(3000);
  await page.keyboard.press('Enter');

  // Short delay to ensure delivery before closing
  await page.waitForTimeout(3000);
});