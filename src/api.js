const BASE_URL = import.meta.env.VITE_API_BASE;

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
  
  // Handle 204 No Content or empty responses
  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return null;
  }
  
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return res.json();
  }
  
  // Try to parse as JSON anyway
  const txt = await res.text();
  if (!txt) return null;
  
  try {
    return JSON.parse(txt);
  } catch (e) {
    return txt;
  }
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