# Selenium + Java Automation Guidelines (QAF + BDD)

Author: Lead Automation Engineer  
Audience: Automation engineers, SDETs, reviewers, and contributors

---

## 1. Purpose & Philosophy

This document defines how we write, structure, and review Selenium + Java automation in this repository using **QAF** (Qmetry Automation Framework) with BDD.

Non-negotiable principles:

- **Correct over clever.** Prefer predictable code over clever hacks.
- **Readable over concise.** Someone new to the project should understand tests without asking questions.
- **Stable over flaky.** Any test that fails intermittently is a bug and must be treated as such.
- **Comment with intent.** Comments must explain *why*, not restate *what* the code does.

This file is the standard reviewers use to approve or reject changes.

---

## 2. Project Structure (QAF-Oriented)

### 2.1 Recommended Layout

```text
src
 └─ test
     ├─ java
     │   └─ com.company.project
     │       ├─ steps/         # Step definitions / step libraries
     │       ├─ pages/         # Page Objects (QAF pages/components)
     │       ├─ hooks/         # Hooks, listeners
     │       └─ utils/         # Helpers, data builders, waits, etc.
     └─ resources
         ├─ scenarios/         # BDD scenarios (.bdd / .feature)
         ├─ locator-repository/# Locator property files
         ├─ testdata/          # Test data files
         └─ config/            # application.properties, qaf.properties, etc.
```

Root-level:

- `testng.xml` – TestNG suite definition (QAF integration)
- `build.gradle` / `settings.gradle` – Gradle configuration and project setup

### 2.2 Structural Rules

- **Scenarios** define business behavior.
- **Steps/step libraries** orchestrate flows and delegate to Page Objects.
- **Page Objects** encapsulate locators and Selenium/QAF interactions.
- Common flows (e.g. login, navigation) live in **step libraries/utils**, not duplicated in scenarios.

---

## 3. BDD with QAF (Scenarios & Steps)

### 3.1 Scenario Files (BDD)

Scenario files must be understandable by **non-technical stakeholders**.

**Rules:**

- Use **business language**, not low-level locator or driver details.
- Each `Scenario`/`Scenario Outline` represents **one main behavior**.
- Keep scenarios short: ideally **3–10 steps**.

**Good example:**

```gherkin
Feature: User Login

  Scenario: Successful login with valid credentials
    Given user is on login page
    When user logs in with valid credentials
    Then user should see the dashboard
```

**Bad example:**

```gherkin
Scenario: Click login and verify some stuff
  Given I open url "https://staging.example.com/login" in "chrome"
  When I enter "user1" into "login.username.input"
  And I enter "password1" into "login.password.input"
  And I click on "login.button"
  Then I should see "dashboard.main.panel"
```

The bad example mixes environment details, raw locators, and technical wording.

### 3.2 Step Definitions / Step Libraries

Use QAF step annotations (`@QAFTestStep`) in step libraries. Steps should be **thin** and delegate to Page Objects.

**Example: Step library**

```java
package com.company.project.steps;

import com.company.project.pages.LoginPage;
import com.company.project.domain.User;
import com.qmetry.qaf.automation.step.QAFTestStep;

public class LoginSteps {

    private final LoginPage loginPage = new LoginPage();

    @QAFTestStep(description = "user is on login page")
    public void userIsOnLoginPage() {
        loginPage.open();
    }

    @QAFTestStep(description = "user logs in with valid credentials")
    public void userLogsInWithValidCredentials() {
        User validUser = UserFactory.getValidUser();
        loginPage.loginWith(validUser);
    }

    @QAFTestStep(description = "user should see the dashboard")
    public void userShouldSeeTheDashboard() {
        loginPage.assertUserIsOnDashboard();
    }
}
```

---

## 4. Page Object Model (POM) with QAF

### 4.1 Locator Repository

Locators must be defined in **locator-repository** property files.

`src/test/resources/locator-repository/login.properties`:

```properties
login.username.input = id=username
login.password.input = id=password
login.button = css=button[type='submit']
login.error.message = css=[data-testid='login-error']
```

### 4.2 Page Object Example

