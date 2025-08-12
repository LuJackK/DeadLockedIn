import React from 'react';
import { useNavigate } from 'react-router';

function Player({ rank, playerName, ids, heroIds, inGameRank }) {
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
			 <div style={{ flex: 3, textAlign: 'center' }}>{heroIds && heroIds.length > 0 ? heroIds.join(', ') : '-'}</div>
			 <div style={{ flex: 2, textAlign: 'center' }}>{inGameRank}</div>
		 </div>
	 );
}

export default Player;
