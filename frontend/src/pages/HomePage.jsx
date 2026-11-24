import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCategories, getProducts } from '../api/shop.js';
import { getErrorMessage } from '../api/client.js';
import ProductCard from '../components/ProductCard.jsx';
import CategoryFilter, { formatCategory } from '../components/CategoryFilter.jsx';

const SORT_OPTIONS = [
  { value: '', label: 'Featured' },
  { value: 'price:asc', label: 'Price: low to high' },
  { value: 'price:desc', label: 'Price: high to low' },
  { value: 'rating:desc', label: 'Top rated' },
  { value: 'discountPercentage:desc', label: 'Biggest discount' },
  { value: 'title:asc', label: 'Alphabetical' },
];
const DEFAULT_PAGE_SIZE = 12;
const PAGE_SIZE_OPTIONS = [12, 24, 48, 96];

export default function HomePage() {
  const [params, setParams] = useSearchParams();
  const page = Number(params.get('page')) || 1;
  const sort = params.get('sort') || '';
  const requestedSize = Number(params.get('pageSize'));
  const pageSize = PAGE_SIZE_OPTIONS.includes(requestedSize) ? requestedSize : DEFAULT_PAGE_SIZE;
  const search = params.get('q') || '';
  const category = params.get('category') || '';
  const [categories, setCategories] = useState([]);
  const [searchInput, setSearchInput] = useState(search);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => setSearchInput(search), [search]);

  useEffect(() => {
	getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
	const [sortBy, order] = sort.split(':');
	setLoading(true);
	setError('');
	getProducts({
	  page,
	  pageSize,
	  sortBy: sortBy || undefined,
	  order,
	  search: search || undefined,
	  category: category || undefined,
	})
	  .then(setResult)
	  .catch((err) => setError(getErrorMessage(err)))
	  .finally(() => setLoading(false));
  }, [page, pageSize, sort, search, category]);

  const update = (changes) => {
	const next = new URLSearchParams(params);
	Object.entries(changes).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)));
	setParams(next);
  };

  const onSearch = (e) => {
	e.preventDefault();
	update({ q: searchInput.trim(), page: '' });
  };

  const goToPage = (p) => {
	update({ page: p > 1 ? String(p) : '' });
	window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
	<div>
	  <section className="hero">
		<h1>{search ? `Results for “${search}”` : category ? formatCategory(category) : 'All products'}</h1>
		<p className="muted">Discover our collection — curated, quality goods at fair prices.</p>
	  </section>

	  <CategoryFilter categories={categories} selected={category} onSelect={(slug) => update({ category: slug, page: '' })} />

	  <div className="toolbar">
		<form onSubmit={onSearch} className="search">
		  <input
			type="search"
			placeholder="Search products"
			value={searchInput}
			onChange={(e) => {
			  const value = e.target.value;
			  setSearchInput(value);
			  if (value.trim() === '' && search) {
				update({ q: '', page: '' });
			  }
			}}
		  />
		</form>
		<div className="toolbar-right">
		  {result && <span className="muted small">{result.totalCount} products</span>}
		  <select value={sort} onChange={(e) => update({ sort: e.target.value, page: '' })} aria-label="Sort by">
			{SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
		  </select>
		  <select
			value={pageSize}
			onChange={(e) => {
			  const size = Number(e.target.value);
			  update({ pageSize: size === DEFAULT_PAGE_SIZE ? '' : String(size), page: '' });
			}}
			aria-label="Products per page"
		  >
			{PAGE_SIZE_OPTIONS.map((n) => <option key={n} value={n}>{n} per page</option>)}
		  </select>
		</div>
	  </div>

	  {error && <p className="error">{error}</p>}

	  {loading ? (
		<div className="product-grid">
		  {Array.from({ length: pageSize }).map((_, i) => <div key={i} className="skeleton" />)}
		</div>
	  ) : result?.items.length === 0 ? (
		<p className="empty">No products match your filters.</p>
	  ) : (
		<div className="product-grid">
		  {result?.items.map((p) => <ProductCard key={p.id} product={p} />)}
		</div>
	  )}

	  {result && result.totalPages > 1 && (
		<nav className="pagination">
		  <button type="button" className="button secondary" disabled={!result.hasPrevious} onClick={() => goToPage(page - 1)}>
			← Previous
		  </button>
		  <span className="muted">Page {result.page} of {result.totalPages}</span>
		  <button type="button" className="button secondary" disabled={!result.hasNext} onClick={() => goToPage(page + 1)}>
			Next →
		  </button>
		</nav>
	  )}
	</div>
  );
}
