import React from 'react';
import { useNavigate } from 'react-router';

function Post({ id, title, content, author, published_on, tags, image_url }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/post/${id}`, {
      state: { id, title, content, author, published_on, tags, image_url }
    });
  };
  const [likes, setLikes] = React.useState(0);
  const [commentsCount, setCommentsCount] = React.useState(0);

  React.useEffect(() => {
    async function fetchLikesAndComments() {
      try {
        // Get likes
        const likesRes = await fetch(`http://88.200.63.148:5002/api/blog/vote/${id}`);
        const likesData = await likesRes.json();
        if (likesData.success) {
          setLikes(likesData.votes.likes || 0);
        }
        // Get comments count
        const commentsRes = await fetch(`http://88.200.63.148:5002/api/blog/comment/${id}`);
        const commentsData = await commentsRes.json();
        if (commentsData.success && Array.isArray(commentsData.comments)) {
          setCommentsCount(commentsData.comments.length);
        }
      } catch (err) {
        setLikes(0);
        setCommentsCount(0);
      }
    }
    if (id) fetchLikesAndComments();
  }, [id]);

  return (
    <article
      style={{ background: '#181818', borderRadius: '12px', padding: '18px', boxShadow: '0 2px 12px rgba(0,0,0,0.2)', cursor: 'pointer', transition: 'box-shadow 0.2s' }}
      onClick={handleClick}>
      <h3 style={{ marginBottom: '12px', fontWeight: 600 }}>{title}</h3>
      <div style={{ fontSize: '0.98em', color: '#bdbdbd', marginBottom: '8px' }}>
        <span>By <span style={{ color: '#4caf50', fontWeight: 600 }}>{author}</span></span>
        {' | '}
        <span>{published_on ? new Date(published_on).toLocaleDateString() : ''}</span>
      </div>
      {image_url && (
        <div style={{ marginBottom: '12px', textAlign: 'center' }}>
          <img src={image_url} alt="Post" style={{ maxWidth: '100%', maxHeight: '220px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }} />
        </div>
      )}
      {tags && tags.length > 0 && (
        <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {tags.split(',').map(tag => (
            <span key={tag} style={{ background: '#353a45', color: '#eaeaea', borderRadius: '6px', padding: '6px 12px', fontSize: '0.95em' }}>{tag}</span>
          ))}
        </div>
      )}
      <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '1.2em', color: '#21c97a' }}>👍</span>
          <span style={{ color: '#eaeaea', fontWeight: 600 }}>{likes}</span>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '1.2em', color: '#61dafb' }}>💬</span>
          <span style={{ color: '#eaeaea', fontWeight: 600 }}>{commentsCount}</span>
        </span>
      </div>
    </article>
  );
}

export default Post;
