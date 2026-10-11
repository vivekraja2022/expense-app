const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export default function ExpenseList({ expenses, onEdit, onDelete }) {
  if (expenses.length === 0) {
    return (
      <p className="empty-state" data-testid="expense-list-empty-state">
        No expenses match your filters yet.
      </p>
    );
  }

  return (
    <div className="expense-list-card">
      <div className="expense-list__header" aria-hidden="true">
        <span>Description</span>
        <span>Category</span>
        <span>Date</span>
        <span className="expense-list__header-amount">Amount</span>
        <span />
      </div>
      <ul className="expense-list" data-testid="expense-list">
        {expenses.map((expense) => (
          <li key={expense.id} className="expense-item" data-testid="expense-item">
            <span className="expense-item__description" data-testid="expense-item-description">
              {expense.description}
            </span>
            <span
              className={`expense-item__category category-badge category-badge--${expense.category}`}
              data-testid="expense-item-category"
            >
              {expense.category}
            </span>
            <span className="expense-item__date" data-testid="expense-item-date">
              {expense.date}
            </span>
            <span className="expense-item__amount" data-testid="expense-item-amount">
              {formatter.format(expense.amount)}
            </span>
            <span className="expense-item__actions">
              <button
                type="button"
                className="btn btn-icon"
                onClick={() => onEdit(expense)}
                aria-label="Edit expense"
                data-testid="expense-item-edit-button"
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn-icon btn-danger"
                onClick={() => onDelete(expense.id)}
                aria-label="Delete expense"
                data-testid="expense-item-delete-button"
              >
                Delete
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