```java
package com.company.project.pages;

import com.company.project.domain.User;
import com.qmetry.qaf.automation.ui.WebDriverBaseTestPage;
import com.qmetry.qaf.automation.ui.annotations.FindBy;
import com.qmetry.qaf.automation.ui.webdriver.QAFWebElement;
import com.qmetry.qaf.automation.ui.webdriver.QAFWebDriver;
import org.testng.Assert;

public class LoginPage extends WebDriverBaseTestPage<WebDriverBaseTestPage<?>> {

    @FindBy(locator = "login.username.input")
    private QAFWebElement usernameInput;

    @FindBy(locator = "login.password.input")
    private QAFWebElement passwordInput;

    @FindBy(locator = "login.button")
    private QAFWebElement loginButton;

    @FindBy(locator = "login.error.message")
    private QAFWebElement errorMessage;

    @Override
    protected void openPage(Object... args) {
        // Base URL and path should come from qaf/application properties
        ((QAFWebDriver) getDriver()).get("/login");
    }

    /**
     * Performs login using the given user credentials.
     * Assumes the login page is already opened.
     */
    public void loginWith(User user) {
        usernameInput.clear();
        usernameInput.sendKeys(user.getUsername());
        passwordInput.clear();
        passwordInput.sendKeys(user.getPassword());
        loginButton.click();
    }

    /**
     * Returns true if the error message is visible on the page.
     */
    public boolean isErrorDisplayed() {
        return errorMessage.isPresent() && errorMessage.isDisplayed();
    }

    /**
     * Asserts that the user is on the dashboard using a stable UI element.
     */
    public void assertUserIsOnDashboard() {
        // Example: check a test id or title that only exists on dashboard
        String title = getDriver().getTitle();
        Assert.assertTrue(title.contains("Dashboard"), "Expected to be on dashboard, but title was: " + title);
    }
}
```

**Rules:**

- Do not expose raw `QAFWebElement` fields from Page Objects.
- Provide intention-revealing methods (`loginWith`, `assertUserIsOnDashboard`).
- Keep Page Objects cohesive; split large pages into smaller components where needed.

---

## 5. Locator Strategy

Preferred order:

1. `data-testid`, `data-qa` attributes
2. Stable `id` or `name`
3. Accessible attributes (`aria-*`, labels)
4. Short CSS selectors
5. XPath only as last resort

**Bad locator (brittle):**

```properties
dashboard.main.panel = xpath=/html/body/div[2]/div[1]/div[3]
```

**Good locator (stable):**

```properties
dashboard.main.panel = css=[data-testid='dashboard-root']
```

All locators belong in `locator-repository` files, not in Java code.

---

## 6. Configuration (qaf.properties / application.properties)

- Base URLs, timeouts, and driver config go into config files, not code.
- Environments (`dev`, `qa`, `prod`) should be managed via QAF env profiles.
- Do **not** hard-code URLs in tests or Page Objects.

**Example snippet:**

```properties
env.baseurl = https://qa.example.com
selenium.wait.timeout = 10
remote.server = http://localhost:4444/wd/hub
```


### 6.1 Build Tool (Gradle)

- Dependencies, plugins, and test tasks are managed via **Gradle**.
- UI test tasks should be clearly named (e.g. `test`, `uiTest`, `smokeTest`) and wired to TestNG/QAF suites.
- Do **not** add ad-hoc command-line only steps; codify them into Gradle tasks so they are reproducible in CI.

Example snippet:

```groovy
dependencies {
    testImplementation 'org.testng:testng:7.10.0'
    testImplementation 'com.qmetry:qaf:4.0.0' // Example version
}

test {
    useTestNG() {
        suites 'testng.xml'
    }
}
```


---

## 7. Synchronization & Waiting

- Avoid `Thread.sleep()`; treat it as a **temporary hack** with a comment and ticket reference.
- Use QAF/Selenium waits and conditions in Page Objects or utilities.

**Example explicit wait helper:**

```java
/**
 * Waits until the given element is visible.
 */
public static QAFWebElement waitForVisible(QAFWebElement element, long timeoutInSeconds) {
    for (int i = 0; i < timeoutInSeconds * 2; i++) {
        if (element.isPresent() && element.isDisplayed()) {
            return element;
        }
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
    throw new AssertionError("Element was not visible within " + timeoutInSeconds + " seconds");
}
```

