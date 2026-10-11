import { useMemo, useState } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import FilterBar from './components/FilterBar';
import Summary from './components/Summary';
import { MOCK_EXPENSES, STORAGE_KEY } from './data/mockExpenses';
import { useLocalStorage } from './hooks/useLocalStorage';
import './App.css';

const initialFilters = { search: '', category: 'All', sort: 'date-desc' };

function sortExpenses(expenses, sort) {
  const sorted = [...expenses];
  switch (sort) {
    case 'date-asc':
      return sorted.sort((a, b) => a.date.localeCompare(b.date));
    case 'amount-desc':
      return sorted.sort((a, b) => b.amount - a.amount);
    case 'amount-asc':
      return sorted.sort((a, b) => a.amount - b.amount);
    case 'date-desc':
    default:
      return sorted.sort((a, b) => b.date.localeCompare(a.date));
  }
}

function App() {
  const [expenses, setExpenses] = useLocalStorage(STORAGE_KEY, MOCK_EXPENSES);
  const [filters, setFilters] = useState(initialFilters);
  const [editingExpense, setEditingExpense] = useState(null);

  function handleAddOrUpdate(expenseData) {
    if (editingExpense) {
      setExpenses((prev) =>
        prev.map((e) => (e.id === editingExpense.id ? { ...e, ...expenseData } : e))
      );
      setEditingExpense(null);
    } else {
      const newExpense = {
        id: crypto.randomUUID(),
        ...expenseData,
      };
      setExpenses((prev) => [newExpense, ...prev]);
    }
  }

  function handleDelete(id) {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    if (editingExpense?.id === id) {
      setEditingExpense(null);
    }
  }

  function handleEdit(expense) {
    setEditingExpense(expense);
  }

  function handleCancelEdit() {
    setEditingExpense(null);
  }

  function handleResetMockData() {
    setExpenses(MOCK_EXPENSES);
    setEditingExpense(null);
  }

  const filteredExpenses = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    const filtered = expenses.filter((e) => {
      const matchesSearch = !search || e.description.toLowerCase().includes(search);
      const matchesCategory = filters.category === 'All' || e.category === filters.category;
      return matchesSearch && matchesCategory;
    });
    return sortExpenses(filtered, filters.sort);
  }, [expenses, filters]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-brand">
          <span className="app-brand__mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2.5" y="5.5" width="19" height="13" rx="3" stroke="currentColor" strokeWidth="1.6" />
              <path d="M2.5 9.5H21.5" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="17" cy="14" r="1.6" fill="currentColor" />
            </svg>
          </span>
          <div>
            <h1>Expense Tracker</h1>
            <p>Track your spending — data is mocked and saved to your browser's local storage.</p>
          </div>
        </div>
      </header>

      <main className="app-layout">
        <section className="app-column app-column--form">
          <ExpenseForm
            onSubmit={handleAddOrUpdate}
            editingExpense={editingExpense}
            onCancelEdit={handleCancelEdit}
          />
          <Summary expenses={expenses} />
          <button
            type="button"
            className="btn btn-ghost btn-reset"
            onClick={handleResetMockData}
            data-testid="reset-mock-data-button"
          >
            Reset to mock data
          </button>
        </section>

        <section className="app-column app-column--list">
          <FilterBar filters={filters} onChange={setFilters} />
          <ExpenseList expenses={filteredExpenses} onEdit={handleEdit} onDelete={handleDelete} />
        </section>
      </main>
    </div>
  );
}

export default App;
