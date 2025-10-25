(async () => {
  const POST_CLICK_WAIT = 1800;
  const POST_BACK_WAIT = 2000;
  const OFFER_LOAD_TIMEOUT = 5000;
  const MAX_BACK_RETRIES = 3;
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // Wait for offers to appear
  async function waitForOffers(timeout = OFFER_LOAD_TIMEOUT) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const grid = document.querySelector('[data-testid="categoryOffersSectionContainer"]');
      const offers = document.querySelectorAll('[role="button"][data-testid="commerce-tile"]');
      if (grid && offers.length > 0) return true;
      await sleep(200);
    }
    return false;
  }

  // Wait for overlay/modal
  async function waitForOverlay(timeout = 3000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const hasOverlay =
        document.querySelector('.modal') ||
        document.querySelector('[role="dialog"]') ||
        document.querySelector('.overlay') ||
        !document.querySelector('[data-testid="categoryOffersSectionContainer"]');
      if (hasOverlay) return true;
      await sleep(100);
    }
    return false;
  }

  async function ensureBackToOffers() {
    // Try multiple ways to get back to the main grid
    for (let attempt = 1; attempt <= MAX_BACK_RETRIES; attempt++) {
      const grid = document.querySelector('[data-testid="categoryOffersSectionContainer"]');
      const offers = document.querySelectorAll('[role="button"][data-testid="commerce-tile"]');
      if (grid && offers.length > 0) {
        console.log("✅ Confirmed: back on main offers grid");
        return true;
      }

      console.log(`↩️ Not back on grid (attempt ${attempt}/${MAX_BACK_RETRIES}), going back...`);
      window.history.back();
      await sleep(POST_BACK_WAIT);
    }

    const gridCheck = document.querySelector('[data-testid="categoryOffersSectionContainer"]');
    if (gridCheck) {
      console.log("⚠️ Back to offers grid detected after retries.");
      return true;
    }

    console.error("❌ Failed to return to main offers grid after retries — reloading page...");
    window.location.reload();
    await sleep(5000);

    // Wait for offers to load after reload
    const loaded = await waitForOffers();
    if (loaded) {
      console.log("✅ Offers grid reloaded successfully.");
      return true;
    } else {
      console.error("❌ Reload failed to bring back offers grid.");
      return false;
    }
  }

  await waitForOffers();

  let total = 0;
  let emptyAttempts = 0;

  while (true) {
    const offer = Array.from(
      document.querySelectorAll('[role="button"][data-testid="commerce-tile"]')
    ).find(el => el.querySelector('mds-icon[type="ico_add_circle"]'));

    if (!offer) {
      emptyAttempts++;
      console.log(`No addable offers found (attempt ${emptyAttempts}/3)`);

      if (emptyAttempts >= 3) {
        console.log('✅ No more addable offers found — done.');
        break;
      }

      await sleep(2000);
      continue;
    }

    emptyAttempts = 0;
    offer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    console.log(`Adding offer #${++total}...`);
    offer.click();

    await waitForOverlay();
    await sleep(POST_CLICK_WAIT);

    // Try to find close/back button
    let backBtn = Array.from(document.querySelectorAll('button, [role="button"], a')).find(el => {
      const text = (el.innerText || '').trim().toLowerCase();
      return (
        text === 'x' ||
        text === '×' ||
        text === 'close' ||
        text === 'back' ||
        text.includes('return to offers') ||
        text.includes('view all offers') ||
        text.includes('done')
      );
    });

    if (!backBtn) {
      backBtn =
        document.querySelector('[aria-label*="lose"]') ||
        document.querySelector('[aria-label*="ack"]') ||
        document.querySelector('[aria-label*="ismiss"]');
    }
    if (!backBtn) {
      backBtn =
        document.querySelector('.close-button') ||
        document.querySelector('.modal-close') ||
        document.querySelector('[class*="close"]') ||
        document.querySelector('[id*="close"]');
    }

    if (backBtn) {
      console.log(
        `→ Clicking: "${backBtn.innerText || backBtn.getAttribute('aria-label') || 'close button'}"`
      );
      backBtn.click();
      await sleep(POST_BACK_WAIT);
    } else {
      console.log('⚠️ No back/close button detected — forcing browser back');
      window.history.back();
      await sleep(POST_BACK_WAIT);
    }

    // ✅ Ensure we’re actually back to the offers grid (reload if necessary)
    const backSuccess = await ensureBackToOffers();
    if (!backSuccess) {
      console.error('❌ Could not recover back to offers grid even after reload. Stopping script.');
      break;
    }

    await sleep(500);
  }

  console.log(`🎉 Finished! Total offers added: ${total}`);
})();
