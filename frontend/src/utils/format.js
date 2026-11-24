const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export const formatPrice = (value) => currency.format(Number(value) || 0);

export const originalPrice = (price, discountPercentage) =>
  discountPercentage > 0 ? price / (1 - discountPercentage / 100) : null;
