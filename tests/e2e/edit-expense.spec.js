import { test, expect } from '@playwright/test';
import { ExpenseTrackerPage } from './pages/ExpenseTrackerPage.js';
import { MOCK_EXPENSES, formatCurrency } from './fixtures/test-data.js';

const seedExpense = MOCK_EXPENSES[0]; // "Grocery shopping"

test.describe('Edit expense', () => {
  let tracker;

  test.beforeEach(async ({ page }) => {
    tracker = new ExpenseTrackerPage(page);
    await tracker.goto();
  });

  test('switches the form into edit mode with the expense pre-filled', async () => {
    const item = tracker.itemByDescription(seedExpense.description);
    await item.getByTestId('expense-item-edit-button').click();

    await expect(tracker.descriptionInput).toHaveValue(seedExpense.description);
    await expect(tracker.amountInput).toHaveValue(String(seedExpense.amount));
    await expect(tracker.categorySelect).toHaveValue(seedExpense.category);
    await expect(tracker.submitButton).toHaveText('Save Changes');
    await expect(tracker.cancelButton).toBeVisible();
  });

  test('saves changes and updates the list and total', async () => {
    const updatedAmount = seedExpense.amount + 100;
    const expectedTotal =
      MOCK_EXPENSES.reduce((sum, e) => sum + e.amount, 0) - seedExpense.amount + updatedAmount;

    await tracker.editExpense(seedExpense.description, {
      description: 'Grocery shopping (updated)',
      amount: updatedAmount,
    });

    await expect(tracker.itemByDescription(seedExpense.description)).toHaveCount(0);
    const updatedItem = tracker.itemByDescription('Grocery shopping (updated)');
    await expect(updatedItem).toBeVisible();
    await expect(updatedItem.getByTestId('expense-item-amount')).toHaveText(
      formatCurrency(updatedAmount)
    );
    await expect(tracker.expenseItems).toHaveCount(MOCK_EXPENSES.length);
    await expect(tracker.summaryTotal).toHaveText(formatCurrency(expectedTotal));
  });

  test('cancel discards edits and restores the add-expense form', async () => {
    const item = tracker.itemByDescription(seedExpense.description);
    await item.getByTestId('expense-item-edit-button').click();
    await tracker.descriptionInput.fill('This should not be saved');
    await tracker.cancelButton.click();

    await expect(tracker.descriptionInput).toHaveValue('');
    await expect(tracker.submitButton).toHaveText('Add Expense');
    await expect(tracker.itemByDescription(seedExpense.description)).toBeVisible();
  });
});
