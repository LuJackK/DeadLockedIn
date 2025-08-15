import React, { useEffect, useState } from 'react';
import Player from './Player';
import axios from 'axios';

function LeaderBoard() {
	const [players, setPlayers] = useState([]);
	const [visibleCount, setVisibleCount] = useState(20);
	const [heroImagesMap, setHeroImagesMap] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchLeaderboardAndHeroes() {
			try {
				const response = await axios.get('https://api.deadlock-api.com/v1/leaderboard/Europe');
				const entries = response.data.entries;
				setPlayers(entries);

				// Gather all unique hero IDs for displayed players
				const allHeroIds = Array.from(new Set(entries.slice(0, visibleCount).flatMap(p => p.top_hero_ids)));
				const heroResponse = await axios.get('http://88.200.63.148:5002/api/hero');
				const heroes = heroResponse.data;
				const map = {};
				allHeroIds.forEach(id => {
					const hero = heroes.find(h => h.hero_id === id || h.hero === id);
					map[id] = hero ? hero.image_url : null;
				});
				setHeroImagesMap(map);
				setLoading(false);
			} catch (error) {
				console.error('Failed to fetch leaderboard or hero images:', error);
				setLoading(false);
			}
		}
		fetchLeaderboardAndHeroes();
	}, [visibleCount]);

	const getHeroImages = (heroIds) => {
		if (!Array.isArray(heroIds)) return [];
		return heroIds.map(id => heroImagesMap[id] || null);
	};

	if (loading) {
		return <div style={{ color: '#eaeaea', textAlign: 'center', marginTop: '40px' }}>Loading leaderboard...</div>;
	}

	return (
		<div style={{ maxWidth: '900px', margin: '40px auto', padding: '24px', background: '#23272f', borderRadius: '18px', color: '#eaeaea', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
			<h2 style={{ textAlign: 'center', marginBottom: '24px', fontWeight: 700 }}>Player Leaderboard</h2>
			<div style={{ display: 'flex', fontWeight: 'bold', padding: '10px 0', borderBottom: '2px solid #444', background: '#181818', color: '#bdbdbd', fontSize: '1.1em' }}>
				<div style={{ flex: 1, textAlign: 'center' }}>#Rank</div>
				<div style={{ flex: 2, textAlign: 'center' }}>Player</div>
				<div style={{ flex: 3, textAlign: 'center' }}>Played Heroes</div>
				<div style={{ flex: 2, textAlign: 'center' }}>In Game Rank</div>
			</div>
			{players.slice(0, visibleCount).map(player => (
				<Player
					key={player.rank}
					rank={player.rank}
					playerName={player.account_name}
					ids={player.possible_account_ids}
					heroImages={getHeroImages(player.top_hero_ids)}
					inGameRank={player.ranked_rank}
				/>
			))}
			{visibleCount < players.length && (
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
	);
}

export default LeaderBoard;
