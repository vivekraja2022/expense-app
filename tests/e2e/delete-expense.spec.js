import { test, expect } from '@playwright/test';
import { ExpenseTrackerPage } from './pages/ExpenseTrackerPage.js';
import { MOCK_EXPENSES, formatCurrency } from './fixtures/test-data.js';

const seedExpense = MOCK_EXPENSES[1]; // "Uber to airport"

test.describe('Delete expense', () => {
  let tracker;

  test.beforeEach(async ({ page }) => {
    tracker = new ExpenseTrackerPage(page);
    await tracker.goto();
  });

  test('removes the expense from the list and updates the total', async () => {
    const expectedTotal =
      MOCK_EXPENSES.reduce((sum, e) => sum + e.amount, 0) - seedExpense.amount;

    await tracker.deleteExpense(seedExpense.description);

    await expect(tracker.itemByDescription(seedExpense.description)).toHaveCount(0);
    await expect(tracker.expenseItems).toHaveCount(MOCK_EXPENSES.length - 1);
    await expect(tracker.summaryTotal).toHaveText(formatCurrency(expectedTotal));
  });

  test('exits edit mode if the expense being edited is deleted', async () => {
    const item = tracker.itemByDescription(seedExpense.description);
    await item.getByTestId('expense-item-edit-button').click();
    await expect(tracker.submitButton).toHaveText('Save Changes');

    await tracker.deleteExpense(seedExpense.description);

    await expect(tracker.submitButton).toHaveText('Add Expense');
    await expect(tracker.descriptionInput).toHaveValue('');
  });

  test('shows the empty state once every expense is deleted', async () => {
    for (const expense of MOCK_EXPENSES) {
      await tracker.deleteExpense(expense.description);
    }

    await expect(tracker.emptyState).toBeVisible();
    await expect(tracker.summaryTotal).toHaveText(formatCurrency(0));
  });
});
