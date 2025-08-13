
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
	const [activeTab, setActiveTab] = useState('about');

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
			const posts = Array.isArray(res.data.posts) ? res.data.posts : [];
			const filtered = posts.filter(post => {
				if (typeof post.tags === 'string') {
					return post.tags
						.split(',')
						.map(tag => tag.toLowerCase().trim())
						.includes(formattedName);
				}
				return false;
			});
			setPosts(filtered);
		} catch (err) {
			setPosts([]);
		}
	};


	if (loading) return <div style={{ color: '#eaeaea', padding: '32px' }}>Loading...</div>;
	if (!hero) return <div style={{ color: '#eaeaea', padding: '32px' }}>Hero not found.</div>;

	const tabSwitcherContainerStyle = {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-start',
		background: '#181a20',
		borderRadius: '24px',
		padding: '24px 0',
		minWidth: '180px',
		marginRight: '40px',
		boxShadow: '0 4px 18px rgba(0,0,0,0.22)',
		border: '2px solid #23272f',
	};
	const tabListStyle = {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		width: '100%',
	};
	const tabButtonStyle = isActive => ({
		width: '100%',
		padding: '14px 24px',
		background: isActive ? '#181a20' : 'transparent',
		color: isActive ? '#61dafb' : '#eaeaea',
		border: 'none',
		borderRadius: '12px',
		fontWeight: 600,
		fontSize: '1.08em',
		cursor: 'pointer',
		marginBottom: '8px',
		transition: 'background 0.2s, color 0.2s',
		outline: 'none',
	});

	return (
			<div style={{ background: '#23272f', color: '#eaeaea', borderRadius: '18px', boxShadow: '0 4px 24px rgba(0,0,0,0.4)', padding: '32px', maxWidth: '1100px', margin: '32px auto' }}>
				<div style={{ display: 'flex', alignItems: 'flex-start', gap: '0' }}>
					{/* Tab Switcher Container */}
					<div style={tabSwitcherContainerStyle}>
						<div style={tabListStyle}>
							<button style={tabButtonStyle(activeTab === 'about')} onClick={() => setActiveTab('about')}>About</button>
							<button style={tabButtonStyle(activeTab === 'blog')} onClick={() => setActiveTab('blog')}>Blog Posts</button>
						</div>
					</div>
					{/* Tab Content */}
					<div style={{ flex: 1, width: '100%' }}>
						{activeTab === 'about' && (
							<>
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
																		{hero.description.lore && (
																			<div style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #353a45' }}>
																				<strong>Lore:</strong> {hero.description.lore}
																			</div>
																		)}
																		{hero.description.role && (
																			<div style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #353a45' }}>
																				<strong>Role:</strong> {hero.description.role}
																			</div>
																		)}
																		{hero.description.playstyle && (
																			<div>
																				<strong>Playstyle:</strong> {hero.description.playstyle}
																			</div>
																		)}
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
							</>
						)}
						{activeTab === 'blog' && (
							<div style={{ marginTop: '0' }}>
								<h3 style={{ fontWeight: 600, fontSize: '1.2em', marginBottom: '18px' }}>Related Blog Posts</h3>
								{posts.length > 0 ? (
									<div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
										{posts.map(post => (
											<Post key={post.id || post._id} {...post} />
										))}
									</div>
								) : (
									<div style={{ color: '#bdbdbd', fontSize: '1.08em', marginTop: '24px' }}>No related blog posts found.</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		);
}

export default HeroProfile;
