import { test, expect } from '@playwright/test';
import { ExpenseTrackerPage } from './pages/ExpenseTrackerPage.js';
import { MOCK_EXPENSES } from './fixtures/test-data.js';

test.describe('Search, filter, and sort', () => {
  let tracker;

  test.beforeEach(async ({ page }) => {
    tracker = new ExpenseTrackerPage(page);
    await tracker.goto();
  });

  test('search narrows the list by description', async () => {
    await tracker.search('grocery');

    await expect(tracker.expenseItems).toHaveCount(1);
    await expect(tracker.itemByDescription('Grocery shopping')).toBeVisible();
  });

  test('search is case-insensitive and shows the empty state for no matches', async () => {
    await tracker.search('UBER');
    await expect(tracker.itemByDescription('Uber to airport')).toBeVisible();

    await tracker.search('this expense does not exist');
    await expect(tracker.emptyState).toBeVisible();
  });

  test('category filter shows only expenses in that category', async () => {
    await tracker.filterByCategory('Housing');

    const housingExpenses = MOCK_EXPENSES.filter((e) => e.category === 'Housing');
    await expect(tracker.expenseItems).toHaveCount(housingExpenses.length);
    for (const expense of housingExpenses) {
      await expect(tracker.itemByDescription(expense.description)).toBeVisible();
    }
  });

  test('search and category filter combine', async () => {
    await tracker.filterByCategory('Food');
    await tracker.search('grocery');

    await expect(tracker.expenseItems).toHaveCount(1);
    await expect(tracker.itemByDescription('Grocery shopping')).toBeVisible();
  });

  test('sorting by amount orders the list high to low', async () => {
    await tracker.sortBy('amount-desc');

    const expectedOrder = [...MOCK_EXPENSES]
      .sort((a, b) => b.amount - a.amount)
      .map((e) => e.description);

    await expect(tracker.expenseItems.getByTestId('expense-item-description')).toHaveText(
      expectedOrder
    );
  });

  test('sorting by date orders the list oldest to newest', async () => {
    await tracker.sortBy('date-asc');

    const expectedOrder = [...MOCK_EXPENSES]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((e) => e.description);

    await expect(tracker.expenseItems.getByTestId('expense-item-description')).toHaveText(
      expectedOrder
    );
  });
});
