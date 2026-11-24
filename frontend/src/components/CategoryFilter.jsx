import { useMemo, useState } from 'react';

const TOP_COUNT = 5;

export const formatCategory = (slug) =>
  slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

export default function CategoryFilter({ categories, selected, onSelect }) {
  const [expanded, setExpanded] = useState(false);

  const { top, rest } = useMemo(() => {
    const sorted = [...categories].sort(
      (a, b) => b.productCount - a.productCount || a.slug.localeCompare(b.slug),
    );
    return { top: sorted.slice(0, TOP_COUNT), rest: sorted.slice(TOP_COUNT) };
  }, [categories]);

  if (categories.length === 0) return null;

  const selectedInRest = rest.some((c) => c.slug === selected);
  const showRest = expanded || selectedInRest;

  const renderPill = (c) => (
    <li key={c.slug}>
      <button
        type="button"
        className={`category-pill ${selected === c.slug ? 'active' : ''}`}
        aria-pressed={selected === c.slug}
        onClick={() => onSelect(selected === c.slug ? '' : c.slug)}
      >
        {formatCategory(c.slug)}
        <span className="category-count">{c.productCount}</span>
      </button>
    </li>
  );

  return (
    <nav className="category-filter" aria-label="Filter by category">
      <ul className="category-list">
        <li>
          <button
            type="button"
            className={`category-pill ${!selected ? 'active' : ''}`}
            aria-pressed={!selected}
            onClick={() => onSelect('')}
          >
            All products
          </button>
        </li>
        {top.map(renderPill)}
        {showRest && rest.map(renderPill)}
        {rest.length > 0 && !selectedInRest && (
          <li>
            <button
              type="button"
              className="category-toggle"
              aria-expanded={showRest}
              onClick={() => setExpanded((v) => !v)}
            >
              {showRest ? '− Fewer categories' : `+ ${rest.length} more categories`}
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
