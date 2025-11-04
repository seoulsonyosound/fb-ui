import React, { useEffect, useState } from 'react';
import './App.css'
import { getPosts, createPost, updatePost, deletePost } from './api';
import PostList from './components/PostList';
import PostForm from './components/PostForm';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getPosts();
      // normalize to array
      const normalized = Array.isArray(data) ? data : (data && data.data) ? data.data : (data && data.posts) ? data.posts : (Array.isArray(Object.values(data || {})) ? Object.values(data) : []);
      setPosts(Array.isArray(normalized) ? normalized : []);
    } catch (e) {
      console.error('Error loading posts:', e);
      setError('Failed to load posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (payload) => {
    try {
      const created = await createPost(payload);
      console.debug('createPost returned:', created);

      if (created && typeof created === 'object') {
        setPosts((p) => [created, ...p]);
      } else {
        await load();
      }

      return true;
    } catch (e) {
      console.error('Create failed:', e);
      setError('Create failed');
      return false;
    }
  };

  const handleUpdate = async (id, payload) => {
    try {
      const updated = await updatePost(id, payload);
      if (updated && updated.id != null) {
        setPosts((p) => p.map((x) => (x.id === updated.id ? updated : x)));
      } else {
        await load();
      }
      setEditing(null);
      return true;
    } catch (e) {
      console.error('Update failed:', e);
      setError('Update failed');
      return false;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await deletePost(id);
      setPosts((p) => p.filter((x) => x.id !== id));
    } catch (e) {
      console.error('Delete failed:', e);
      setError('Delete failed');
    }
  };

  return (
    <div className="container">
      <h1>Posts</h1>
      {error && <div className="error">{error}</div>}

      <section className="form-section">
        <h2>{editing ? 'Edit Post' : 'Create Post'}</h2>
        <PostForm
          initialData={editing}
          onSave={async (data) => {
            if (editing) {
              const ok = await handleUpdate(editing.id, data);
              if (ok) setEditing(null);
              return ok;
            } else {
              return await handleCreate(data);
            }
          }}
          onCancel={() => setEditing(null)}
        />
      </section>

      <section className="list-section">
        <h2>All Posts</h2>
        {loading ? <div>Loading...</div> : (
          <PostList
            posts={posts}
            onEdit={(post) => setEditing(post)}
            onDelete={(id) => handleDelete(id)}
          />
        )}
      </section>
    </div>
  );
}