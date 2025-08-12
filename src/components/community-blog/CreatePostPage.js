import React, { useState } from 'react';
import { useNavigate } from 'react-router';

function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Removed file upload logic

  const handleTagAdd = (e) => {
    e.preventDefault();
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  const handleTagRemove = (tag) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      setError('Please fill in all fields.');
      setSuccess('');
      return;
    }
    setError('');
    setSuccess('');
  let image_url = imageUrl;
    try {
      const res = await fetch('http://88.200.63.148:5002/api/blog/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, tags, image_url}),
        credentials: 'include' 
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Post created!');
        setTimeout(() => navigate('/blog'), 1200);
      } else {
        setError(data.error || 'Failed to create post.');
      }
    } catch (err) {
      setError('Server error.');
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', padding: '24px', background: '#23272f', borderRadius: '18px', color: '#eaeaea', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '24px', fontWeight: 700 }}>Create Blog Post</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ padding: '12px', borderRadius: '8px', border: '1px solid #444', background: '#181818', color: '#eaeaea', fontSize: '1em' }}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={e => setContent(e.target.value)}
          style={{ padding: '12px', borderRadius: '8px', border: '1px solid #444', background: '#181818', color: '#eaeaea', fontSize: '1em', minHeight: '120px' }}
        />
        <div>
          <label style={{ fontWeight: 600 }}>Tags:</label>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
            {tags.map(tag => (
              <span key={tag} style={{ background: '#353a45', color: '#eaeaea', borderRadius: '6px', padding: '6px 12px', marginRight: '4px', fontSize: '0.98em' }}>
                {tag}
                <button type="button" style={{ marginLeft: '8px', background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontWeight: 700 }} onClick={() => handleTagRemove(tag)}>×</button>
              </span>
            ))}
          </div>
          <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Add a tag"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              style={{ padding: '8px', borderRadius: '6px', border: '1px solid #444', background: '#181818', color: '#eaeaea', fontSize: '1em' }}
            />
            <button type="button" style={{ padding: '8px 16px', borderRadius: '6px', background: '#353a45', color: '#eaeaea', fontWeight: 600, border: 'none', cursor: 'pointer' }} onClick={handleTagAdd}>Add Tag</button>
          </div>
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Image URL:</label>
          <input
            type="text"
            placeholder="Paste image URL here"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            style={{ marginTop: '8px', padding: '8px', borderRadius: '6px', border: '1px solid #444', background: '#181818', color: '#eaeaea', fontSize: '1em', width: '100%' }}
          />
          {imageUrl && (
            <img src={imageUrl} alt="Preview" style={{ marginTop: '12px', maxWidth: '100%', borderRadius: '12px' }} />
          )}
        </div>
        {error && <div style={{ color: '#ff6b6b', fontSize: '0.98em', textAlign: 'center' }}>{error}</div>}
        {success && <div style={{ color: '#4caf50', fontSize: '0.98em', textAlign: 'center' }}>{success}</div>}
        <button type="submit" style={{ padding: '12px', borderRadius: '8px', border: 'none', background: '#353a45', color: '#eaeaea', fontWeight: 600, fontSize: '1em', cursor: 'pointer', marginTop: '8px' }}>Create Post</button>
      </form>
    </div>
  );
}

export default CreatePostPage;
