# add-chase-offers

A small browser automation snippet that repeatedly clicks the first offer tile on a Chase offers grid, then navigates back, until no offers remain.

Files
- [consolescript.js](consolescript.js) — main snippet to paste into a page console.
  - Timing constants in the snippet:
    - [`CLICK_WAIT`](consolescript.js) — pause after clicking an offer, before going back.
    - [`BACK_WAIT`](consolescript.js) — pause after navigating back, before checking for the next offer.

Quick start
1. Open the target Chase offers page in your browser.
2. Open DevTools → Console.
3. Paste the contents of [consolescript.js](consolescript.js) and press Enter.
   - The script will repeatedly click the first offer tile, wait, go back, and repeat until no offer tiles are found.

Notes & safety
- The script performs DOM queries, clicks, and browser navigation (`history.back()`). Run only on pages you trust.
- Tweak `CLICK_WAIT`/`BACK_WAIT` in [consolescript.js](consolescript.js) if the page is slower or faster than expected.