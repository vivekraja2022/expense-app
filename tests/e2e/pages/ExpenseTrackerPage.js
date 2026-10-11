function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export class ExpenseTrackerPage {
  constructor(page) {
    this.page = page;

    // Form
    this.form = page.getByTestId('expense-form');
    this.descriptionInput = page.getByTestId('expense-form-description-input');
    this.amountInput = page.getByTestId('expense-form-amount-input');
    this.dateInput = page.getByTestId('expense-form-date-input');
    this.categorySelect = page.getByTestId('expense-form-category-select');
    this.submitButton = page.getByTestId('expense-form-submit-button');
    this.cancelButton = page.getByTestId('expense-form-cancel-button');
    this.formError = page.getByTestId('expense-form-error');

    // Filter bar
    this.searchInput = page.getByTestId('filter-search-input');
    this.categoryFilterSelect = page.getByTestId('filter-category-select');
    this.sortSelect = page.getByTestId('filter-sort-select');

    // List
    this.expenseList = page.getByTestId('expense-list');
    this.expenseItems = page.getByTestId('expense-item');
    this.emptyState = page.getByTestId('expense-list-empty-state');

    // Summary
    this.summaryTotal = page.getByTestId('summary-total-value');
    this.summaryCount = page.getByTestId('summary-count');
    this.summaryRows = page.getByTestId('summary-row');

    this.resetButton = page.getByTestId('reset-mock-data-button');
  }

  async goto() {
    await this.page.goto('/');
    // Wait for the seeded list to actually render instead of an arbitrary sleep.
    await this.expenseItems.first().waitFor({ state: 'visible' });
  }

  async addExpense({ description, amount, date, category }) {
    await this.descriptionInput.fill(description);
    await this.amountInput.fill(String(amount));
    if (date) {
      await this.dateInput.fill(date);
    }
    if (category) {
      await this.categorySelect.selectOption(category);
    }
    await this.submitButton.click();
  }

  async submitEmptyForm() {
    await this.descriptionInput.fill('');
    await this.amountInput.fill('');
    await this.submitButton.click();
  }

  itemByDescription(description) {
    // Exact match (anchored regex) — a plain string filter does a substring
    // match, so e.g. "Grocery shopping" would also match an item renamed to
    // "Grocery shopping (updated)".
    const exact = new RegExp(`^${escapeRegExp(description)}$`);
    return this.expenseItems.filter({
      has: this.page.getByTestId('expense-item-description').filter({ hasText: exact }),
    });
  }

  async editExpense(currentDescription, updates) {
    const item = this.itemByDescription(currentDescription);
    await item.getByTestId('expense-item-edit-button').click();

    if (updates.description !== undefined) {
      await this.descriptionInput.fill(updates.description);
    }
    if (updates.amount !== undefined) {
      await this.amountInput.fill(String(updates.amount));
    }
    if (updates.date !== undefined) {
      await this.dateInput.fill(updates.date);
    }
    if (updates.category !== undefined) {
      await this.categorySelect.selectOption(updates.category);
    }
    await this.submitButton.click();
  }

  async deleteExpense(description) {
    const item = this.itemByDescription(description);
    await item.getByTestId('expense-item-delete-button').click();
  }

  async search(text) {
    await this.searchInput.fill(text);
  }

  async filterByCategory(category) {
    await this.categoryFilterSelect.selectOption(category);
  }

  async sortBy(option) {
    await this.sortSelect.selectOption(option);
  }

  async resetToMockData() {
    await this.resetButton.click();
  }

  async visibleDescriptions() {
    return this.expenseItems.getByTestId('expense-item-description').allTextContents();
  }
}
