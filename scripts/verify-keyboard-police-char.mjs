#!/usr/bin/env node
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const componentPath = join(__dirname, '../src/uni_modules/uview-plus/components/u-car-keyboard/u-car-keyboard.vue');
const content = readFileSync(componentPath, 'utf-8');

// Extract the areaList data array
const areaListMatch = content.match(/areaList\(\)\s*\{[\s\S]*?let data = \[([\s\S]*?)\];/);
if (!areaListMatch) {
  console.error('❌ Failed to find areaList in component');
  process.exit(1);
}

const dataContent = areaListMatch[1];
const characters = dataContent.match(/'([^']+)'/g).map(s => s.slice(1, -1));

console.log(`Found ${characters.length} characters in car keyboard areaList`);
console.log('Characters:', characters.join(', '));

// Check for '警' character
if (characters.includes('警')) {
  console.log('✓ Police character "警" is present in the keyboard');
} else {
  console.error('❌ Police character "警" is missing from the keyboard');
  process.exit(1);
}

// Verify the array slicing matches the data length
const sliceMatch = content.match(/tmp\[3\]\s*=\s*data\.slice\(30,\s*(\d+)\)/);
if (sliceMatch) {
  const lastIndex = parseInt(sliceMatch[1]);
  if (lastIndex === characters.length) {
    console.log(`✓ Array slicing is correct: slice(30, ${lastIndex})`);
  } else {
    console.error(`❌ Array slicing mismatch: expected slice(30, ${characters.length}) but found slice(30, ${lastIndex})`);
    process.exit(1);
  }
}

console.log('\n✅ All checks passed for issue #555');
