import { CATEGORIES } from '../data/mockExpenses';

export default function FilterBar({ filters, onChange }) {
  function handleChange(e) {
    const { name, value } = e.target;
    onChange({ ...filters, [name]: value });
  }

  return (
    <div className="filter-bar" data-testid="filter-bar">
      <input
        type="text"
        name="search"
        placeholder="Search expenses..."
        value={filters.search}
        onChange={handleChange}
        data-testid="filter-search-input"
      />
      <select
        name="category"
        value={filters.category}
        onChange={handleChange}
        data-testid="filter-category-select"
      >
        <option value="All">All Categories</option>
        {CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <select
        name="sort"
        value={filters.sort}
        onChange={handleChange}
        data-testid="filter-sort-select"
      >
        <option value="date-desc">Newest first</option>
        <option value="date-asc">Oldest first</option>
        <option value="amount-desc">Amount: High to Low</option>
        <option value="amount-asc">Amount: Low to High</option>
      </select>
    </div>
  );
}
