(async () => {
  const CLICK_WAIT = 500;
  const BACK_WAIT = 800;
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  let total = 0;

  while (true) {
    const offer = document.querySelector('[role="button"][data-testid="commerce-tile"]');
    if (!offer) {
      console.log('✅ No more offers found — done.');
      break;
    }

    offer.scrollIntoView({ behavior: 'instant', block: 'center' });
    offer.click();
    console.log(`Added offer #${++total}`);

    await sleep(CLICK_WAIT);
    window.history.back();
    await sleep(BACK_WAIT);
  }

  console.log(`🎉 Finished! Total offers added: ${total}`);
})();
