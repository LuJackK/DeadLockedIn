import React, { useEffect, useState } from 'react';
import axios from 'axios';


function MatchPreview({ match }) {
  const [heroImg, setHeroImg] = useState(null);

  useEffect(() => {
    async function fetchHeroImage() {
      try {
        const response = await axios.get('http://88.200.63.148:5002/api/hero');
        const heroes = response.data;
        const hero = heroes.find(h => h.hero_id === match.hero_id);
        setHeroImg(hero.image_url);
      } catch (error) {
        setHeroImg(null);
      }
    }
    fetchHeroImage();
  }, [match.hero]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      background: '#181a20',
      borderRadius: '14px',
      marginBottom: '14px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
      padding: '12px 24px',
      color: '#eaeaea',
      fontFamily: 'inherit',
      fontSize: '1.08em',
      border: '2px solid #2e3a45',
      minHeight: '72px',
    }}>
      {/* Hero image and name */}
      <div style={{ display: 'flex', alignItems: 'center', flex: 2 }}>
        {heroImg && (
          <img src={heroImg} alt={match.hero_id} style={{ height: '54px', width: '49px', objectFit: 'cover', borderRadius: '12px', marginRight: '18px', background: '#23272f' }} />
        )}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{
            color: match.match_result === 1 ? '#61ffb3' : '#ff6f6f',
            fontStyle: 'italic',
            fontWeight: 600
          }}>{match.match_result === 1 ? 'Victory' : 'Defeat'}</span>
        </div>
      </div>
      {/* Kills/Deaths/Assists with slash separators */}
      <div style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: '1.18em', color: '#ffe066', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ color: '#bdbdbd', fontWeight: 600, fontSize: '0.98em', marginBottom: '2px' }}>KDA:</span>
        <span>{(match.player_kills ?? 10)}/{(match.player_deaths ?? 3)}/{(match.player_assists ?? 21)}</span>
      </div>
      {/* Net Worth (Souls) */}
      <div style={{ flex: 1, textAlign: 'center', fontWeight: 600, fontSize: '1.08em', color: '#bdbdbd', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ color: '#bdbdbd', fontWeight: 600, fontSize: '0.98em', marginBottom: '2px' }}>Souls:</span>
        <span>{match.net_worth ? `${Math.round(match.net_worth / 1000)}k` : '0k'}</span>
      </div>
      {/* Date and time */}
      <div style={{ flex: 1, textAlign: 'center', color: '#bdbdbd', fontSize: '0.98em', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span role="img" aria-label="calendar" style={{ fontSize: '1.1em' }}>📅</span>
          {(() => {
            const ts = match.start_time ?? 1750387487;
            const date = new Date(ts * 1000);
            return date.toLocaleDateString();
          })()}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span role="img" aria-label="clock" style={{ fontSize: '1.1em' }}>⏰</span>
          {(() => {
            const secs = match.match_duration_s ?? 1881;
            const min = Math.floor(secs / 60);
            const sec = secs % 60;
            return `${min}:${sec.toString().padStart(2, '0')}`;
          })()}
        </span>
      </div>
    </div>
  );
}

export default MatchPreview;
