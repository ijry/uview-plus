# Swiper Vertical Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expose native `swiper.vertical` on `u-swiper` so vertical carousels can be configured without forking the component.

**Architecture:** Keep the public surface minimal and mirror `uview-ultra`: add a boolean prop defaulting to `false`, pass it through to the underlying uni-app `<swiper>`, and lock the contract with a focused Node verification script plus demo/type/docs updates.

**Tech Stack:** Vue SFC, uni-app, Node ESM verification script, Markdown docs.

## Global Constraints

- Commit messages must use Chinese.
- Commit messages must include both `head` and `body`.
- Default remains horizontal (`vertical: false`).
- Do not bump package version or publish.
- Do not merge branches.
- Ignore pre-existing untracked paths `.claude/` and `src/pages/componentsA/icon/icon.vue` if present.

## File Map

- Create: `scripts/verify-swiper-vertical.mjs`
- Modify: `package.json`
- Modify: `src/uni_modules/uview-plus/components/u-swiper/swiper.js`
- Modify: `src/uni_modules/uview-plus/components/u-swiper/props.js`
- Modify: `src/uni_modules/uview-plus/components/u-swiper/u-swiper.vue`
- Modify: `src/uni_modules/uview-plus/types/comps/swiper.d.ts`
- Modify: `src/pages/componentsC/swiper/swiper.nvue`
- Modify: `src/uni_modules/uview-plus/changelog.md`

---

### Task 1: Add Vertical Verification

**Files:**
- Create: `scripts/verify-swiper-vertical.mjs`
- Modify: `package.json`

- [ ] **Step 1: Create the verification script**
- [ ] **Step 2: Register `verify:swiper-vertical`**
- [ ] **Step 3: Run the script and confirm it fails before implementation**

### Task 2: Implement Vertical Prop Passthrough

**Files:**
- Modify: `src/uni_modules/uview-plus/components/u-swiper/swiper.js`
- Modify: `src/uni_modules/uview-plus/components/u-swiper/props.js`
- Modify: `src/uni_modules/uview-plus/components/u-swiper/u-swiper.vue`
- Modify: `src/uni_modules/uview-plus/types/comps/swiper.d.ts`

- [ ] **Step 1: Add default and prop**
- [ ] **Step 2: Bind `:vertical="vertical"` on native swiper**
- [ ] **Step 3: Update TypeScript definitions and component docs comments**
- [ ] **Step 4: Re-run verification for component/type contracts**

### Task 3: Demo And Changelog

**Files:**
- Modify: `src/pages/componentsC/swiper/swiper.nvue`
- Modify: `src/uni_modules/uview-plus/changelog.md`

- [ ] **Step 1: Add a vertical demo block**
- [ ] **Step 2: Document the change under the next changelog section**
- [ ] **Step 3: Run full verification script and commit**
