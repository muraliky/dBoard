# Commit Message Generation Instructions

## Overview
This document provides guidelines for GitHub Copilot to generate standardized, meaningful commit messages that maintain consistency across the team and enable better traceability.

---

## Commit Message Format

Every commit message MUST follow this structure:

```
Author: <Full Name>

Summary: <type>(<scope>): <short description>

Description:
<detailed explanation of what changed and why>

Related: <JIRA-ticket-number>
```

---

## Field Specifications

### 1. Author
- **Required**: Yes
- **Format**: Full name of the person committing the code
- **Example**: `Author: John Smith`

### 2. Summary Line
- **Required**: Yes
- **Maximum Length**: 72 characters
- **Format**: `<type>(<scope>): <short description>`
- **Rules**:
  - Use imperative mood ("Add feature" not "Added feature")
  - Do not end with a period
  - Capitalize the first letter after the colon
  - Keep it concise but descriptive

#### Commit Types
| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature or functionality | `feat(login): Add OAuth2 authentication` |
| `fix` | Bug fix | `fix(api): Resolve null pointer in user service` |
| `test` | Adding or updating tests | `test(checkout): Add unit tests for payment flow` |
| `refactor` | Code refactoring without changing functionality | `refactor(utils): Simplify date formatting logic` |
| `docs` | Documentation changes | `docs(readme): Update installation instructions` |
| `style` | Code style changes (formatting, semicolons, etc.) | `style(components): Apply consistent indentation` |
| `chore` | Maintenance tasks, dependencies, configs | `chore(deps): Update Selenium to v4.15.0` |
| `perf` | Performance improvements | `perf(search): Optimize database query execution` |
| `ci` | CI/CD pipeline changes | `ci(jenkins): Add parallel test execution` |
| `build` | Build system or external dependencies | `build(gradle): Configure test report generation` |
| `revert` | Reverting a previous commit | `revert: Revert "feat(login): Add OAuth2"` |

#### Scope
- **Required**: Yes (when applicable)
- **Description**: The module, component, or area of the codebase affected
- **Examples**:
  - For test automation: `login`, `checkout`, `api`, `dashboard`, `reports`
  - For page objects: `LoginPage`, `HomePage`, `CheckoutPage`
  - For utilities: `utils`, `helpers`, `config`, `data`
  - For framework: `framework`, `base`, `core`, `drivers`

### 3. Description
- **Required**: Yes (for non-trivial changes)
- **Format**: Detailed explanation in paragraph form
- **Content should include**:
  - WHAT was changed
  - WHY the change was made
  - Any important context or decisions
  - Impact on existing functionality
  - Any breaking changes

### 4. Related (JIRA Reference)
- **Required**: Yes (when applicable)
- **Format**: `Related: <PROJECT>-<NUMBER>`
- **Examples**:
  - `Related: QA-1234`
  - `Related: AUTO-567`
  - `Related: TEST-890`
- **Multiple tickets**: `Related: QA-1234, QA-1235`
- **No ticket**: `Related: N/A` (for minor fixes, typos, etc.)

---

## Complete Examples

### Example 1: New Test Feature
```
Author: Sarah Johnson

Summary: feat(checkout): Add end-to-end tests for guest checkout flow

Description:
Implemented comprehensive E2E tests for the guest checkout functionality.
Tests cover the complete user journey from cart to order confirmation
without requiring user authentication.

Test scenarios include:
- Adding items to cart as guest
- Entering shipping information
- Selecting payment method
- Order confirmation validation

This addresses the gap in test coverage for non-authenticated users
and aligns with the Q4 release requirements.

Related: QA-2456
```

### Example 2: Bug Fix
```
Author: Michael Chen

Summary: fix(LoginPage): Resolve flaky login test due to timing issue

Description:
Fixed intermittent test failures in login tests caused by insufficient
wait time for the authentication response. Replaced Thread.sleep() with
explicit wait for the dashboard element to be visible.

Root cause: The application's SSO integration sometimes takes longer
than the previous 3-second static wait.

Solution: Implemented WebDriverWait with 15-second timeout waiting for
the user profile icon to appear, indicating successful authentication.

Related: QA-1892
```

### Example 3: Refactoring
```
Author: Emily Rodriguez

Summary: refactor(BasePage): Extract common wait methods to WaitHelper utility

Description:
Moved all explicit wait implementations from BasePage to a dedicated
WaitHelper utility class to improve code reusability and maintainability.

Changes include:
- Created WaitHelper class with static wait methods
- Updated BasePage to use WaitHelper
- Removed duplicate wait logic from page objects
- Added JavaDoc documentation for all public methods

This refactoring reduces code duplication across 15+ page objects and
provides a single source of truth for wait configurations.

Related: QA-2103
```

