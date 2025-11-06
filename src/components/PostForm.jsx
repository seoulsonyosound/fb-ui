// src/components/PostForm.jsx
import React, { useState } from 'react';
import { createPost } from '../api';

export default function PostForm({ onCreated }) {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { author, content, imageUrl };
      const created = await createPost(payload);
      if (onCreated) onCreated(created);
      setAuthor('');
      setContent('');
      setImageUrl('');
    } catch (err) {
      console.error('Save failed', err);
      setError(err.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Create post form">
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="form-group">
        <label htmlFor="post-author">Author</label>
        <input id="post-author" className="form-control" value={author} onChange={e => setAuthor(e.target.value)} />
      </div>

      <div className="form-group">
        <label htmlFor="post-content">Content</label>
        <textarea id="post-content" className="form-control" value={content} onChange={e => setContent(e.target.value)} />
      </div>

      <div className="form-group">
        <label htmlFor="post-image">Image URL (optional)</label>
        <input id="post-image" className="form-control" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>Save</button>
    </form>
  );
}