const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export default function Summary({ expenses }) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const byCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const breakdown = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);

  return (
    <div className="summary" data-testid="summary">
      <h2 className="summary__heading">Overview</h2>

      <div className="summary__total">
        <div className="summary__total-main">
          <span className="summary__label">Total Spent</span>
          <span className="summary__value" data-testid="summary-total-value">
            {formatter.format(total)}
          </span>
        </div>
        <span className="summary__count" data-testid="summary-count">
          {expenses.length} expense{expenses.length === 1 ? '' : 's'}
        </span>
      </div>

      {breakdown.length > 0 && (
        <div className="summary__breakdown" data-testid="summary-breakdown">
          {breakdown.map(([category, amount]) => {
            const pct = total > 0 ? (amount / total) * 100 : 0;
            return (
              <div key={category} className="summary__row" data-testid="summary-row">
                <div className="summary__row-labels">
                  <span className="summary__row-category" data-testid="summary-row-category">
                    <span className={`dot dot--${category}`} aria-hidden="true" />
                    {category}
                  </span>
                  <span data-testid="summary-row-amount">{formatter.format(amount)}</span>
                </div>
                <div className="summary__bar-track">
                  <div
                    className={`summary__bar-fill category-badge--${category}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
