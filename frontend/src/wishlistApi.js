// src/wishlistApi.js
const WISHLIST_API = 'http://localhost:5001/api/wishlist';

export async function getWishlist() {
  const token = localStorage.getItem('token');

  const res = await fetch(WISHLIST_API, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  if (!res.ok) {
    console.error('getWishlist response:', res.status);
    throw new Error('Failed to fetch wishlist');
  }

  return res.json();
}

export async function toggleWishlist(productId) {
  const token = localStorage.getItem('token');

  const res = await fetch(WISHLIST_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify({ productId }),
  });

  if (!res.ok) {
    console.error('toggleWishlist response:', res.status);
    throw new Error('Failed to update wishlist');
  }

  return res.json();
}
