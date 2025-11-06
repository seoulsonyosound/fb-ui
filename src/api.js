// Centralized API helper — tolerates empty/non-JSON responses and exports CRUD helpers
const API_BASE = process.env.REACT_APP_API_URL || '/api';

async function parseResponse(res) {
  // Safely read text and parse JSON only when appropriate
  const text = await res.text().catch(() => '');
  const contentType = res.headers.get('content-type') || '';
  const isJson = text && contentType.includes('application/json');
  const data = isJson ? JSON.parse(text) : (text ? text : null);
  return { ok: res.ok, status: res.status, data, text };
}

async function handleResponse(res) {
  const { ok, status, data, text } = await parseResponse(res);
  if (!ok) {
    const message = (data && typeof data === 'object' && data.message) ? data.message : (typeof data === 'string' ? data : res.statusText);
    const err = new Error(message || `HTTP ${status}`);
    err.status = status;
    err.body = data ?? text;
    throw err;
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
  // Backend might return created resource or an empty body — handle both
  return handleResponse(res);
}

export async function updatePost(id, post) {
  // Use PUT by default; change to PATCH if your backend expects partial updates
  const res = await fetch(`${API_BASE}/posts/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post),
  });
  return handleResponse(res);
}

export async function deletePost(id) {
  const res = await fetch(`${API_BASE}/posts/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  // Some APIs return empty body on delete — handle gracefully
  return handleResponse(res).catch(err => {
    // if backend returns 204 No Content, handleResponse may throw when parsing — allow a successful delete
    if (err.status === 204) return null;
    throw err;
  });
}