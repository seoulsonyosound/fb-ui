// src/api.js
// Centralized API helper that tolerates empty/non-JSON responses
const API_BASE = process.env.REACT_APP_API_URL || '/api';

async function handleResponse(res) {
  const text = await res.text().catch(() => '');
  const contentType = res.headers.get('content-type') || '';

  // Parse JSON only if there is text and the header looks like JSON
  const data = text && contentType.includes('application/json') ? JSON.parse(text) : (text ? text : null);

  if (!res.ok) {
    const message = (data && typeof data === 'object' && data.message) ? data.message : (typeof data === 'string' ? data : res.statusText);
    throw new Error(message || `HTTP ${res.status}`);
  }

  return data;
}

export async function getPosts() {
  const res = await fetch(`${API_BASE}/posts`, { method: 'GET' });
  return handleResponse(res);
}

export async function createPost(post) {
  const res = await fetch(`${API_BASE}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post),
  });
  return handleResponse(res);
}