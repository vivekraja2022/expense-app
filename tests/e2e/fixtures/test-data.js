// Re-exported from the app's own seed data so the suite never drifts out of
// sync with what the app actually ships.
export { MOCK_EXPENSES, CATEGORIES } from '../../../src/data/mockExpenses.js';

export const newExpense = {
  description: 'Team lunch',
  amount: '42.50',
  category: 'Food',
  date: '2026-10-10',
};

export const secondNewExpense = {
  description: 'Gym membership',
  amount: '35.00',
  category: 'Health',
  date: '2026-10-11',
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function formatCurrency(amount) {
  return currencyFormatter.format(amount);
}
