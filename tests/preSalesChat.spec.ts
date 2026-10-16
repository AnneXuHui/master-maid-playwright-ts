import { test, expect } from './fixtures';

/**
 * Exercises the "PreSales" WhatsApp bot flow described in document/presales-v1-07.json:
 * Intent classifier (INTERESTED / INTERVIEW / CONFIRM_MAID / COLLECTDATETIME /
 * MORE_MAID_RECOMMENDATION_REQUEST / CHANGEREQUIREMENT / STOP_SENDING) driven by
 * replies to a maid recommendation bubble ("Helper Name: ... Helper ID: MD-00xxx").
 */
test('PreSales Chat WhatsApp Automation', async ({ page }) => {
  test.setTimeout(600000); // 10 minutes: several bot round-trips with wait time
  const delay = (ms = 3000) => new Promise(resolve => setTimeout(resolve, ms));

  /* Chat / Lead Info -- to update in every test */
  const groupName = 'ANNE TEST 445 - Helper Matching - C';
  const helperId = 'MD-00691';
  const senderName = 'Paul L';

  // 1. Open WhatsApp Web
  await page.goto('https://web.whatsapp.com/');

  // 2. Wait for the search bar (the 'App is ready' signal)
  const searchBar = page.getByRole('textbox', { name: '搜索或开始新聊天' });
  await expect(searchBar).toBeVisible({ timeout: 60000 });

  // 3 & 4. Search and open the chat
  await searchBar.click();
  await searchBar.fill(groupName);
  await page.keyboard.press('Enter');
  await delay();

  // Compose box aria-label is localized and embeds the group name (e.g. Chinese:
  // 输入要向群组"<group>"发送的消息), so match the stable data-testid instead of a name.
  const messageInput = page.locator('[data-testid="conversation-compose-box-input"]');

  // Context menu "Reply" item, in either English or Chinese UI. getByRole keeps
  // this anchored to the actual button node instead of a raw text match, and the
  // anchored regex excludes similarly-worded entries like "私信回复" (Reply privately).
  const replyMenuItem = page.getByRole('menuitem', { name: /^(Reply|回复)$/ });

  // 5. Locate a maid recommendation bubble that carries "Helper ID: <helperId>"
  // AND was sent by senderName, so replies quote it (matches the JSON's rule that
  // a replied-to "Helper Name:/Helper ID:" block is checked before chat history).
  // Our own replies re-embed the quoted original (same Helper ID + sender name) in
  // their quote-preview, so require WhatsApp's own "incoming" tail marker
  // (data-testid="tail-in") to exclude self-authored bubbles -- this is a
  // structural DOM signal, unlike text, so it holds regardless of UI language.
  // .last() picks whichever qualifying bubble is most recent (the original card,
  // or the bot's later full-bio reply -- either is fine to reply to), and stays
  // closer to the live viewport than the original, which may scroll out of the
  // virtualized list's render window as the conversation grows.
  const recommendationMessage = page.getByRole('row')
    .filter({ hasText: `Helper ID: ${helperId}` })
    .filter({ hasText: senderName })
    .filter({ has: page.locator('[data-testid="tail-in"]') })
    .last();

  await expect(recommendationMessage).toBeAttached({ timeout: 10000 });

  // WhatsApp's virtualized list can re-render/auto-scroll mid-click as new
  // messages stream in, detaching the just-opened context menu. Retry the whole
  // right-click -> Reply sequence on that transient failure instead of failing.
  async function replyToRecommendation() {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await recommendationMessage.scrollIntoViewIfNeeded();
        await recommendationMessage.click({ button: 'right' });
        await replyMenuItem.click({ timeout: 5000 });
        return;
      } catch (err) {
        if (attempt === 3) throw err;
        await page.keyboard.press('Escape').catch(() => {});
        await delay(1500);
      }
    }
  }

  // --- Branch 1: INTERESTED -- reply asking for more info on the recommended helper ---
  await replyToRecommendation();
  await delay(1000);

  await messageInput.click();
  await messageInput.fill('I want more info');
  await page.keyboard.press('Enter');
  await delay(45000); // wait for full bio + interview offer

  // --- Branch 2: INTERVIEW -- ask to arrange an interview with the same helper ---
  await replyToRecommendation();
  await delay(1000);

  await messageInput.click();
  await messageInput.fill('I want to interview her');
  await page.keyboard.press('Enter');
  await delay(45000); // bot replies with either identity confirmation or date/time request

  // --- Confirm identity (SUGGESTED match gate: "Is this the candidate...?") ---
  await messageInput.click();
  await messageInput.fill('yes');
  await page.keyboard.press('Enter');
  await delay(30000);

  // --- Provide date & time -> COLLECTDATETIME -> COMPLETED ---
  await messageInput.click();
  await messageInput.fill('10 May 4pm');
  await page.keyboard.press('Enter');
  await delay(45000); // bot confirms it is securing the interview slot

  // --- Branch 3: MORE_MAID_RECOMMENDATION_REQUEST -- ask for other candidates ---
  await messageInput.click();
  await messageInput.fill('Any other candidates?');
  await page.keyboard.press('Enter');
  await delay(30000);

  // --- Branch 4: CHANGEREQUIREMENT -- explicit update with detail ---
  await messageInput.click();
  await messageInput.fill('Change nationality to Filipino');
  await page.keyboard.press('Enter');
  await delay(30000);

  // --- Branch 5: STOP_SENDING -- opt out of further recommendations ---
  await messageInput.click();
  await messageInput.fill('Please stop sending');
  await page.keyboard.press('Enter');
  await delay(30000);
});
