import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Post from '../community-blog/Post';
import { useParams } from 'react-router';
import TabNavigator from './TabNavigator';
import HeroBlogPage from './HeroBlogPage';

function HeroProfile() {
	const { heroId } = useParams();
	const [hero, setHero] = useState(null);
	const [heroAbilities, setHeroAbilities] = useState([]);
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);
	const [posts, setPosts] = useState([]);
	const [activeTab, setActiveTab] = useState('about');

	useEffect(() => {
		fetchHeroData();
		fetchPosts();
	}, [heroId]);

	const fetchHeroData = async () => {
		setLoading(true);
		try {
			
			const [heroesRes, statsRes] = await Promise.all([
				axios.get(`http://88.200.63.148:5002/api/hero/${heroId}`),
				axios.get('https://api.deadlock-api.com/v1/analytics/hero-stats'),
			]);
			console.log('Hero response:', heroesRes);
			const heroesData = heroesRes.data;
			const statsData = statsRes.data;
			const statObj = statsData.find(s => s.hero_id === heroesData.hero_id);
			setHero(heroesData);
			setStats(statObj);
			setHeroAbilities([
			{img: heroesData.ability1_img, name: heroesData.ability1Name, quip: heroesData.ability1Quip}, 
			{img: heroesData.ability2_img, name: heroesData.ability2Name, quip: heroesData.ability2Quip}, 
			{img: heroesData.ability3_img, name: heroesData.ability3Name, quip: heroesData.ability3Quip}, 
			{img: heroesData.ability4_img, name: heroesData.ability4Name, quip: heroesData.ability4Quip}
			]);
			console.log('Hero abilities:', heroAbilities);
				
		} catch (err) {
			console.error('Error fetching hero data:', err);
			setHero(null);
			setStats(null);
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
					<TabNavigator activeTab={activeTab} setActiveTab={setActiveTab} />
					{/* Tab Content */}
					<div style={{ flex: 1, width: '100%' }}>
						{activeTab === 'about' && (
							<>
								<div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '32px', gap: '32px' }}>
									{/* Hero image and description container */}
									<div style={{ flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', background: '#23272f', borderRadius: '12px', padding: '18px', boxSizing: 'border-box', minWidth: '0' }}>
										<img src={hero.image_url} alt={hero.name} style={{ width: '120px', height: '120px', borderRadius: '18px', objectFit: 'cover', border: '2px solid #353a45', marginBottom: '18px' }} />
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
										{heroAbilities.length > 0 ? heroAbilities.map(ability => (
											<div key={ability.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', width: '100%' }}>
												<img
													src={ability.img}
													alt={ability.name}
													style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #353a45', background: '#23272f' }}
												/>
												<div style={{ color: '#bdbdbd', fontSize: '1em', width: 'calc(100% - 76px)' }}>{ability.quip}</div>
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
							<HeroBlogPage posts={posts} />
						)}
					</div>
				</div>
			</div>
		);
}

export default HeroProfile;
