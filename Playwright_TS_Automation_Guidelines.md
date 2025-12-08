# Playwright + TypeScript Automation Guidelines

Author: Lead Automation Engineer  
Audience: Automation engineers, SDETs, reviewers, and contributors

---

## 1. Purpose & Philosophy

This document defines how we design, implement, and review Playwright + TypeScript tests in this project.

Key principles:

- **Fast, deterministic tests** over wide-but-flaky coverage.
- **Readable, structured code** over clever one-liners.
- **Page Objects and fixtures first**, raw Playwright calls when truly needed.
- **Prettier is the authority** for formatting; humans focus on logic and design.
- **Comments explain intent**, not the obvious.

---

## 2. Tooling & Formatting (Prettier, ESLint)

### 2.1 Prettier

- Prettier is used to format:
  - TypeScript / JavaScript files (`*.ts`, `*.tsx`)
  - Markdown docs (`*.md`)
- Do not manually align code; let Prettier handle formatting.
- CI or pre-commit hooks should fail on unformatted code.

Example `.prettierrc` (simple baseline):

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100
}
```

### 2.2 ESLint

- ESLint with TypeScript rules is mandatory.
- Goals:
  - No unused imports/variables
  - No implicit `any` (unless explicitly justified)
  - Consistent style and error handling

Example `.eslintrc` snippet:

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"]
}
```

---

## 3. Project Structure

Recommended layout (adapt to existing conventions if needed):

```text
tests/
  e2e/
    login.spec.ts
    checkout.spec.ts
  fixtures/
    auth.fixture.ts
pages/
  LoginPage.ts
  DashboardPage.ts
utils/
  apiClient.ts
  testDataBuilder.ts
config/
  playwright.config.ts
test-data/
  users.json
```

---

## 4. Test Design

### 4.1 Basic Pattern

Each test:

- Uses Playwright fixtures to get `page` or a higher-level fixture (e.g. `loggedInPage`).
- Uses Page Objects to perform actions.
- Keeps assertions in the test body.

**Example: simple login test**

```ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Login', () => {
  test('allows login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const validUser = { email: 'user@example.com', password: 'Password123!' };

    await loginPage.goto();
    await loginPage.login(validUser);

    await expect(page.getByTestId('dashboard-root')).toBeVisible();
  });
});
```

### 4.2 Fixtures Example (Authenticated Context)

```ts
// tests/fixtures/auth.fixture.ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

type AuthFixtures = {
  loggedInPage: import('@playwright/test').Page;
};

export const test = base.extend<AuthFixtures>({
  loggedInPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    const validUser = { email: 'user@example.com', password: 'Password123!' };

    await loginPage.goto();
    await loginPage.login(validUser);

    // Ensure we are on dashboard
    await page.waitForURL('**/dashboard');
    await use(page);
  },
});

export const expect = test.expect;
```

Usage:

```ts
import { test, expect } from '../fixtures/auth.fixture';
import { DashboardPage } from '../../pages/DashboardPage';

test('shows user greeting on dashboard', async ({ loggedInPage }) => {
  const dashboardPage = new DashboardPage(loggedInPage);
  await expect(dashboardPage.userGreeting).toHaveText('Welcome back');
});
```

---

## 5. Page Object Model (POM)

### 5.1 LoginPage Example

```ts
// pages/LoginPage.ts
import type { Page, Locator } from '@playwright/test';

/**
 * Page Object representing the login page.
 * Encapsulates actions and locators related to login.
 */
export class LoginPage {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly signInButton: Locator;
  private readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
    this.errorMessage = page.getByTestId('login-error');
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  /**
   * Logs in using the provided user credentials.
   */
  async login(user: { email: string; password: string }): Promise<void> {
    await this.emailInput.fill(user.email);
    await this.passwordInput.fill(user.password);
    await this.signInButton.click();
  }

  /**
   * Returns the error message locator for assertions.
   */
  getErrorMessage(): Locator {
    return this.errorMessage;
  }
}
```

### 5.2 DashboardPage Example

```ts
// pages/DashboardPage.ts
import type { Page, Locator } from '@playwright/test';

/**
 * Page Object for the user dashboard.
 */
export class DashboardPage {
  readonly userGreeting: Locator;

  constructor(private readonly page: Page) {
    this.userGreeting = page.getByTestId('user-greeting');
  }

  async goto(): Promise<void> {
    await this.page.goto('/dashboard');
  }
}
```

**Rules:**

- Page Objects encapsulate locators and actions.
- Avoid placing assertions in Page Objects; expose locators or data for tests to assert on.

---

## 6. Locator Strategy

Preferred order:

1. `getByTestId('...')` using `data-testid` attributes
2. `getByRole`, `getByLabel`, `getByText` with clear accessible names
3. Simple CSS selectors

**Good examples:**

