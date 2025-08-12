import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Post from '../community-blog/Post';
import { useParams } from 'react-router';

function HeroProfile() {
	const { heroName } = useParams();
	const [hero, setHero] = useState(null);
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);
	const [abilities, setAbilities] = useState([]);
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		fetchHeroData();
		fetchPosts();
	}, [heroName]);

	const fetchHeroData = async () => {
		setLoading(true);
		try {
			const formattedName = heroName.replace(/_/g, ' ');
			const [heroesRes, statsRes, assetsRes] = await Promise.all([
				axios.get('https://assets.deadlock-api.com/v2/heroes'),
				axios.get('https://api.deadlock-api.com/v1/analytics/hero-stats'),
				axios.get('https://assets.deadlock-api.com/v2/items')
			]);
			const heroesData = heroesRes.data;
			const statsData = statsRes.data;
			const assetsData = assetsRes.data;
			const heroObj = Object.values(heroesData).find(h => h.name.toLowerCase() === formattedName.toLowerCase());
			const statObj = heroObj ? statsData.find(s => s.hero_id === heroObj.id) : null;
			setHero(heroObj);
			setStats(statObj);
			let heroAbilities = [];
			if (heroObj && Array.isArray(assetsData)) {
				heroAbilities = assetsData.filter(item => item.hero === heroObj.id && item.type === 'ability');
			}
			setAbilities(heroAbilities);
		} catch (err) {
			setHero(null);
			setStats(null);
			setAbilities([]);
		}
		setLoading(false);
	};

	// Fetch posts from backend API and filter by hero name tag
	const fetchPosts = async () => {
		try {
			const res = await axios.get('http://88.200.63.148:5002/api/blog/all');
			const formattedName = heroName.replace(/_/g, ' ').toLowerCase().trim();
			// tags is expected to be an array of strings
			const filtered = res.data.filter(post =>
				Array.isArray(post.tags) && post.tags.some(tag =>
					typeof tag === 'string' && tag.toLowerCase().trim() === formattedName
				)
			);
			setPosts(filtered);
		} catch (err) {
			setPosts([]);
		}
	};

	if (loading) return <div style={{ color: '#eaeaea', padding: '32px' }}>Loading...</div>;
	if (!hero) return <div style={{ color: '#eaeaea', padding: '32px' }}>Hero not found.</div>;

	return (
		<div style={{ background: '#23272f', color: '#eaeaea', borderRadius: '18px', boxShadow: '0 4px 24px rgba(0,0,0,0.4)', padding: '32px', maxWidth: '900px', margin: '32px auto' }}>
			<div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '32px', gap: '32px' }}>
				{/* Hero image and description container */}
				<div style={{ flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', background: '#23272f', borderRadius: '12px', padding: '18px', boxSizing: 'border-box', minWidth: '0' }}>
					<img src={hero.images?.icon_hero_card} alt={hero.name} style={{ width: '120px', height: '120px', borderRadius: '18px', objectFit: 'cover', border: '2px solid #353a45', marginBottom: '18px' }} />
					<div style={{ width: '100%' }}>
						<h2 style={{ margin: 0, fontSize: '2.2em', fontWeight: 700 }}>{hero.name}</h2>
						{typeof hero.description === 'string' ? (
							<p style={{ color: '#bdbdbd', fontSize: '1.1em', marginTop: '8px', width: '100%' }}>{hero.description}</p>
						) : hero.description && typeof hero.description === 'object' ? (
							<div style={{ color: '#bdbdbd', fontSize: '1.1em', marginTop: '8px', width: '100%' }}>
								{hero.description.lore && <div><strong>Lore:</strong> {hero.description.lore}</div>}
								{hero.description.role && <div><strong>Role:</strong> {hero.description.role}</div>}
								{hero.description.playstyle && <div><strong>Playstyle:</strong> {hero.description.playstyle}</div>}
							</div>
						) : (
							<p style={{ color: '#bdbdbd', fontSize: '1.1em', marginTop: '8px', width: '100%' }}>No description available.</p>
						)}
					</div>
				</div>
				{/* Abilities container */}
				<div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '18px', alignItems: 'flex-start', background: '#23272f', borderRadius: '12px', padding: '18px', boxSizing: 'border-box', minWidth: '0' }}>
					<h3 style={{ color: '#eaeaea', fontWeight: 600, fontSize: '1.1em', marginBottom: '12px' }}>Abilities</h3>
					{abilities.length > 1 ? abilities.slice(1).map(ability => (
						<div key={ability.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', width: '100%' }}>
							<img
								src={ability.image_webp || ability.image}
								alt={ability.name}
								style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #353a45', background: '#23272f' }}
							/>
							<div style={{ color: '#bdbdbd', fontSize: '1em', width: 'calc(100% - 76px)' }}>{ability.description.quip}</div>
						</div>
					)) : <div style={{ color: '#bdbdbd', fontSize: '1em' }}>No abilities found.</div>}
				</div>
			</div>
			<div style={{ marginBottom: '24px' }}>
				<h3 style={{ fontWeight: 600, fontSize: '1.3em', marginBottom: '12px' }}>Stats</h3>
				{stats ? (
					<div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
						<div><strong>Win Rate:</strong> {((stats.wins / stats.matches) * 100).toFixed(2)}%</div>
						<div><strong>Pick Rate:</strong> {((stats.matches / stats.matches_per_bucket) * 100).toFixed(2)}%</div>
						<div><strong>KDA:</strong> {`${(stats.total_kills / stats.matches).toFixed(2)}/${(stats.total_deaths / stats.matches).toFixed(2)}/${(stats.total_assists / stats.matches).toFixed(2)}`}</div>
						<div><strong>Total Matches:</strong> {stats.matches}</div>
					</div>
				) : (
					<div>No stats available.</div>
				)}
			</div>
			{/* Render blog posts with tag matching hero name */}
			{posts.length > 0 && (
				<div style={{ marginTop: '32px' }}>
					<h3 style={{ fontWeight: 600, fontSize: '1.2em', marginBottom: '18px' }}>Related Blog Posts</h3>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
						{posts.map(post => (
							<Post key={post.id || post._id} {...post} />
						))}
					</div>
				</div>
			)}
		</div>
	);
}

export default HeroProfile;
