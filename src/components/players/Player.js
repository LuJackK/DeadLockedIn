import React from 'react';
import { useNavigate } from 'react-router';

function Player({ rank, playerName, ids, heroImages, inGameRank }) {
	 const navigate = useNavigate();

		 const handleClick = () => {
			 if (ids && ids.length > 0) {
				 navigate(`/profile/${ids[0]}`, { state: { playerName, playerId: ids[0] } });
			 }
		 };

	 return (
		 <div
			 style={{ display: 'flex', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #353a45', background: '#181818', color: '#eaeaea', fontSize: '1em', cursor: 'pointer' }}
			 onClick={handleClick}
			 title={`View profile for ${playerName}`}
		 >
			 <div style={{ flex: 1, textAlign: 'center' }}>{rank}</div>
			 <div style={{ flex: 2, textAlign: 'center', fontWeight: 600 }}>{playerName}</div>
			 <div style={{ flex: 3, textAlign: 'center' }}>
				 {heroImages && heroImages.length > 0 ? (
					 <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
						 {heroImages.map((img, idx) =>
							img ? <img key={idx} src={img} alt="Hero" style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #353a45', background: '#23272f' }} /> : null
						 )}
					 </div>
				 ) : '-'}
			 </div>
			 <div style={{ flex: 2, textAlign: 'center' }}>{inGameRank}</div>
		 </div>
	 );
}

export default Player;
