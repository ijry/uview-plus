# Slider Height Issue #1046 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix uview-plus slider `height` initialization, prevent regression, and publish patch version 3.8.94 safely.

**Architecture:** Keep the public API and component structure unchanged. Add a focused Node verifier that executes the real mounted size-initialization snippet, then correct the single bad assignment and publish from a clean isolated worktree so unrelated untracked plugin files cannot enter the package.

**Tech Stack:** Vue SFC, uni-app, Node ESM assertions, PowerShell, Git Bash, DCloud plugin publish script.

## Global Constraints

- All Git commit messages must use Chinese and include both head and body.
- Work only in `D:/Repos/xyito/open/uview-plus-issue-1046` until the final fast-forward merge.
- Do not add, move, or delete the user's untracked `.claude/` or `src/uni_modules/uview-plus/components/u-tabs-pro/` paths in the main worktree.
- Preserve `height` as the legacy-compatible thickness override and `size` as its empty-value fallback.
- Do not refactor slider layout, touch handling, vertical mode, or reactive semantics.
- Do not modify or publish uview-ultra 4.x because its Vue and UVue sliders do not contain this defect.
- Do not update either documentation repository because this is a normal implementation fix with no API change.
- Use `C:/Program Files/Git/bin/bash.exe`, never the Windows `bash` command that resolves to WSL.
- Run one dry-run before publishing; execute the actual 3.8.94 publish command exactly once and never retry without user confirmation.

---

### Task 1: Add Slider Height Regression Verification

**Files:**
- Create: `scripts/verify-slider-height.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: npm script `verify:slider-height`.
- Produces: verification command `npm run verify:slider-height`.
- Consumes: the mounted thickness initialization in `src/uni_modules/uview-plus/components/u-slider/u-slider.vue`.

- [ ] **Step 1: Create the failing verifier**

Create `scripts/verify-slider-height.mjs` with this content:

```js
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const read = filePath => readFileSync(resolve(root, filePath), 'utf8')

const sliderVue = read('src/uni_modules/uview-plus/components/u-slider/u-slider.vue')
const sliderDemo = read('src/pages/componentsB/slider/slider.nvue')
const packageJson = JSON.parse(read('package.json'))

assert.equal(
    packageJson.scripts['verify:slider-height'],
    'node scripts/verify-slider-height.mjs',
    'expected package.json to expose verify:slider-height'
)

const sizeInitialization = sliderVue.match(
    /if\s*\(this\.height\s*!=\s*''\)\s*\{\s*this\.sizeLocal\s*=\s*[^\r\n]+\s*\}\s*else\s*\{\s*this\.sizeLocal\s*=\s*this\.size\s*\}/
)
assert.ok(sizeInitialization, 'expected mounted to initialize sizeLocal from height or size')

const initializeSliderSize = new Function(sizeInitialization[0])
const heightContext = { height: '4px', size: '2px', sizeLocal: '2px' }
assert.doesNotThrow(
    () => initializeSliderSize.call(heightContext),
    'non-empty height must not reference an undeclared variable'
)
assert.equal(heightContext.sizeLocal, '4px', 'height must override size')

const sizeContext = { height: '', size: '6px', sizeLocal: '2px' }
initializeSliderSize.call(sizeContext)
assert.equal(sizeContext.sizeLocal, '6px', 'empty height must fall back to size')

assert.doesNotMatch(
    sliderVue,
    /this\.sizeLocal\s*=\s*val\b/,
    'slider mounted logic must not assign undeclared val'
)

for (const height of ['20px', '4px', '2px']) {
    assert.match(sliderDemo, new RegExp(`height="${height}"`), `expected slider demo height=${height}`)
}

