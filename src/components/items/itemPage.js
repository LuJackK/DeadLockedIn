import React, { useState, useEffect } from 'react';
import ItemStats from './itemStats';
import axios from 'axios';

function ItemPage() {
	const [items, setItems] = useState([]);
	const [sortBy, setSortBy] = useState('alphabetical');

	useEffect(() => {
		fetchItemsAndStats();
	}, []);

	const fetchItemsAndStats = async () => {
		try {
			const [itemsRes, statsRes] = await Promise.all([
				axios.get('https://assets.deadlock-api.com/v2/items'),
				axios.get('https://api.deadlock-api.com/v1/analytics/item-stats?min_matches=1')
			]);
			const itemsData = itemsRes.data;
			const statsData = statsRes.data;
			const arr = Object.values(itemsData)
				.filter(item => item.shop_image)
				.map(item => {
                    console.log(item);
					const stat = statsData.find(s => s.item_id === item.id);
					let winRate, totalMatches;
					if (stat && stat.matches) {
						winRate = ((stat.wins / stat.matches) * 100).toFixed(2);
						totalMatches = stat.matches;
					} else {
						winRate = totalMatches = null;
					}
					return {
						id: item.id,
						name: item.name,
						imageUrl: item.shop_image,
						winRate,
						totalMatches
					};
				});
			setItems(arr);
		} catch (err) {
			console.error('API error:', err);
		}
	};

	const sortedItems = [...items].sort((a, b) => {
		switch (sortBy) {
			case 'winRate':
				return (parseFloat(b.winRate) || 0) - (parseFloat(a.winRate) || 0);
			case 'matches':
				return (parseInt(b.totalMatches) || 0) - (parseInt(a.totalMatches) || 0);
			case 'alphabetical':
			default:
				return a.name.localeCompare(b.name);
		}
	});

	const filteredItems = sortedItems.filter(item => item.totalMatches && item.totalMatches > 0);

	return (
		<div className="item-page-container">
			<h2>Item Stats</h2>
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
					<option value="matches">Total Matches</option>
				</select>
			</div>
			<div className="item-stats-table">
				<div className="item-stats-header" style={{ display: 'flex', fontWeight: 'bold', padding: '8px 0 8px 12px', borderBottom: '2px solid #444', background: '#181818', color: '#bdbdbd', fontSize: '1.1em' }}>
					<div style={{ flex: 2, textAlign: 'center', padding: '0 8px', marginRight: '12px' }}>Item Image</div>
					<div style={{ flex: 2, textAlign: 'center', padding: '0 8px' }}>Name</div>
					<div style={{ flex: 2, textAlign: 'center', padding: '0 8px' }}>Win Rate</div>
					<div style={{ flex: 2, textAlign: 'center', padding: '0 8px' }}>Total Matches</div>
				</div>
				{filteredItems.map(i => (
					<ItemStats
						key={i.id}
						name={i.name}
						imageUrl={i.imageUrl}
						winRate={i.winRate}
						totalMatches={i.totalMatches}
					/>
				))}
			</div>
		</div>
	);
}

export default ItemPage;
