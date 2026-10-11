import { test, expect } from '@playwright/test';
import { ExpenseTrackerPage } from './pages/ExpenseTrackerPage.js';
import { MOCK_EXPENSES, newExpense, formatCurrency } from './fixtures/test-data.js';

test.describe('Add expense', () => {
  let tracker;

  test.beforeEach(async ({ page }) => {
    tracker = new ExpenseTrackerPage(page);
    await tracker.goto();
  });

  test('seeds the mock expenses and shows the correct starting total', async () => {
    await expect(tracker.expenseItems).toHaveCount(MOCK_EXPENSES.length);

    const expectedTotal = MOCK_EXPENSES.reduce((sum, e) => sum + e.amount, 0);
    await expect(tracker.summaryTotal).toHaveText(formatCurrency(expectedTotal));
    await expect(tracker.summaryCount).toContainText(String(MOCK_EXPENSES.length));
  });

  test('adds a new expense and reflects it in the list and the total', async () => {
    const expectedTotal =
      MOCK_EXPENSES.reduce((sum, e) => sum + e.amount, 0) + Number(newExpense.amount);

    await tracker.addExpense(newExpense);

    await expect(tracker.itemByDescription(newExpense.description)).toBeVisible();
    await expect(tracker.itemByDescription(newExpense.description).getByTestId('expense-item-amount')).toHaveText(
      formatCurrency(Number(newExpense.amount))
    );
    await expect(tracker.expenseItems).toHaveCount(MOCK_EXPENSES.length + 1);
    await expect(tracker.summaryTotal).toHaveText(formatCurrency(expectedTotal));
  });

  test('rejects submission with an empty description', async () => {
    await tracker.amountInput.fill('10');
    await tracker.submitButton.click();

    await expect(tracker.formError).toHaveText('Please enter a description.');
    await expect(tracker.expenseItems).toHaveCount(MOCK_EXPENSES.length);
  });

  test('rejects submission with a zero or negative amount', async () => {
    await tracker.descriptionInput.fill('Suspicious refund');
    await tracker.amountInput.fill('0');
    await tracker.submitButton.click();

    await expect(tracker.formError).toHaveText('Please enter an amount greater than 0.');
    await expect(tracker.expenseItems).toHaveCount(MOCK_EXPENSES.length);
  });

  test('clears the form after a successful submission', async () => {
    await tracker.addExpense(newExpense);

    await expect(tracker.descriptionInput).toHaveValue('');
    await expect(tracker.amountInput).toHaveValue('');
  });
});
