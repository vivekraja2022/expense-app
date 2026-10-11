import { useEffect, useState } from 'react';
import { CATEGORIES } from '../data/mockExpenses';

const emptyForm = {
  description: '',
  amount: '',
  category: CATEGORIES[0],
  date: new Date().toISOString().slice(0, 10),
};

export default function ExpenseForm({ onSubmit, editingExpense, onCancelEdit }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingExpense) {
      setForm({
        description: editingExpense.description,
        amount: String(editingExpense.amount),
        category: editingExpense.category,
        date: editingExpense.date,
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingExpense]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const trimmedDescription = form.description.trim();
    const parsedAmount = parseFloat(form.amount);

    if (!trimmedDescription) {
      setError('Please enter a description.');
      return;
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter an amount greater than 0.');
      return;
    }
    if (!form.date) {
      setError('Please pick a date.');
      return;
    }

    setError('');
    onSubmit({
      description: trimmedDescription,
      amount: parsedAmount,
      category: form.category,
      date: form.date,
    });

    if (!editingExpense) {
      setForm(emptyForm);
    }
  }

  return (
    <form className="expense-form" data-testid="expense-form" onSubmit={handleSubmit}>
      <h2>{editingExpense ? 'Edit Expense' : 'Add Expense'}</h2>

      <div className="form-row">
        <label htmlFor="description">Description</label>
        <input
          id="description"
          name="description"
          type="text"
          placeholder="e.g. Coffee with friends"
          value={form.description}
          onChange={handleChange}
          data-testid="expense-form-description-input"
        />
      </div>

      <div className="form-row form-row--split">
        <div>
          <label htmlFor="amount">Amount ($)</label>
          <input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={form.amount}
            onChange={handleChange}
            data-testid="expense-form-amount-input"
          />
        </div>

        <div>
          <label htmlFor="date">Date</label>
          <input
            id="date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            data-testid="expense-form-date-input"
          />
        </div>
      </div>

      <div className="form-row">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={form.category}
          onChange={handleChange}
          data-testid="expense-form-category-select"
        >
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="form-error" data-testid="expense-form-error">
          {error}
        </p>
      )}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" data-testid="expense-form-submit-button">
          {editingExpense ? 'Save Changes' : 'Add Expense'}
        </button>
        {editingExpense && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onCancelEdit}
            data-testid="expense-form-cancel-button"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