```ts
page.getByTestId('checkout-button');
page.getByRole('button', { name: 'Place order' });
page.getByLabel('Email');
```

**Bad examples:**

```ts
page.locator('.btn.primary:nth-child(3)');
page.locator('div > span > button');
```

Ensure the app exposes stable test IDs for critical elements.

---

## 7. Synchronization & Waiting

- Rely on Playwright auto-waiting wherever possible.
- Avoid `page.waitForTimeout()` unless absolutely necessary and documented.

**Good:**

```ts
await expect(page.getByTestId('notification-success')).toBeVisible();
```

**Temporary workaround (with comment):**

```ts
// TEMP: Replace with wait for status badge when backend is fixed (TASK-5678)
await page.waitForTimeout(2000);
```

Use assertions like:

- `toBeVisible`
- `toBeHidden`
- `toHaveText`
- `toHaveURL`
- `toHaveAttribute`
- `toHaveCount`

---

## 8. Commenting & Documentation Standards

Comments and docblocks are part of the API of the test code.

### 8.1 When to Comment

- Explain **why** a particular approach is used.
- Document **temporary hacks** and refer to tickets.
- Explain non-obvious **domain rules** being validated.

**Example:**

```ts
// Some tenants still use the legacy billing page (TASK-3421).
// Once migration is complete, remove this branch.
if (tenant.isLegacy) {
  await legacyBillingPage.open();
} else {
  await billingPage.open();
}
```

### 8.2 When Not to Comment

- Do not comment obvious code:

```ts
// Click the sign in button
await this.signInButton.click();
```

- Do not keep large commented-out blocks without explanation.

### 8.3 Doc Comments

- Exported functions/classes should have a brief doc comment explaining their intent.

```ts
/**
 * Creates a new test user via API and returns its credentials.
 * Intended for non-production environments only.
 */
export async function createTestUser() {
  // ...
}
```

---

## 9. Correctness

- Each test should validate **one main behavior**.
- Assertions must be meaningful and robust.

**Example:**

```ts
await expect(loginPage.getErrorMessage()).toHaveText('Invalid email or password');
```

Avoid vague assertions or overly generic checks.

---

## 10. Readability

- Test names must describe behavior, not implementation:

  - `applies discount code to the cart` ✅
  - `discount test 1` ❌

- Tests should read like a story with minimal boilerplate.

**Example:**

```ts
test('applies discount code to the cart', async ({ page }) => {
  const cartPage = new CartPage(page);

  await cartPage.goto();
  await cartPage.addItem('Sample Item');
  await cartPage.applyDiscount('DISCOUNT10');

  await expect(cartPage.total).toHaveText('$90.00');
});
```

---

## 11. Maintainability

- Apply DRY:
  - Shared flows → fixtures or helper functions
  - Shared UI interactions → Page Objects
- Split large Page Objects into smaller ones by domain area if needed.
- Update tests when the business flow changes; do not accumulate legacy branches.

---

## 12. Performance

- Let Playwright run tests in parallel by default.
- Use `projects` in `playwright.config.ts` for browsers/envs instead of duplicating test logic.
- Avoid repeated logins if an authenticated fixture can be used.

Consider enabling:

- Traces and screenshots only on failure (especially in CI) to reduce noise and runtime.

---

## 13. Security

- Never hard-code secrets (tokens, passwords, API keys).
- Use environment variables or CI secret stores.
- Do not log sensitive payloads or PII.
- Test users/data must be non-production and anonymized.

---

## 14. Tests & Coverage Strategy

Use Playwright tests for:

- Critical user journeys (login, checkout, payments, account settings)
- Cross-service flows that require full stack

Avoid using Playwright for:

- Simple validation logic better suited to unit tests.

If a test becomes too broad, split it into focused tests, each verifying a specific outcome.

---

## 15. Code Review Checklist (Playwright + TypeScript)

Reviewers must confirm:

### Correctness
- [ ] Test validates a meaningful business behavior.
- [ ] Assertions are precise and stable.
- [ ] No reliance on test order or hidden state.

### Readability
- [ ] Test names describe behavior clearly.
- [ ] Test bodies are short and read like scenarios.
- [ ] Page Object methods are intention-revealing.

### Maintainability
- [ ] Shared flows are encapsulated in fixtures/helpers/Page Objects.
- [ ] Locators are not duplicated or overly complex.
- [ ] No obvious duplication of logic.

### Performance
- [ ] No unjustified `waitForTimeout`.
- [ ] Tests are suitable for parallel execution.
- [ ] No unnecessary navigations or logins.

### Security
- [ ] No secrets, tokens, or PII in code or logs.

### Comments & Documentation
- [ ] Non-obvious logic is commented with intent.
- [ ] Workarounds reference tickets and are clearly temporary.
- [ ] No unexplained commented-out blocks.

If any of these checks fail, the PR should be updated before approval.
