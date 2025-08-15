import React from 'react';
import { useLocation } from 'react-router';
import axios from 'axios';
import { useParams } from 'react-router';
function FullPost() {
  const location = useLocation();
  const { id, title, content, author, published_on, tags, image_url } = location.state || {};
  const [likes, setLikes] = React.useState(0);
  const [dislikes, setDislikes] = React.useState(0);
  const [userVote, setUserVote] = React.useState(0); // 1 for like, -1 for dislike, 0 for none
  const [comments, setComments] = React.useState([]);
  const [commentInput, setCommentInput] = React.useState("");
  const [loadingComments, setLoadingComments] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState(null);

  React.useEffect(() => {
    async function fetchVotesAndUserVote() {
      try {
        const votesRes = await axios.get(`http://88.200.63.148:5002/api/blog/vote/${id}`, { withCredentials: true });
        if (votesRes.data.success) {
          const { votes } = votesRes.data;
          setLikes(votes.likes || 0);
          setDislikes(votes.dislikes || 0);
        }
        // Only fetch user vote if logged in
        try {
          const userVoteRes = await axios.get(`http://88.200.63.148:5002/api/blog/user-vote/${id}`, { withCredentials: true });
          if (userVoteRes.data.success) {
            setUserVote(userVoteRes.data.userVote || 0);
          } else {
            setUserVote(0);
          }
        } catch (err) {
          // If not logged in, just set userVote to 0 and do nothing
          setUserVote(0);
        }
      } catch (err) {
        // If not logged in, just do nothing
      }
    }

    async function fetchComments() {
      setLoadingComments(true);
      try {
        const res = await axios.get(`http://88.200.63.148:5002/api/blog/comment/${id}`);
        if (res.data.success) {
          setComments(res.data.comments);
        } else {
          setComments([]);
        }
      } catch (err) {
        setComments([]);
      }
      setLoadingComments(false);
    }

    if (id) {
      fetchVotesAndUserVote();
      fetchComments();
    }
    // Fetch current user info (role)
    async function fetchUser() {
      try {
        const res = await axios.get('http://88.200.63.148:5002/api/info', { withCredentials: true });
        if (res.data.success && res.data.user) {
          setCurrentUser(res.data.user);
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        setCurrentUser(null);
      }
    }
    fetchUser();
  }, [id]);
  // Remove post handler
  const handleRemovePost = async () => {
    if (!id) return;
    try {
      await axios.delete(`http://88.200.63.148:5002/api/blog/${id}`, { withCredentials: true });
      // Optionally redirect or show a message
      window.location.href = '/blog';
    } catch (err) {
      // Handle error
    }
  };

  // Remove comment handler
  const handleRemoveComment = async (commentId) => {
    try {
      await axios.delete(`http://88.200.63.148:5002/api/blog/comment/${commentId}`, { withCredentials: true });
      // Refresh comments
      const commentsRes = await axios.get(`http://88.200.63.148:5002/api/blog/comment/${id}`);
      if (commentsRes.data.success) {
        setComments(commentsRes.data.comments);
      }
    } catch (err) {
      // Handle error
    }
  };


  const handleVote = async (voteType) => {
    let sendVote = voteType;
    // If user clicks the same button again, remove their vote
    if (userVote === voteType) {
      sendVote = 0;
    }
    try {
      await axios.post('http://88.200.63.148:5002/api/blog/vote', 
        { postId: id, voteType: sendVote }, 
        { withCredentials: true }
      );
      // Update UI
      if (sendVote === 1) {
        setLikes(userVote === 1 ? likes - 1 : likes + 1);
        if (userVote === -1) setDislikes(dislikes - 1);
        setUserVote(userVote === 1 ? 0 : 1);
      } else if (sendVote === -1) {
        setDislikes(userVote === -1 ? dislikes - 1 : dislikes + 1);
        if (userVote === 1) setLikes(likes - 1);
        setUserVote(userVote === -1 ? 0 : -1);
      } else if (sendVote === 0) {
        if (userVote === 1) setLikes(likes - 1);
        if (userVote === -1) setDislikes(dislikes - 1);
        setUserVote(0);
      }
    } catch (err) {
      // If not logged in, do nothing
    }
  };

  const handleAddComment = async () => {
    if (!commentInput.trim()) return;
    try {
      const res = await axios.post(
        `http://88.200.63.148:5002/api/blog/comment`,
        { postId: id, content: commentInput },
        { withCredentials: true }
      );
      if (res.data.success) {
        // Refresh comments after successful add
        const commentsRes = await axios.get(`http://88.200.63.148:5002/api/blog/comment/${id}`);
        if (commentsRes.data.success) {
          setComments(commentsRes.data.comments);
        }
        setCommentInput("");
      }
    } catch (err) {
      // If not logged in, do nothing
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', padding: '32px', background: '#181818', borderRadius: '16px', color: '#eaeaea', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
      <h2 style={{ marginBottom: '18px', fontWeight: 900 }}>{title}</h2>
      {/* Remove post button for admin/moderator */}
      {currentUser && (currentUser.role === 'admin') && (
        <button
          onClick={handleRemovePost}
          style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 22px', fontWeight: 700, fontSize: '1em', cursor: 'pointer', marginBottom: '18px' }}
        >
          Remove Post
        </button>
      )}
      <div style={{ fontSize: '1.08em', color: '#bdbdbd', marginBottom: '12px' }}>
        <span>By <span style={{ color: '#4caf50', fontWeight: 700 }}>{author}</span></span>
        {' | '}
        <span>{published_on ? new Date(published_on).toLocaleDateString() : ''}</span>
      </div>
      {image_url && (
        <div style={{ marginBottom: '18px', textAlign: 'center' }}>
          <img src={image_url} alt="Post" style={{ maxWidth: '100%', maxHeight: '340px', borderRadius: '10px', boxShadow: '0 2px 12px rgba(0,0,0,0.18)' }} />
        </div>
      )}
      <p style={{ fontSize: '1.18em', color: '#eaeaea', marginBottom: '18px', lineHeight: '1.6' }}>{content}</p>
      <div style={{ display: 'flex', gap: '18px', marginBottom: '18px' }}>
        <button 
          onClick={() => handleVote(1)} 
          style={{ 
            background: userVote === 1 ? '#21c97a' : '#61dafb', 
            color: '#23272f', 
            border: 'none', 
            borderRadius: '8px', 
            padding: '8px 22px', 
            fontWeight: 700, 
            fontSize: '1.08em', 
            cursor: 'pointer' 
          }}
        >
          👍 Like ({likes})
        </button>
        <button 
          onClick={() => handleVote(-1)} 
          style={{ 
            background: userVote === -1 ? '#d32f2f' : '#ff6f6f', 
            color: '#23272f', 
            border: 'none', 
            borderRadius: '8px', 
            padding: '8px 22px', 
            fontWeight: 700, 
            fontSize: '1.08em', 
            cursor: 'pointer' 
          }}
        >
          👎 Dislike ({dislikes})
        </button>
      </div>
        {/* Add space between likes/dislikes and tags */}
        {tags && tags.length > 0 && (
          <div style={{ marginTop: '28px', marginBottom: '18px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {tags.split(',').map(tag => (
              <span key={tag} style={{ background: '#353a45', color: '#eaeaea', borderRadius: '8px', padding: '8px 16px', fontSize: '1em' }}>{tag}</span>
            ))}
          </div>
        )}
      {/* Comment Section */}
      <div style={{ marginTop: '24px', background: '#23272f', borderRadius: '10px', padding: '18px' }}>
        <h4 style={{ marginBottom: '12px', fontWeight: 700 }}>Comments</h4>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
          <input
            type="text"
            value={commentInput}
            onChange={e => setCommentInput(e.target.value)}
            placeholder="Add a comment..."
            style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #353a45', fontSize: '1em', background: '#181818', color: '#eaeaea' }}
          />
          <button
            onClick={handleAddComment}
            style={{ background: '#61dafb', color: '#23272f', border: 'none', borderRadius: '8px', padding: '8px 18px', fontWeight: 700, fontSize: '1em', cursor: 'pointer' }}
          >
            Add
          </button>
        </div>
        <div>
          {loadingComments ? (
            <div style={{ color: '#bdbdbd', fontStyle: 'italic' }}>Loading comments...</div>
          ) : comments.length === 0 ? (
            <div style={{ color: '#bdbdbd', fontStyle: 'italic' }}>No comments yet.</div>
          ) : (
            comments.map((comment, idx) => (
              <div key={comment.id || idx} style={{ marginBottom: '10px', padding: '10px', background: '#181a20', borderRadius: '6px', color: '#eaeaea', position: 'relative' }}>
                <div style={{ fontWeight: 700, color: '#4caf50', marginBottom: '4px' }}>{comment.user_id || comment.author}</div>
                <div>{comment.content}</div>
                <div style={{ fontSize: '0.9em', color: '#bdbdbd', marginTop: '2px' }}>{comment.date ? new Date(comment.date).toLocaleString() : ''}</div>
                {/* Remove comment button for admin/moderator */}
                {currentUser && (currentUser.role === 'admin' || currentUser.role === 'moderator') && (
                  <button
                    onClick={() => handleRemoveComment(comment.comment_id)}
                    style={{ position: 'absolute', top: '10px', right: '10px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 12px', fontWeight: 600, fontSize: '0.95em', cursor: 'pointer' }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default FullPost;
