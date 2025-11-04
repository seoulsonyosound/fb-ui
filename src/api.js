const DEFAULT_BASE = '/api/posts';

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE)
  ? `${import.meta.env.VITE_API_BASE.replace(/\/$/, '')}/api/posts`
  : DEFAULT_BASE;

function isHtml(text) {
  return typeof text === 'string' && /^\s*<!doctype html>/i.test(text);
}

async function handleResponse(res) {
  const bodyText = await res.text();

  if (!res.ok) {
    const message = isHtml(bodyText) ? `Server returned HTML (status ${res.status})` : (bodyText || res.statusText);
    console.error('API error response:', { status: res.status, body: bodyText });
    throw new Error(`HTTP ${res.status}: ${message}`);
  }

  if (res.status === 204 || !bodyText) return null;

  try {
    return JSON.parse(bodyText);
  } catch (e) {
    return bodyText;
  }
}

export async function getPosts() {
  const url = API_BASE;
  console.debug('getPosts ->', url);
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  return handleResponse(res);
}

export async function createPost(payload) {
  const url = API_BASE;
  console.debug('createPost ->', url, payload);
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updatePost(id, payload) {
  if (id == null) throw new Error('updatePost called with undefined id');
  const url = `${API_BASE}/${encodeURIComponent(id)}`;
  console.debug('updatePost ->', url, payload);
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deletePost(id) {
  if (id == null) throw new Error('deletePost called with undefined id');
  const url = `${API_BASE}/${encodeURIComponent(id)}`;
  console.debug('deletePost ->', url);
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { Accept: 'application/json' },
  });
  return handleResponse(res);
}