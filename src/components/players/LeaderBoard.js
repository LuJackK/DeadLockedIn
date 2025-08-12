import React, { useEffect, useState } from 'react';
import Player from './Player';
import axios from 'axios';
function LeaderBoard() {
	const [players, setPlayers] = useState([]);

	useEffect(() => {
		async function fetchLeaderboard() {
			try {
				const response = await axios.get('https://api.deadlock-api.com/v1/leaderboard/Europe');
				setPlayers(response.data.entries);
			} catch (error) {
				console.error('Failed to fetch leaderboard:', error);
			}
		}
		fetchLeaderboard();
	}, []);

	return (
		<div style={{ maxWidth: '900px', margin: '40px auto', padding: '24px', background: '#23272f', borderRadius: '18px', color: '#eaeaea', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
			<h2 style={{ textAlign: 'center', marginBottom: '24px', fontWeight: 700 }}>Player Leaderboard</h2>
			<div style={{ display: 'flex', fontWeight: 'bold', padding: '10px 0', borderBottom: '2px solid #444', background: '#181818', color: '#bdbdbd', fontSize: '1.1em' }}>
				<div style={{ flex: 1, textAlign: 'center' }}>#Rank</div>
				<div style={{ flex: 2, textAlign: 'center' }}>Player</div>
				<div style={{ flex: 3, textAlign: 'center' }}>Played Heroes</div>
				<div style={{ flex: 2, textAlign: 'center' }}>In Game Rank</div>
			</div>
			{players.map(player => (
				<Player
					rank={player.rank}
					playerName={player.account_name}
					ids={player.possible_account_ids}
					heroIds={player.top_hero_ids}
					inGameRank={player.ranked_rank}
				/>
			))}
		</div>
	);
}

export default LeaderBoard;
