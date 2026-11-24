import client from './client.js';

export async function getProducts(params) {
  const { data } = await client.get('/products', { params });
  return data;
}

export async function getProduct(id) {
  const { data } = await client.get(`/products/${id}`);
  return data;
}

export async function getFavorites() {
  const { data } = await client.get('/favorites');
  return data;
}

export async function addFavorite(productId) {
  const { data } = await client.post(`/favorites/${productId}`);
  return data;
}

export async function removeFavorite(productId) {
  await client.delete(`/favorites/${productId}`);
}

export async function getBasket() {
  const { data } = await client.get('/basket');
  return data;
}

export async function addBasketItem(productId, quantity = 1) {
  const { data } = await client.post('/basket/items', { productId, quantity });
  return data;
}

export async function removeBasketItem(productId) {
  const { data } = await client.delete(`/basket/items/${productId}`);
  return data;
}
