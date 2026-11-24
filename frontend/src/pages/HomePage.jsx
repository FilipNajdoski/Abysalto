import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../api/shop.js';
import { getErrorMessage } from '../api/client.js';
import ProductCard from '../components/ProductCard.jsx';

const SORT_OPTIONS = [
  { value: '', label: 'Featured' },
  { value: 'price:asc', label: 'Price: low to high' },
  { value: 'price:desc', label: 'Price: high to low' },
  { value: 'rating:desc', label: 'Top rated' },
  { value: 'discountPercentage:desc', label: 'Biggest discount' },
  { value: 'title:asc', label: 'Alphabetical' },
];
const PAGE_SIZE = 12;

export default function HomePage() {
  const [params, setParams] = useSearchParams();
  const page = Number(params.get('page')) || 1;
  const sort = params.get('sort') || '';
  const search = params.get('q') || '';
  const [searchInput, setSearchInput] = useState(search);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => setSearchInput(search), [search]);

  useEffect(() => {
	const [sortBy, order] = sort.split(':');
	setLoading(true);
	setError('');
	getProducts({ page, pageSize: PAGE_SIZE, sortBy: sortBy || undefined, order, search: search || undefined })
	  .then(setResult)
	  .catch((err) => setError(getErrorMessage(err)))
	  .finally(() => setLoading(false));
  }, [page, sort, search]);

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
		<h1>{search ? `Results for “${search}”` : 'All products'}</h1>
		<p className="muted">Discover our collection — curated, quality goods at fair prices.</p>
	  </section>

	  <div className="toolbar">
		<form onSubmit={onSearch} className="search">
		  <input
			type="search"
			placeholder="Search products"
			value={searchInput}
			onChange={(e) => setSearchInput(e.target.value)}
		  />
		</form>
		<div className="toolbar-right">
		  {result && <span className="muted small">{result.totalCount} products</span>}
		  <select value={sort} onChange={(e) => update({ sort: e.target.value, page: '' })} aria-label="Sort by">
			{SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
		  </select>
		</div>
	  </div>

	  {error && <p className="error">{error}</p>}

	  {loading ? (
		<div className="product-grid">
		  {Array.from({ length: PAGE_SIZE }).map((_, i) => <div key={i} className="skeleton" />)}
		</div>
	  ) : result?.items.length === 0 ? (
		<p className="empty">No products match your search.</p>
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