### Example 4: Test Data Update
```
Author: David Park

Summary: chore(testdata): Update test credentials for staging environment

Description:
Updated test user credentials following the staging environment refresh.
Old test accounts were deactivated during the monthly security rotation.

Updated accounts:
- Standard user (read-only access)
- Admin user (full access)
- API service account

Note: Credentials are stored in encrypted config files and fetched
from environment variables in CI/CD pipeline.

Related: QA-2567
```

### Example 5: Framework Enhancement
```
Author: Lisa Thompson

Summary: feat(framework): Add screenshot capture on test failure

Description:
Implemented automatic screenshot capture functionality that triggers
when any test fails. Screenshots are saved with timestamp and test
name for easy identification during debugging.

Implementation details:
- Added TestNG listener for test failure events
- Screenshots saved to /target/screenshots directory
- File naming convention: {TestClass}_{TestMethod}_{timestamp}.png
- Integrated with existing reporting framework

This enhancement will significantly improve debugging efficiency
for failed tests in CI/CD pipeline.

Related: QA-1456
```

### Example 6: Documentation
```
Author: James Wilson

Summary: docs(readme): Add setup instructions for new team members

Description:
Added comprehensive setup documentation including:
- Prerequisites and system requirements
- IDE configuration steps
- Environment variable setup
- Running tests locally
- Troubleshooting common issues

This documentation addresses frequently asked questions from new
team members during onboarding.

Related: N/A
```

### Example 7: Dependency Update
```
Author: Amanda Foster

Summary: chore(deps): Upgrade Playwright to v1.40.0

Description:
Updated Playwright dependency from v1.35.0 to v1.40.0 to leverage
new features and security patches.

Key changes in this version:
- Improved auto-waiting mechanism
- Better support for shadow DOM
- Enhanced trace viewer
- Security vulnerability fixes (CVE-2023-XXXXX)

All existing tests pass with the new version. No breaking changes
were identified during regression testing.

Related: QA-2890
```

### Example 8: CI/CD Update
```
Author: Robert Kim

Summary: ci(github-actions): Add parallel test execution for faster builds

Description:
Configured GitHub Actions workflow to run tests in parallel across
multiple containers, reducing total build time from 45 minutes to
approximately 15 minutes.

Configuration:
- 4 parallel containers
- Tests split by test class
- Shared artifact storage for reports
- Merged test results in final report

This change supports the team's goal of faster feedback loops
in the CI/CD pipeline.

Related: QA-2234
```

---

## Rules for Copilot

When generating commit messages, follow these rules:

1. **Always include all four sections**: Author, Summary, Description, Related
2. **Analyze the code changes** to determine the appropriate commit type
3. **Identify the scope** from the files or modules being changed
4. **Write meaningful descriptions** that explain the "what" and "why"
5. **Use imperative mood** in the summary line
6. **Keep summary under 72 characters**
7. **Extract JIRA ticket numbers** from branch names if available (e.g., `feature/QA-1234-add-login-tests`)
8. **Be specific** about what changed, avoid vague descriptions
9. **Mention breaking changes** prominently if any exist
10. **Include technical context** that would help reviewers understand the changes

---

## Anti-Patterns to Avoid

❌ **Don't use vague descriptions**:
- "Fixed stuff"
- "Updated code"
- "Minor changes"
- "WIP"

❌ **Don't skip the description for significant changes**

❌ **Don't use past tense in summary**:
- "Added feature" → "Add feature"
- "Fixed bug" → "Fix bug"

❌ **Don't exceed 72 characters in summary line**

❌ **Don't forget the JIRA reference**

❌ **Don't combine unrelated changes in one commit**

---

## Branch Name Convention (Reference)

For context, branch names typically follow this pattern:
```
<type>/<JIRA-ticket>-<short-description>
```

Examples:
- `feature/QA-1234-add-login-tests`
- `bugfix/QA-5678-fix-flaky-checkout-test`
- `refactor/QA-9012-cleanup-page-objects`

Use the JIRA ticket from the branch name in the "Related" field.

---

## Summary

Generate commit messages that are:
- ✅ **Consistent** - Follow the standard format
- ✅ **Descriptive** - Clearly explain what and why
- ✅ **Traceable** - Link to JIRA tickets
- ✅ **Professional** - Use proper grammar and formatting
- ✅ **Actionable** - Help reviewers understand the changes quickly
