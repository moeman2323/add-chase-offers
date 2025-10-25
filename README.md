# add-chase-offers

A small browser automation snippet that scans a Chase offers grid, clicks "add" on detected offers, closes the resulting overlay, and returns to the offers grid.

Files
- [console script](console%20script) — main snippet to paste into a page console.
  - Key functions and constants in the snippet:
    - [`waitForOffers`](console%20script)
    - [`waitForOverlay`](console%20script)
    - [`ensureBackToOffers`](console%20script)
    - [`POST_CLICK_WAIT`](console%20script)
    - [`POST_BACK_WAIT`](console%20script)
    - [`OFFER_LOAD_TIMEOUT`](console%20script)
    - [`MAX_BACK_RETRIES`](console%20script)

Quick start
1. Open the target Chase offers page in your browser.
2. Open DevTools → Console.
3. Paste the contents of the [console script](console%20script) and press Enter.
   - The script will look for offer tiles, click add, handle overlays, and try to return to the offers grid automatically.

Notes & safety
- The script performs DOM queries, clicks, and navigation (history.back / reload). Run only on pages you trust.
- Tweak the timing constants (listed above) in the [console script](console%20script) if the page is slower or faster.
- This repository only contains the single automation snippet and this README. See [README.md](README.md) for this file.