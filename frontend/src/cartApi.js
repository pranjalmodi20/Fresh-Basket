// src/cartApi.js
const CART_API = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/api/cart`
  : 'https://fresh-basket-sno7.onrender.com/api/cart';

export async function getCart() {
  const token = localStorage.getItem('token');

  const res = await fetch(CART_API, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('getCart failed:', res.status, text);
    throw new Error('Failed to fetch cart');
  }

  return res.json();
}

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
