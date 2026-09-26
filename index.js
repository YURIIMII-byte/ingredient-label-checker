#!/usr/bin/env node
// ingredient-label-checker
// Usage: node index.js <path-to-photo.jpg>
import { existsSync, writeFileSync } from 'node:fs';
import { loadModel, ocr, completion, unloadModel, OCR_LATIN, LLAMA_3_2_1B_INST_Q4_0 } from '@qvac/sdk';

const imagePath = process.argv[2];

if (!imagePath || !existsSync(imagePath)) {
  console.error('Usage: node index.js <path-to-photo.jpg>');
  process.exit(1);
}

console.log('Loading OCR model on-device...');
const ocrModelId = await loadModel({ modelSrc: OCR_LATIN, modelConfig: { langList: ['en'] } });

console.log(`Reading ${imagePath}...`);
const { blocks } = ocr({ modelId: ocrModelId, image: imagePath, options: { paragraph: true } });
const result = await blocks;
const rawText = result.map((b) => b.text).join('\n');
await unloadModel({ modelId: ocrModelId });

console.log('\nRaw OCR text:');
console.log(rawText);

console.log('\nLoading language model on-device...');
const llmId = await loadModel({ modelSrc: LLAMA_3_2_1B_INST_Q4_0 });

const prompt = "The text below was OCR-scanned from a food ingredient list. Check it against common diets (vegan, vegetarian, gluten-free, dairy-free) and output a markdown list of each diet as OK, Not OK, or Unclear with the ingredient responsible. Output only the markdown." + '\n\n' + rawText;

const { tokenStream } = completion({ modelId: llmId, history: [{ role: 'user', content: prompt }], stream: true });

let output = '';
console.log('\nResult:\n');
for await (const token of tokenStream) {
  process.stdout.write(token);
  output += token;
}
console.log();

writeFileSync("ingredient-check.md", output.trim() + '\n');
console.log('\nSaved to ingredient-check.md');

await unloadModel({ modelId: llmId });
