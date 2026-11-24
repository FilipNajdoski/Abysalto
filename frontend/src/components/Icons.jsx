export function HeartIcon({ filled = false }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"
      fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
      <path d="M12 20.5s-7.5-4.6-9.3-9.4C1.5 7.8 3.6 4.5 7 4.5c2 0 3.5 1.1 5 3 1.5-1.9 3-3 5-3 3.4 0 5.5 3.3 4.3 6.6-1.8 4.8-9.3 9.4-9.3 9.4z" />
    </svg>
  );
}

export function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"
      fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 8h14l-1.2 12H6.2L5 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

export function StarRating({ value }) {
  const rounded = Math.round(Number(value) * 2) / 2;
  return (
    <span className="rating" aria-label={`Rated ${value} out of 5`}>
      {'★★★★★'.split('').map((star, i) => (
        <span key={i} className={i < Math.floor(rounded) ? 'on' : ''}>{star}</span>
      ))}
      <small>{Number(value).toFixed(1)}</small>
    </span>
  );
}