console.log('slider height assertions passed')
```

- [ ] **Step 2: Register the npm command**

Add this script entry immediately after `verify:slider-decimal-step` in `package.json`:

```json
"verify:slider-height": "node scripts/verify-slider-height.mjs"
```

- [ ] **Step 3: Run the verifier and confirm red state**

Run:

```powershell
npm run verify:slider-height
```

Expected: FAIL because executing the real non-empty `height` branch raises `ReferenceError: val is not defined`.

- [ ] **Step 4: Commit the regression verifier**

```powershell
git add package.json scripts/verify-slider-height.mjs
git commit -m "test: 增加 slider height 回归校验" -m "执行组件 mounted 中真实的厚度初始化分支，覆盖 height 优先、size 回退和未声明变量回归，为 issue #1046 修复建立红灯测试。"
```

### Task 2: Fix Slider Height Initialization

**Files:**
- Modify: `src/uni_modules/uview-plus/components/u-slider/u-slider.vue:183`

**Interfaces:**
- Consumes: public props `height` and `size`.
- Produces: `sizeLocal = height` when `height` is non-empty, otherwise `sizeLocal = size`.

- [ ] **Step 1: Apply the minimal root-cause fix**

Replace:

```js
this.sizeLocal = val
```

with:

```js
this.sizeLocal = this.height
```

- [ ] **Step 2: Run focused slider verification**

```powershell
npm run verify:slider-height
npm run verify:slider-decimal-step
```

Expected: both commands PASS with `slider height assertions passed` and `slider decimal step assertions passed`.

- [ ] **Step 3: Commit the component fix**

```powershell
git add src/uni_modules/uview-plus/components/u-slider/u-slider.vue
git commit -m "fix: 修复 slider height 初始化报错" -m "将 mounted 中误用的未声明变量 val 改为组件 height 属性，恢复旧 height 参数优先并保留空值时使用 size 的兼容行为，修复 issue #1046。"
```

### Task 3: Run Final Code Validation

**Files:**
- Read: `scripts/verify-slider-height.mjs`
- Read: `scripts/verify-slider-decimal-step.mjs`
- Read: `src/uni_modules/uview-plus/components/u-slider/u-slider.vue`
- Read: `src/uni_modules/uview-plus/package.json`

**Interfaces:**
- Consumes: Tasks 1 and 2.
- Produces: validation evidence before release.

- [ ] **Step 1: Reuse the installed dependency tree safely**

If the isolated worktree has no `node_modules`, verify the main dependency directory exists and create an ignored junction:

```powershell
git check-ignore node_modules
if (!(Test-Path node_modules)) {
    New-Item -ItemType Junction -Path node_modules -Target D:\Repos\xyito\open\uview-plus\node_modules
}
```

- [ ] **Step 2: Run targeted and broader checks**

```powershell
npm run verify:slider-height
npm run verify:slider-decimal-step
npm run type-check
npm run build:h5
```

Expected: both focused verifiers PASS. `type-check` and H5 build should PASS; if either fails only in unrelated pre-existing files, record the first error and do not modify unrelated code.

- [ ] **Step 3: Inspect release scope**

```powershell
git diff --check
git status --short --branch
git status --short --untracked-files=all -- src/uni_modules/uview-plus
```

Expected: the branch is ahead only by the design, plan, test, and fix commits; the plugin directory has no untracked files.

### Task 4: Publish Uview Plus 3.8.94

**Files:**
- Create ignored file: `cachePath/notes.md`
- Create ignored file: `cachePath/publish-3.8.94.started`
- Create ignored file: `cachePath/publish-3.8.94.pid`
- Create ignored file: `cachePath/publish-3.8.94.log`
- Modify by publish script: `src/uni_modules/uview-plus/package.json`
- Modify by publish script: `src/uni_modules/uview-plus/changelog.md`

**Interfaces:**
- Consumes: `D:/Repos/xyito/config/hx-plugin-publish.sh` and HBuilderX login state.
- Produces: DCloud plugin version `uview-plus@3.8.94` plus local version and changelog changes.

- [ ] **Step 1: Create the UTF-8 release notes**

Write `cachePath/notes.md` without a version header:

```md
fix: 修复 slider 设置 height 时初始化报错

