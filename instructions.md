
# instructions.md

**Goal:** Use GitHub Copilot (or another AI pair-programmer) to generate reliable Selenium locators and Java Page Object classes from a single HTML page. This guide is Java-first: it contains step-by-step workflow, copy‑paste prompt templates for Copilot, example outputs (Java + brief Maven setup), validation steps, and best practices.

---

## 1 — What you'll get
- A reproducible workflow to prompt Copilot to extract meaningful locators from an HTML page.
- Copy‑paste-ready prompts to generate:
  - A locator map (prefer `id`, `data-*`, `name`, then `css`, then `xpath`)
  - A Java Page Object class (with WebDriverWait usage)
  - JUnit/TestNG skeleton tests to exercise the page object
- Quick validation checklist and robustness tips.

---

## 2 — Prerequisites
- GitHub Copilot enabled in your Java editor (IntelliJ IDEA, VS Code with Java extension).
- Local copy of the HTML page (or accessible URL).
- Java 11+ (or your project's Java version).
- Maven or Gradle project with Selenium dependencies:
  - Example (Maven `pom.xml` dependencies snippet):
    ```xml
    <dependency>
      <groupId>org.seleniumhq.selenium</groupId>
      <artifactId>selenium-java</artifactId>
      <version>4.12.0</version>
    </dependency>
    <dependency>
      <groupId>org.junit.jupiter</groupId>
      <artifactId>junit-jupiter</artifactId>
      <version>5.10.0</version>
      <scope>test</scope>
    </dependency>
    ```
- Browser driver (e.g., chromedriver) installed and on PATH or managed with WebDriverManager.

---

## 3 — Locator policy (priority & rules)
**Priority order (most stable → fallback):**
1. `id` (unique)
2. `data-*` attributes (`data-test`, `data-testid`)
3. `name`
4. `aria-*`, `role` (semantic attributes)
5. `css` selector (prefer contextual selectors: `form.login button[type='submit']`)
6. `xpath` (use only when needed — prefer relative and `contains()`/`normalize-space()` when dealing with text)

**Rules:**
- Avoid absolute xpaths (`/html/body/...`).
- Prefer attributes that are semantic or intended for testing (`data-test`).
- Avoid selectors that rely on visible order unless stable.
- When text is used, prefer `contains()` or `normalize-space()` to handle whitespace/localization.

---

## 4 — Naming conventions (Java)
- Use `camelCase` for locator field names: `loginButton`, `emailInput`.
- Page Object class names: `LoginPage`, `SearchResultsPage`.
- Methods names: `enterEmail(String email)`, `clickLogin()` or `login(String email, String password)`.

---

## 5 — Workflow (step-by-step)

### A. Prepare the HTML
1. Save the page as `page.html` (or note the URL).
2. Open the HTML in one editor pane and a Java file in another, so Copilot can "see" both.

### B. Generate a locator map
1. Create a new comment block in a Java file (or a JSON file) and paste this prompt (see prompts section).
2. Ask Copilot to produce a JSON-like map of logical names → `{by, selector, reason}`.
3. Review the map, fix any brittle choices manually.

### C. Generate the Java Page Object
1. Use the locator map as input and prompt Copilot to generate a Java Page Object.
2. Include `WebDriver`, `By` fields, constructor, and action methods using explicit waits (`WebDriverWait` + `ExpectedConditions`).
3. Ensure each action uses waits and returns `this` or navigated page objects as appropriate.

### D. Generate tests
1. Produce JUnit or TestNG skeleton tests that:
   - Start a WebDriver instance (use WebDriverManager or local driver)
   - Navigate to the page
   - Use the Page Object to run positive and negative flows
   - Assert expected outcomes (URL, element text, visibility)
2. Keep driver setup/teardown in fixtures (`@BeforeEach`, `@AfterEach`) or a base test class.

### E. Validate selectors quickly
Run a small verification script (or test) that attempts to find each locator and checks:
```java
driver.get("file:///path/to/page.html"); // or the site URL
WebElement el = driver.findElement(By...);
assertTrue(el.isDisplayed());
```
Replace brittle selectors and iterate.

---

## 6 — Prompt templates (copy/paste-ready)

### 1) Generate locator map (paste in a Java comment above an empty block)
```
/*
I have the HTML open in the adjacent editor. Identify all interactive and test-relevant elements and return a JSON-style locator map with fields:
- logicalName
- by (id|data|name|css|xpath)
- selector (the selector value)
- reason (one short sentence why this locator is stable)

Prefer id, then data-*, then name, then css, then xpath. Return only JSON-like structure like:
{
  "loginButton": {"by":"id", "selector":"login-btn", "reason":"unique id"},
  ...
}
*/
```

### 2) Generate a Java Page Object (paste in an empty `LoginPage.java`)
```
/*
Using this locator map: <paste the locator map here>
Generate a Java Selenium Page Object named LoginPage:
- imports: org.openqa.selenium.*, org.openqa.selenium.support.ui.*
- class LoginPage { private WebDriver driver; private WebDriverWait wait; private By locators... }
- constructor: public LoginPage(WebDriver driver, Duration timeout) { ... }
- Include methods: enterEmail(String), enterPassword(String), clickLogin(), getErrorText()
- Each method should use WebDriverWait (until visibilityOfElementLocated or elementToBeClickable)
- Methods should have Javadoc comments and return types (void or other Page Objects)
Return only the Java class code.
*/
```

### 3) Generate JUnit test skeleton
```
/*
Using the LoginPage class below (paste it), write JUnit 5 tests:
- setup and teardown with @BeforeEach and @AfterEach to create and quit ChromeDriver
- testSuccessfulLogin: use login page to perform valid login, assert redirect or expected element
- testFailedLoginShowsError: use invalid credentials and assert error text is visible
- Use assertions from org.junit.jupiter.api.Assertions
Return only the test class code.
*/
```

---

## 7 — Example Java Page Object (pattern)
```java
package com.example.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

/**
 * Page Object for the Login page.
 */
public class LoginPage {
    private final WebDriver driver;
    private final WebDriverWait wait;
    private final By emailInput = By.id("email");
    private final By passwordInput = By.cssSelector("input[type='password']");
    private final By loginButton = By.cssSelector("[data-test='login-submit']");
    private final By errorBanner = By.cssSelector(".alert.alert-danger");

    public LoginPage(WebDriver driver, Duration timeout) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, timeout);
    }

    public LoginPage enterEmail(String email) {
        WebElement el = wait.until(ExpectedConditions.visibilityOfElementLocated(emailInput));
        el.clear();
        el.sendKeys(email);
        return this;
    }

    public LoginPage enterPassword(String password) {
        WebElement el = wait.until(ExpectedConditions.visibilityOfElementLocated(passwordInput));
        el.clear();
        el.sendKeys(password);
        return this;
    }

    public void clickLogin() {
        WebElement btn = wait.until(ExpectedConditions.elementToBeClickable(loginButton));
        btn.click();
    }

    public String getErrorText() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(errorBanner)).getText();
    }
}
```

---

## 8 — Example JUnit test skeleton
```java
package com.example.tests;

import com.example.pages.LoginPage;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.*;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;

public class LoginPageTest {
    private WebDriver driver;
    private LoginPage loginPage;

    @BeforeAll
    static void setupClass() {
        WebDriverManager.chromedriver().setup();
    }

    @BeforeEach
    void setup() {
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        loginPage = new LoginPage(driver, Duration.ofSeconds(10));
        driver.get("file:///path/to/page.html");
    }

    @AfterEach
    void teardown() {
        if (driver != null) driver.quit();
    }

    @Test
    void testFailedLoginShowsError() {
        loginPage.enterEmail("invalid@example.com")
                 .enterPassword("wrongpass")
                 .clickLogin();
        String err = loginPage.getErrorText();
        assertTrue(err.toLowerCase().contains("invalid") || !err.isEmpty(), "Expected an error message after failed login");
    }
}
```

---

## 9 — Validation checklist
- [ ] `id` selectors unique? Use `document.getElementById` or browser devtools to confirm.
- [ ] Use `data-*` attributes for stability; if missing, ask devs to add them.
- [ ] Replace brittle xpaths with CSS where possible.
- [ ] Use explicit waits (no `Thread.sleep()` in production tests).
- [ ] Validate both headless and headed runs.
- [ ] Add fallback selectors for dynamic elements.

---

## 10 — Common pitfalls & fixes
- **Dynamic IDs**: If ids include dynamic tokens (e.g., `user_12345`), use ancestor-based css or `data-*`.
- **Localization**: Text-based selectors will break for other locales — prefer attributes.
- **Timing**: Missing waits cause flaky tests — always use WebDriverWait.
- **Copilot text selectors**: Replace text-based xpaths Copilot may generate with attribute-based selectors.

---

## 11 — Iteration workflow
1. Generate initial locator map with Copilot.
2. Review and mark unstable selectors.
3. Re-run Copilot (paste corrected locator map) and request updated Page Object.
4. Create a validation test that checks all locators for presence/visibility.
5. Commit with a descriptive message and PR note about manual changes.

---

## 12 — Example commit message / PR description
```
feat(tests): add LoginPage Page Object and locator map

- Generated initial locator map using Copilot, then refined selectors:
  - Replaced text-based xpath for login button with data-test attribute
  - Added explicit waits to all actions
- Included JUnit skeleton tests and a quick locator validation script
- Next: add CI job, parameterize base URL
```

---

## 13 — Advanced prompts (automatic robustness)
- Ask Copilot to produce a fallback selector for each element:
  ```
  For each element, provide primary and fallback selectors and produce a Java helper: findWithFallback(By primary, By fallback)
  ```
- Ask Copilot to generate `Locators.java` with constants and a method to auto-validate each locator at runtime.

---

## 14 — Quick one-line prompts that often work
- `// Generate a robust locator map for the current HTML, prefer id/data-test, return JSON only.`
- `// Create a Java Selenium Page Object using this locator map with waits and Javadoc.`

---

## 15 — Next steps I can do for you (I will generate these now if you want):
- `Locators.java` from your HTML
- `LoginPage.java` Page Object
- `LoginPageTest.java` JUnit skeleton
Paste the HTML (or URL) and I'll generate the files.

---

## 16 — References & tools
- Selenium Java docs: https://www.selenium.dev
- WebDriverManager (io.github.bonigarcia): simplifies driver management
- JUnit 5 user guide

---
