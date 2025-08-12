import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router';
import axios from 'axios';

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

  useEffect(() => {
    console.log(playerId, playerName);
    async function fetchAll() {
      try {
        const searchName = playerName
        if (searchName) {
          const steamRes = await axios.get(`https://api.deadlock-api.com/v1/players/steam-search?search_query='${searchName}'`);
          const allProfiles = steamRes || [];
          // Filter profiles by possible_account_ids
          const matchingProfiles = allProfiles && playerId
            ? Object.values(allProfiles).filter(profile => playerId === profile.account_id)
            : [];
          setSteamProfiles(matchingProfiles);
        }
        // Fetch match history using the first possible_account_id
        if (playerId) {
          const matchRes = await axios.get(`https://api.deadlock-api.com/v1/players/${playerId}/match-history`);
          setMatchHistory(matchRes.data || []);
        }
        if (playerId) {
            const playerRes = await axios.get(`https://api.deadlock-api.com/v1/players/mmr?account_ids=${playerId}`);
            setPlayer(playerRes || {});
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
          <img src={steamProfiles?.avatar} alt="avatar" style={{ width: '48px', height: '48px', borderRadius: '50%', marginRight: '16px' }} />
        
        <h2 style={{ fontWeight: 700 }}>Player Profile: {playerName}</h2>
      </div>
      <div style={{ marginBottom: '16px' }}><strong>Rank:</strong> {player.rank}</div>
      <div style={{ marginBottom: '16px' }}><strong>Badge Level:</strong> {player.badge_level}</div>
      <div style={{ marginBottom: '16px' }}><strong>In Game Rank:</strong> {player.division} (Subrank: {player.division_tier})</div>
      
      <h3 style={{ marginTop: '32px', marginBottom: '12px' }}>Recent Match History</h3>
      
      {matchHistory.length === 0 ? (
        <div>No match history found.</div>
      ) : (
        <ul>
          {Object.values(matchHistory).map((match) => (
            <li key={match.match_id} style={{ marginBottom: '10px', background: '#181818', padding: '10px', borderRadius: '8px' }}>
              <div><strong>Match ID:</strong> {match.match_id}</div>
              <div><strong>Hero Played:</strong> {match.hero_id}</div>
              <div><strong>Kills:</strong> {match.player_kills} | <strong>Deaths:</strong> {match.player_deaths} | <strong>Assists:</strong> {match.player_assists}</div>
              <div><strong>Net Worth:</strong> {match.net_worth}</div>
              <div><strong>Damage:</strong> {match.damage !== undefined ? match.damage : '-'}</div>
              <div><strong>Match Result:</strong> {match.match_result === 1 ? 'Win' : 'Loss'}</div>
              <div><strong>Hero Level:</strong> {match.hero_level}</div>
              <div><strong>Last Hits:</strong> {match.last_hits}</div>
              <div><strong>Denies:</strong> {match.denies}</div>
              <div><strong>Match Duration (s):</strong> {match.match_duration_s}</div>
              {/* Add more match info as needed */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Profile;
