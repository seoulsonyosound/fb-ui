// src/api.js
// Centralized API helper that tolerates empty/non-JSON responses
const API_BASE = process.env.REACT_APP_API_URL || '/api';

async function handleResponse(res) {
  // read body as text first
  const text = await res.text().catch(() => '');
  const contentType = res.headers.get('content-type') || '';

  // try to parse JSON only if there's text and content-type indicates JSON
  const data = text && contentType.includes('application/json') ? JSON.parse(text) : (text ? text : null);

  if (!res.ok) {
    // backend might return JSON error message or plain text
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
  return handleResponse(res); // will return parsed JSON, text, or null safely
}