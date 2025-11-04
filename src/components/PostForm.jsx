import React, { useEffect, useState } from 'react';

const EMPTY = { author: '', content: '', imageUrl: '' };

export default function PostForm({ initialData = null, onSave, onCancel }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (initialData) {
      setForm({
        author: initialData.author || '',
        content: initialData.content || '',
        imageUrl: initialData.imageUrl || '',
      });
      setErr('');
    } else {
      setForm(EMPTY);
    }
  }, [initialData]);

  const validate = () => {
    if (!form.author.trim()) return 'Author is required';
    if (!form.content.trim()) return 'Content is required';
    if (form.author.length > 200) return 'Author max 200 chars';
    if (form.content.length > 5000) return 'Content max 5000 chars';
    if (form.imageUrl && form.imageUrl.length > 2048) return 'Image URL too long';
    return '';
  };

  const submit = async (e) => {
    e && e.preventDefault();
    const v = validate();
    if (v) {
      setErr(v);
      return;
    }
    setSaving(true);
    setErr('');
    const payload = {
      author: form.author.trim(),
      content: form.content.trim(),
      imageUrl: form.imageUrl?.trim() || null,
    };
    try {
      const ok = await onSave(payload);
      if (ok) {
        setForm(EMPTY);
      } else {
        setErr('Save failed');
      }
    } catch (e) {
      setErr(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="post-form" onSubmit={submit}>
      {err && <div className="error">{err}</div>}
      <div className="field">
        <label>Author</label>
        <input
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
        />
      </div>

      <div className="field">
        <label>Content</label>
        <textarea
          rows={5}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
      </div>

      <div className="field">
        <label>Image URL (optional)</label>
        <input
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
        />
      </div>

      <div className="actions">
        <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}