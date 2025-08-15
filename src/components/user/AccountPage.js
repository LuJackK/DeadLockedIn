import React, { useEffect, useState } from 'react';
import MatchPreview from '../players/MatchPreview';
import Login from './Login';
import Post from '../community-blog/Post';

// Steam linking form component
function LinkSteamForm({ onLinked }) {
  const [playerId, setPlayerId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleLink = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch('http://88.200.63.148:5002/api/link-account', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ steamId: playerId })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        if (onLinked) onLinked();
      } else {
        setError(data.error || 'Failed to link account.');
      }
    } catch (err) {
      setError('Server error.');
    }
    setLoading(false);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '24px' }}>
      <textarea
        placeholder="paste player id"
        value={playerId}
        onChange={e => setPlayerId(e.target.value)}
        style={{ width: '80%', minHeight: '40px', borderRadius: '8px', border: '1px solid #353a45', background: '#181818', color: '#eaeaea', fontSize: '1em', marginBottom: '12px', padding: '8px' }}
        disabled={loading}
      />
      <br />
      <button
        style={{ padding: '10px 24px', borderRadius: '8px', background: '#353a45', color: '#eaeaea', fontWeight: 600, fontSize: '1em', border: 'none', cursor: 'pointer' }}
        onClick={handleLink}
        disabled={loading || !playerId}
      >
        {loading ? 'Linking...' : 'Link Steam Profile'}
      </button>
      {error && <div style={{ color: '#ff6161', marginTop: '10px' }}>{error}</div>}
      {success && <div style={{ color: '#61ffb3', marginTop: '10px' }}>Steam profile linked!</div>}
    </div>
  );
}
function AccountPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userPosts, setUserPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [matchHistory, setMatchHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('http://88.200.63.148:5002/api/info', {
          credentials: 'include',
        });
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      }
      setLoading(false);
    }
    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchUserPosts() {
      if (!user || !user.username) return;
      setLoadingPosts(true);
      try {
        const res = await fetch(`http://88.200.63.148:5002/api/blog/all`);
        const data = await res.json();
        if (data.success && Array.isArray(data.posts)) {
          const filtered = data.posts.filter(post => post.author === user.username);
          setUserPosts(filtered);
        } else {
          setUserPosts([]);
        }
      } catch (err) {
        setUserPosts([]);
      }
      setLoadingPosts(false);
    }
    fetchUserPosts();

    async function fetchMatchHistory() {
      if (!user || !user.steam_id) return;
      setLoadingHistory(true);
      try {
        const res = await fetch(`https://api.deadlock-api.com/v1/players/${user.steam_id}/match-history`);
        const data = await res.json();
        setMatchHistory(Array.isArray(data) ? data : []);
      } catch (err) {
        setMatchHistory([]);
      }
      setLoadingHistory(false);
    }
    if (user && user.steam_id) {
      fetchMatchHistory();
    }
  }, [user]);

  if (loading) {
    return <div style={{ color: '#eaeaea', textAlign: 'center', marginTop: '64px' }}>Loading...</div>;
  }

  if (!user) {
    return <Login onLogin={async () => {
      setLoading(true);
      try {
        const res = await fetch('http://88.200.63.148:5002/api/info', { credentials: 'include' });
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
        }
      } catch (err) {
        setUser(null);
      }
      setLoading(false);
    }} />;
  }

  // User is logged in, show account info, posts, and match history if linked
  return (
    <div style={{ background: '#23272f', color: '#eaeaea', borderRadius: '18px', boxShadow: '0 4px 24px rgba(0,0,0,0.4)', padding: '32px', maxWidth: '700px', margin: '64px auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '24px', fontWeight: 700 }}>Account</h2>
      <div style={{ fontSize: '1.1em', marginBottom: '18px', textAlign: 'center' }}>
        <div><span style={{ color: '#61dafb' }}>Username:</span> {user.username}</div>
        <div><span style={{ color: '#61dafb' }}>Joined:</span> {user.created_on ? new Date(user.created_on).toLocaleDateString() : ''}</div>
      </div>
      {user.steam_id == null && (
        <LinkSteamForm onLinked={async () => {
          setLoading(true);
          try {
            const res = await fetch('http://88.200.63.148:5002/api/info', { credentials: 'include' });
            const data = await res.json();
            if (data.success && data.user) {
              setUser(data.user);
            }
          } catch (err) {
            setUser(null);
          }
          setLoading(false);
        }} />
      )}
      {user.steam_id && (
        <div style={{ marginTop: '40px' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '18px', fontWeight: 700 }}>Your Match History</h3>
          {loadingHistory ? (
            <div style={{ textAlign: 'center', color: '#bdbdbd' }}>Loading match history...</div>
          ) : matchHistory.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#bdbdbd' }}>No match history found.</div>
          ) : (
            <div>
              {matchHistory.slice(0, visibleCount).map(match => (
                <MatchPreview key={match.match_id} match={match} />
              ))}
              {visibleCount < matchHistory.length && (
                <div style={{ textAlign: 'center', marginTop: '18px' }}>
                  <button
                    style={{ background: '#61dafb', color: '#23272f', border: 'none', borderRadius: '8px', padding: '10px 28px', fontWeight: 700, fontSize: '1.08em', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}
                    onClick={() => setVisibleCount(visibleCount + 20)}
                  >
                    Show More
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      <div style={{ marginTop: '40px' }}>
        <h3 style={{ textAlign: 'center', marginBottom: '18px', fontWeight: 700 }}>Your Blog Posts</h3>
        {loadingPosts ? (
          <div style={{ textAlign: 'center', color: '#bdbdbd' }}>Loading posts...</div>
        ) : userPosts.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#bdbdbd' }}>No posts found.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {userPosts.map(post => (
              <Post
                key={post.bid}
                id={post.bid}
                title={post.title}
                content={post.content}
                author={post.author}
                published_on={post.published_on}
                tags={post.tags}
                image_url={post.image_url}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AccountPage;
