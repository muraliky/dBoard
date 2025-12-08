# How to Review PRs with GitHub Copilot

This guide explains how to use **GitHub Copilot in VS Code** to review pull requests against our automation standards.

## 1. Prerequisites

- VS Code
- GitHub Copilot & GitHub Copilot Chat extensions
- GitHub Pull Requests and Issues extension (recommended)
- This repo contains the following guideline documents:
  - `docs/automation/Selenium_QAF_Automation_Guidelines.md`
  - `docs/automation/Playwright_TS_Automation_Guidelines.md`

> Treat those guideline docs as the **source of truth** for automation quality.

---

## 2. Open the PR in VS Code

### Option A – Using GitHub PR Extension (preferred)

1. Open Command Palette:
   - `Ctrl+Shift+P` or `Cmd+Shift+P`
2. Run: `GitHub: Checkout Pull Request`
3. Select the PR you want to review.

### Option B – Manual Git

```bash
git fetch origin pull/<PR_NUMBER>/head:pr-<PR_NUMBER>
git checkout pr-<PR_NUMBER>
```

---

## 3. Always Open the Guideline File First

Before using Copilot, open the relevant guideline file:

- For **Selenium + QAF + Gradle** changes:  
  `docs/automation/Selenium_QAF_Automation_Guidelines.md`

- For **Playwright + TypeScript** changes:  
  `docs/automation/Playwright_TS_Automation_Guidelines.md`

Keep this tab open or pinned while reviewing. Copilot will use it as context when you reference it in your prompt.

---

## 4. Running a PR-Wide Review with Copilot

Open **Copilot Chat** in VS Code:

- Windows/Linux: `Ctrl+Shift+I`  
- macOS: `Cmd+Shift+I`

Then use one of these prompts.

### 4.1 Selenium + QAF PR Review Prompt

```text
Act as a senior automation reviewer.

Use `docs/automation/Selenium_QAF_Automation_Guidelines.md` as the standard.

Review all changes in this PR and:
- List violations or risks per file
- Focus on correctness, readability, maintainability, performance, security, and comments
- Generate ready-to-paste GitHub PR comments for each issue
```

### 4.2 Playwright + TypeScript PR Review Prompt

```text
Act as a senior automation reviewer.

Use `docs/automation/Playwright_TS_Automation_Guidelines.md` as the standard.

Review all changes in this PR and:
- Identify issues in tests, Page Objects, locators, and fixtures
- Check for misuse of waitForTimeout, brittle locators, and missing typing
- Generate GitHub-style review comments I can paste into the PR
```

You can run this at the start of your review to get an overview of potential issues.

---

## 5. File-by-File Review with Copilot

When you are focused on a specific file:

1. Open the file or its diff in VS Code.
2. Select the code block you want to review.
3. Open Copilot Chat and use a more targeted prompt.

### 5.1 Steps / Tests (BDD / Spec Files)

```text
Review this selected code against our automation guidelines.

- Does each test/step validate a single clear behavior?
- Is the business intent clear?
- Are assertions precise and meaningful?
- Are there any unnecessary sleeps, hard-coded URLs, or environment-specific logic?

Provide specific review comments I can use in the PR.
```

### 5.2 Page Objects (QAF or Playwright)

```text
Review this Page Object against our guidelines.

- Are responsibilities clear?
- Are locators defined and used correctly?
- Are methods intention-revealing?
- Are comments explaining WHY where needed?

List issues and give suggested GitHub PR comments.
```

### 5.3 Locators

```text
Review these locators against our locator strategy in the guideline file.

- Flag brittle or layout-dependent selectors.
- Suggest more stable alternatives (test IDs, roles, labels).
```

---

## 6. Comments & Documentation Review

Use Copilot to specifically check comments and docblocks:

```text
Review comments and docblocks in this selection.

- Are any comments redundant and just repeating the code?
- Are non-obvious decisions documented?
- Are temporary workarounds clearly explained and linked to tickets?

Suggest improvements and PR comments.
```

If Copilot points out missing or misleading comments, treat that as a **review issue**, not a nitpick.

---

## 7. What to Do with Copilot’s Output

- Use Copilot’s suggestions as **drafts**.
- Copy the relevant comment and paste it into the PR as:
  - An inline comment on a specific line, or
  - A general comment summarizing issues.

You are still the reviewer. If Copilot suggests something that doesn’t align with our guidelines or domain knowledge, ignore it.

---

## 8. Quick Manual Checks (Non-Negotiable)

Regardless of Copilot, always manually check:

### Selenium + QAF

- No `Thread.sleep()` without a clear comment and ticket reference.
- No hard-coded URLs or credentials.
- Locators are in `locator-repository` files, not Java code.
- Step libraries are thin; heavy logic lives in Page Objects or helpers.
- Public methods in Page Objects/steps have meaningful JavaDoc.

### Playwright + TypeScript

- No unjustified `page.waitForTimeout()`.
- Locators prefer `getByTestId`, `getByRole`, `getByLabel`.
- Page Objects do not contain assertions.
- Tests each focus on one main behavior.
- Types are properly used; no unexplained `any`.

If any of the above fail, the PR should not be approved until fixed.

---

## 9. Suggested Final PR Comments

When you approve:

```text
Reviewed using our automation guidelines and Copilot assistance.

Code follows our standards for POM, locators, comments, and test design.
No blocking issues found. Approved.
```

When you request changes:

```text
Reviewed using our automation guidelines and Copilot assistance.

Blocking issues found:
- Locator or POM guideline violations
- Missing or unclear comments/docblocks
- Potential flakiness (sleeps, brittle waits, or fragile locators)

Please align with:
- docs/automation/Selenium_QAF_Automation_Guidelines.md
- docs/automation/Playwright_TS_Automation_Guidelines.md

Update the PR and I’ll re-review.
```

---

## 10. Mindset

- The guideline files are the **contract**.
- Copilot is your **assistant**, not the decision maker.
- You are responsible for the final call on **quality and maintainability**.
