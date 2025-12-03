// src/cartApi.js
const CART_API = 'http://localhost:5001/api/cart';

export async function setCartQuantity(productId, quantity) {
  const token = localStorage.getItem('token');

  const res = await fetch(CART_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify({ productId, quantity }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('setCartQuantity failed:', res.status, text);
    throw new Error('Failed to update cart');
  }

  // expected: { productId, quantity }
  return res.json();
}
