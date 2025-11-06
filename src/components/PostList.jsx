import React from 'react';

export default function PostList({ posts, onEdit, onDelete }) {
  if (!posts) return <div>No posts yet.</div>;

  if (!Array.isArray(posts)) {
    if (typeof posts === 'object' && posts !== null) {
      const values = Object.values(posts);
      if (Array.isArray(values)) posts = values;
      else {
        console.warn('PostList expected posts to be an array but received (not convertible):', posts);
        return <div>No posts yet.</div>;
      }
    } else {
      console.warn('PostList expected posts to be an array but received:', posts);
      return <div>No posts yet.</div>;
    }
  }

  if (posts.length === 0) return <div>No posts yet.</div>;

  return (
    <div className="post-list">
      {posts.map((p) => (
        <article key={p.id ?? p._id ?? p.uid} className="post">
          <div className="post-header">
            <strong>{p.author}</strong>
            <div className="post-dates">
              {p.createdDate ? new Date(p.createdDate).toLocaleString() : ''}
            </div>
          </div>

          <p className="post-content">{p.content}</p>

          {p.imageUrl ? (
            <div className="post-image">
              <img src={p.imageUrl} alt="post" />
            </div>
          ) : null}

          <div className="post-actions">
            <button onClick={() => onEdit?.(p)}>Edit</button>
            <button className="danger" onClick={() => onDelete?.(p.id)}>Delete</button>
          </div>
        </article>
      ))}
    </div>
  );
}