If `Thread.sleep` must be used directly:

```java
// TEMP: Replace with proper wait for loading indicator (TASK-1234)
Thread.sleep(2000);
```

---

## 8. Commenting & Documentation Standards

Comments are part of the deliverable and must be reviewed.

### 8.1 When to Comment

- To explain **why** a non-obvious approach is used.
- To describe **business rules** encoded in tests.
- To document **temporary workarounds** (with ticket IDs).

**Good comment example:**

```java
// Some legacy tenants still use old billing UI (TASK-3421).
// Once all tenants are migrated, remove this branch.
if (tenant.isLegacy()) {
    legacyBillingPage.open();
} else {
    billingPage.open();
}
```

### 8.2 When Not to Comment

- Do not comment obvious code:

```java
// Click login button
loginButton.click();
```

- Do not keep large blocks of commented-out code without explanation.

### 8.3 JavaDoc Expectations

- Public methods in Page Objects and step libraries require a one-line JavaDoc stating intent.

```java
/**
 * Ensures a logged-in user session, logging in if necessary.
 */
public void ensureUserLoggedIn(User user) { ... }
```

**Review Rule:**  
PRs may be blocked if comments are misleading, missing where needed, or stale.

---

## 9. Correctness

- Each scenario must have a **clear purpose** and **single primary reason to fail**.
- Assertions must be specific and helpful when they fail.

**Example (good):**

```java
Assert.assertTrue(loginPage.isErrorDisplayed(), "Expected error message for invalid login.");
```

**Example (bad):**

```java
Assert.assertTrue(flag);
```

---

## 10. Readability

- Follow a consistent Java code style (e.g. Google Java Style).
- Use meaningful names:

  - `loginWithValidCredentials` (good) vs `doLogin1` (bad)
  - `isErrorDisplayed` (good) vs `checkErr` (bad)

- Keep methods short and single-purpose.
- Scenario steps should tell a business story at a glance.

---

## 11. Maintainability

- Apply DRY:
  - Common flows → shared step methods or utilities.
  - Common locators → locator repository.
- Refactor when:
  - Similar step implementations are duplicated.
  - Page Objects become large and unwieldy.

Avoid environment-specific `if/else` logic in tests; use configuration and environment profiles.

---

## 12. Performance

- Use tags/groups to run subsets (`@smoke`, `@regression`, `@critical`).
- Support parallel execution:
  - No shared mutable static state.
  - Isolate test data where possible.

Prefer a small number of stable, high-value tests over a large number of flaky tests.

---

## 13. Security

- Never commit secrets (passwords, tokens, API keys).
- Do not log credentials or PII.
- Use environment variables or CI secrets for sensitive configuration.
- Test data must be synthetic or anonymized.

---

## 14. Tests & Coverage Strategy

Use QAF UI tests for:

- Critical end-to-end journeys (login, checkout, payment, account management).
- Cross-service flows.

Do not use UI tests for:

- Pure validation or business rules that belong in unit/integration tests.

Split overly complex scenarios into smaller ones that each validate a clear, focused behavior.

---

## 15. Code Review Checklist (QAF + Selenium + Java)

Reviewers must confirm:

### Correctness
- [ ] Scenario validates one clear behavior.
- [ ] Assertions are precise and stable.
- [ ] No hidden test-order dependencies.

### Readability
- [ ] Scenario steps read like business flows.
- [ ] Step methods are thin and intention-revealing.
- [ ] Page and method names are descriptive.

### Maintainability
- [ ] Locators are in locator-repository files, not hard-coded.
- [ ] Shared flows are in step libraries or utilities.
- [ ] No unnecessary duplication.

### Performance
- [ ] No unjustified `Thread.sleep`.
- [ ] Tests are suitable for parallel execution.
- [ ] No redundant navigation or setup.

### Security
- [ ] No secrets or PII hard-coded or logged.

### Comments & Documentation
- [ ] Comments explain **why**, not what.
- [ ] Workarounds are documented with ticket IDs.
- [ ] No unexplained commented-out code blocks.

If any of the above fail, the PR must be updated before approval.
