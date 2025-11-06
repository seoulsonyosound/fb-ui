// The base URL for the API is read from Vite environment variable VITE_API_BASE.
// In development you can set this in a local .env file (e.g. .env.local):
// VITE_API_BASE=http://localhost:8080
// In production (Render) set VITE_API_BASE to your Render service URL (no trailing slash),
// e.g. https://your-api.onrender.com
const BASE_URL = import.meta.env.VITE_API_BASE || '';
const BASE = `${BASE_URL}/api/posts`.replace(/(?<!:)\/\//g, '/').replace('http:/', 'http://').replace('https:/', 'https://');

async function handleResponse(res) {
  if (!res.ok) {
    const txt = await res.text();
    let message = txt;
    try {
      const json = JSON.parse(txt);
      if (json.message) message = json.message;
    } catch (e) {}
    throw new Error(message || res.statusText);
  }
  return res.json();
}

export async function getPosts() {
  const res = await fetch(BASE);
  return handleResponse(res);
}

export async function createPost(payload) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updatePost(id, payload) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deletePost(id) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Delete failed');
  return true;
}