#!/usr/bin/env node

/**
 * Verification script for issue #875
 * Confirms that u-list-item watch handler guards against calling parent methods
 * before parent is properly initialized.
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('Verifying u-list-item parent race condition fix (issue #875)...\n');

const listItemPath = join(projectRoot, 'src/uni_modules/uview-plus/components/u-list-item/u-list-item.vue');
const content = readFileSync(listItemPath, 'utf-8');

let passed = true;
const issues = [];

// Check 1: Watch handler exists
if (!content.includes("'uList.innerScrollTop'")) {
  issues.push('❌ Watch handler for uList.innerScrollTop not found');
  passed = false;
} else {
  console.log('✓ Watch handler for uList.innerScrollTop exists');
}

// Check 2: Guard check exists before calling parent method
const guardPattern = /if\s*\(\s*!this\.parent\s*\|\|\s*!this\.parent\.updateOffsetFromChild\s*\)/;
if (!guardPattern.test(content)) {
  issues.push('❌ Missing guard check: if (!this.parent || !this.parent.updateOffsetFromChild)');
  passed = false;
} else {
  console.log('✓ Guard check exists to prevent calling undefined parent method');
}

// Check 3: Return statement after guard
const watchSection = content.match(/'uList\.innerScrollTop'\(n\)\s*{[\s\S]*?}\s*\/\/ #endif/);
if (watchSection) {
  const watchBody = watchSection[0];
  // Check that return appears after the guard check and before updateOffsetFromChild
  const guardIndex = watchBody.indexOf('!this.parent.updateOffsetFromChild');
  const returnIndex = watchBody.indexOf('return', guardIndex);
  const methodCallIndex = watchBody.indexOf('this.parent.updateOffsetFromChild(', returnIndex + 1);

  if (returnIndex === -1 || (methodCallIndex !== -1 && returnIndex > methodCallIndex)) {
    issues.push('❌ Guard check should return early before calling parent method');
    passed = false;
  } else {
    console.log('✓ Guard check returns early if parent not initialized');
  }
}

// Check 4: Parent initialization in created hook
if (!content.includes('created() {') || !content.includes('this.parent = {}')) {
  issues.push('❌ Parent initialization in created() hook not found');
  passed = false;
} else {
  console.log('✓ Parent initialized as empty object in created()');
}

console.log('');

if (passed) {
  console.log('✅ All checks passed - issue #875 is fixed');
  console.log('\nThe watch handler now safely guards against calling parent methods');
  console.log('before the component is fully mounted and parent is initialized.');
  process.exit(0);
} else {
  console.log('❌ Verification failed:\n');
  issues.forEach(issue => console.log('  ' + issue));
  process.exit(1);
}
