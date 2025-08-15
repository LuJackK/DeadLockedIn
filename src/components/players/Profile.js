import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router';
import axios from 'axios';
import MatchPreview from './MatchPreview';

function Profile() {
  const { id } = useParams();
  const location = useLocation();
  const playerName = location.state?.playerName || '';
  const playerId = location.state?.playerId || id;
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [steamProfiles, setSteamProfiles] = useState([]);
  const [matchHistory, setMatchHistory] = useState([]);
  const [visibleCount, setVisibleCount] = useState(20);

  useEffect(() => {
    console.log(playerId, playerName);
    async function fetchAll() {
      try {
        const searchName = playerName
        if (searchName) {
          const steamRes = await axios.get(`https://api.deadlock-api.com/v1/players/steam-search?search_query='${searchName}'`);
          const allProfiles = steamRes.data || [];
          // Filter profiles by possible_account_ids
          let matchingProfiles = allProfiles && playerId
            ? Object.values(allProfiles).filter(profile => playerId === profile.account_id)
            : [];
          // Sort by match history count (descending)
          if (matchingProfiles.length > 1) {
            // Fetch match history for each profile
            const histories = await Promise.all(matchingProfiles.map(profile =>
              axios.get(`https://api.deadlock-api.com/v1/players/${profile.account_id}/match-history`).then(res => res.data.length || 0)
            ));
            matchingProfiles = matchingProfiles
              .map((profile, idx) => ({ ...profile, matchCount: histories[idx] }))
              .sort((a, b) => b.matchCount - a.matchCount);
          }
          setSteamProfiles(matchingProfiles);
        }
        // Fetch match history using the first possible_account_id
        if (playerId) {
          const matchRes = await axios.get(`https://api.deadlock-api.com/v1/players/${playerId}/match-history`);
          setMatchHistory(matchRes.data || []);
        }
        if (playerId) {
            const playerRes = await axios.get(`https://api.deadlock-api.com/v1/players/mmr?account_ids=${playerId}`);
            setPlayer(playerRes.data || {});
             console.log('Steam Profiles:', playerRes.data);
        }
      }  
      finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [playerId, playerName]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
 console.log(matchHistory);
  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', padding: '24px', background: '#23272f', borderRadius: '18px', color: '#eaeaea', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '32px', background: '#181a20', borderRadius: '16px', padding: '18px 32px', boxShadow: '0 2px 12px rgba(0,0,0,0.18)' }}>
        <img src={steamProfiles[0].avatarfull} alt="avatar" style={{ width: '84px', height: '84px', borderRadius: '16px', marginRight: '28px', background: '#61ffb3', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
            <span style={{ fontWeight: 900, fontSize: '2.2em', color: '#eaeaea', letterSpacing: '1px', textShadow: '0 2px 8px #23272f' }}>{playerName}</span>
            <span style={{ fontSize: '1.5em', color: '#ffe066', fontWeight: 700 }}>★</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src="/path/to/rank-icon.png" alt="rank" style={{ width: '64px', height: '64px', borderRadius: '12px', background: '#23272f' }} />
              <span style={{ fontWeight: 700, fontSize: '1.3em', color: '#eaeaea' }}>{player[0]?.division_tier || 'Eternus VI'}</span>
            </div>
          </div>
        </div>
      </div>
      
      <h3 style={{ marginTop: '32px', marginBottom: '12px' }}>Recent Match History</h3>
      
      {matchHistory.length === 0 ? (
        <div>No match history found.</div>
      ) : (
        <div>
          {Object.values(matchHistory).slice(0, visibleCount).map((match) => (
            <MatchPreview key={match.match_id} match={match} />
          ))}
          {visibleCount < matchHistory.length && (
            <div style={{ textAlign: 'center', marginTop: '18px' }}>
              <button
                style={{
                  background: '#61dafb',
                  color: '#23272f',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 28px',
                  fontWeight: 700,
                  fontSize: '1.08em',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.18)'
                }}
                onClick={() => setVisibleCount(visibleCount + 20)}
              >
                Show More
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
