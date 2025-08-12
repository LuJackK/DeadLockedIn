import React, { useState, useEffect } from 'react';
import HeroStats from './HeroStats';
import axios from 'axios';

function HeroPage() {
    const [heroes, setHeroes] = useState([]);
    const [sortBy, setSortBy] = useState('alphabetical');

    useEffect(() => {
        fetchHeroesAndStats();
    }, []);

    const fetchHeroesAndStats = async () => {
        try {
            const [heroesRes, statsRes] = await Promise.all([
                axios.get('https://assets.deadlock-api.com/v2/heroes'),
                axios.get('https://api.deadlock-api.com/v1/analytics/hero-stats')
            ]);
            const heroesData = heroesRes.data;
            const statsData = statsRes.data;
            const arr = Object.values(heroesData)
                .filter(hero => (hero.disabled === false && hero.in_development === false))
                .map(hero => {
                    const stat = statsData.find(s => s.hero_id === hero.id);
                    let winRate, pickRate, kda, totalMatches;
                    if (stat && stat.matches && stat.matches_per_bucket) {
                        winRate = ((stat.wins / stat.matches) * 100).toFixed(2);
                        pickRate = ((stat.matches / stat.matches_per_bucket) * 100).toFixed(2);
                        kda = `${(stat.total_kills / stat.matches).toFixed(2)}/${(stat.total_deaths / stat.matches).toFixed(2)}/${(stat.total_assists / stat.matches).toFixed(2)}`;
                        totalMatches = stat.matches;
                    } else {
                        winRate = pickRate = kda = totalMatches = null;
                    }
                    return {
                        id: hero.id,
                        name: hero.name,
                        imageUrl: hero.images.icon_hero_card,
                        winRate,
                        pickRate,
                        kda,
                        totalMatches
                    };
                });
            setHeroes(arr);
        } catch (err) {
            console.error('API error:', err);
        }
    };


    const sortedHeroes = [...heroes].sort((a, b) => {
        switch (sortBy) {
            case 'winRate':
                return (parseFloat(b.winRate) || 0) - (parseFloat(a.winRate) || 0);
            case 'pickRate':
                return (parseFloat(b.pickRate) || 0) - (parseFloat(a.pickRate) || 0);
            case 'kda':
                // Sort by KDA ratio (kills+assists)/deaths
                const kdaA = a.kda ? parseFloat(a.kda.split('/')[0]) + parseFloat(a.kda.split('/')[2]) : 0;
                const deathsA = a.kda ? parseFloat(a.kda.split('/')[1]) : 1;
                const kdaB = b.kda ? parseFloat(b.kda.split('/')[0]) + parseFloat(b.kda.split('/')[2]) : 0;
                const deathsB = b.kda ? parseFloat(b.kda.split('/')[1]) : 1;
                return (kdaB / deathsB) - (kdaA / deathsA);
            case 'alphabetical':
            default:
                return a.name.localeCompare(b.name);
        }
    });

    return (
        <div className="hero-page-container">
            <h2>Hero Stats</h2>
            <div className="filters-bar">
                <label htmlFor="sortBy" style={{ color: '#bdbdbd', marginRight: '8px' }}>Sort by:</label>
                <select
                    id="sortBy"
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    style={{ background: '#23272f', color: '#eaeaea', border: '1px solid #353a45', borderRadius: '6px', padding: '8px 12px', fontSize: '1em' }}
                >
                    <option value="alphabetical">Alphabetical</option>
                    <option value="winRate">Win Rate</option>
                    <option value="pickRate">Pick Rate</option>
                    <option value="kda">KDA</option>
                </select>
            </div>
            <div className="hero-stats-table">
            <div className="hero-stats-header" style={{ display: 'flex', fontWeight: 'bold', padding: '8px 0 8px 12px', borderBottom: '2px solid #444', background: '#181818', color: '#bdbdbd', fontSize: '1.1em' }}>
                <div style={{ flex: 2, textAlign: 'center', padding: '0 5px', marginRight: '0px' }}>Hero Image</div>
                <div style={{ flex: 2, textAlign: 'center', padding: '0 7px' }}>Name</div>
                <div style={{ flex: 2, textAlign: 'center', padding: '0 8px' }}>Win Rate</div>
                <div style={{ flex: 2, textAlign: 'center', padding: '0 8px' }}>Pick Rate</div>
                <div style={{ flex: 2, textAlign: 'center', padding: '0 8px' }}>KDA</div>
                <div style={{ flex: 2, textAlign: 'center', padding: '0 8px' }}>Total Matches</div>
            </div>
                {sortedHeroes.map(h => (
                    <HeroStats
                        key={h.id}
                        name={h.name}
                        imageUrl={h.imageUrl}
                        winRate={h.winRate}
                        pickRate={h.pickRate}
                        kda={h.kda}
                        totalMatches={h.totalMatches}
                    />
                ))}
            </div>
        </div>
    );
}

export default HeroPage;
