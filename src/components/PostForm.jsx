import React, { useState } from 'react';
import { createPost } from '../api';

export default function PostForm({ onCreated }) {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { author, content, imageUrl };
      const created = await createPost(payload);
      if (created && created.id) {
        // backend returned created resource
        onCreated(created);
      } else {
        // backend returned empty body: trigger a refresh or construct a minimal local object
        // simplest: re-fetch in parent (signal parent to re-fetch)
        onCreated(null); // parent can call getPosts() again
      }
      setAuthor('');
      setContent('');
      setImageUrl('');
    } catch (err) {
      console.error('Create failed', err);
      setError(err.message || 'Create failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}
      <label htmlFor="post-author">Author</label>
      <input id="post-author" value={author} onChange={e => setAuthor(e.target.value)} />
      <label htmlFor="post-content">Content</label>
      <textarea id="post-content" value={content} onChange={e => setContent(e.target.value)} />
      <label htmlFor="post-image">Image URL</label>
      <input id="post-image" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
      <button type="submit" disabled={loading}>Save</button>
    </form>
  );
}