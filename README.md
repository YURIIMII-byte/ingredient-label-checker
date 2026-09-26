# ingredient-label-checker

OCRs a food ingredient list and flags items against your diet (vegan, gluten-free, etc.), on-device. Built with [Tether's QVAC SDK](https://github.com/tetherto/qvac) — the model runs on-device, so nothing leaves your machine.

## What it does

OCRs a food ingredient list and flags items against your diet (vegan, gluten-free, etc.), on-device.

**QVAC functions used:** `loadModel`, `ocr` and `completion`.

![ingredient-label-checker demo](demo.png)

## Why I built it

'Natural flavors' and 'whey powder' are hiding in places you'd never expect.

## Requirements

- Node.js >= 22
- `@qvac/sdk` `^0.19.0` (installed automatically via `npm install`)

## Install

```bash
git clone https://github.com/YURIIMII-byte/ingredient-label-checker.git
cd ingredient-label-checker
npm install
```

## Run

```bash
node index.js path/to/ingredients.jpg
```

See the comments at the top of `index.js` for the exact input this app expects. On first run, QVAC downloads the model it needs once and caches it locally; every run after that is fully offline.

## SDK version used

`@qvac/sdk` `0.19.1`

## License

MIT — see [LICENSE](LICENSE).