- 修复非空 height 触发 `ReferenceError: val is not defined` 的问题
- 保留 height 优先、未设置时回退 size 的滑块厚度兼容行为
- 增加 slider height mounted 初始化回归校验，覆盖 issue #1046
```

- [ ] **Step 2: Run the required dry-run once**

```powershell
& "C:\Program Files\Git\bin\bash.exe" -lc 'cd /d/Repos/xyito/open/uview-plus-issue-1046 && bash /d/Repos/xyito/config/hx-plugin-publish.sh /d/Repos/xyito/open/uview-plus-issue-1046/src/uni_modules/uview-plus --dry-run --bump patch --notes-file /d/Repos/xyito/open/uview-plus-issue-1046/cachePath/notes.md'
```

Expected: validation passes, `will_publish.version` is `3.8.94`, and no tracked file changes are created.

- [ ] **Step 3: Start the actual publish exactly once in Git Bash background**

```powershell
& "C:\Program Files\Git\bin\bash.exe" -lc 'set -e; cd /d/Repos/xyito/open/uview-plus-issue-1046; mkdir -p cachePath; test ! -e cachePath/publish-3.8.94.started; date -Iseconds > cachePath/publish-3.8.94.started; nohup bash /d/Repos/xyito/config/hx-plugin-publish.sh /d/Repos/xyito/open/uview-plus-issue-1046/src/uni_modules/uview-plus --bump patch --notes-file /d/Repos/xyito/open/uview-plus-issue-1046/cachePath/notes.md > cachePath/publish-3.8.94.log 2>&1 < /dev/null & publish_pid=$!; echo "$publish_pid" > cachePath/publish-3.8.94.pid; echo "STARTED $publish_pid"'
```

Do not execute this command a second time. The `.started` marker must block accidental repetition.

- [ ] **Step 4: Poll the background process and inspect the log**

```powershell
& "C:\Program Files\Git\bin\bash.exe" -lc 'cd /d/Repos/xyito/open/uview-plus-issue-1046; pid=$(cat cachePath/publish-3.8.94.pid); if kill -0 "$pid" 2>/dev/null; then echo RUNNING; else echo DONE; fi; tail -n 80 cachePath/publish-3.8.94.log'
```

Repeat only the read-only poll until it prints `DONE`. Expected final log: `发布完成: uview-plus@3.8.94`.

- [ ] **Step 5: Verify local release metadata**

```powershell
(Get-Content src/uni_modules/uview-plus/package.json -Raw | ConvertFrom-Json).version
Get-Content src/uni_modules/uview-plus/changelog.md -TotalCount 12
git diff --check
git status --short
```

Expected: version is `3.8.94`; changelog starts with the supplied notes; only package and changelog are newly modified.

### Task 5: Commit, Merge, Push, And Close The Issue

**Files:**
- Modify: Git history for `fix/issue-1046-slider-height` and `3.x`.
- Remote: `origin/3.x`.
- Remote issue: `ijry/uview-plus#1046`.

**Interfaces:**
- Consumes: successful DCloud release and local release metadata.
- Produces: pushed `3.x` containing the fix and release commit; closed issue with release reference.

- [ ] **Step 1: Commit release metadata**

```powershell
git add src/uni_modules/uview-plus/package.json src/uni_modules/uview-plus/changelog.md
git commit -m "fix: 发布 uview-plus 3.8.94" -m "发布 issue #1046 的 slider height 初始化修复，更新插件版本号与 changelog，并记录 height 兼容行为和回归校验。"
```

- [ ] **Step 2: Verify the release branch**

```powershell
git status --short --branch
git log --oneline --decorate origin/3.x..HEAD
```

Expected: the worktree is clean except ignored release artifacts, and the branch contains only the design, plan, verifier, fix, and release commits.

- [ ] **Step 3: Fast-forward the main 3.x worktree**

```powershell
git -C D:\Repos\xyito\open\uview-plus merge --ff-only fix/issue-1046-slider-height
```

Expected: merge succeeds without staging the existing untracked `.claude/` or `u-tabs-pro/` paths.

- [ ] **Step 4: Push and verify the remote branch**

```powershell
git -C D:\Repos\xyito\open\uview-plus push origin 3.x
git -C D:\Repos\xyito\open\uview-plus status --short --branch
git ls-remote origin refs/heads/3.x
```

Expected: `origin/3.x` points at the local release commit; the two pre-existing untracked paths remain untouched.

- [ ] **Step 5: Comment on and close issue #1046**

```powershell
gh issue comment 1046 --repo ijry/uview-plus --body "已在 uview-plus 3.8.94 修复：slider 设置非空 height 时不再引用未声明变量，并保留 height 优先、size 回退的兼容行为；同时增加了回归校验。uview-ultra 4.x 已核查，其 Vue/UVue 实现直接使用 height，不受此问题影响。"
gh issue close 1046 --repo ijry/uview-plus --reason completed
```

- [ ] **Step 6: Produce the final report**

Report the released version, focused verification results, type-check/build results, pushed commit, issue state, v4 audit conclusion, and the untouched user paths in the main worktree.

## Self-Review

- Spec coverage: root cause, legacy compatibility, regression test, v4 non-impact, isolated release, patch bump, commit/push, and issue closure are all mapped to tasks.
- Placeholder scan: the plan contains no unresolved placeholder instructions.
- Type consistency: the verifier command, script name, branch name, version, notes file, marker, PID, and log paths are consistent across tasks.
