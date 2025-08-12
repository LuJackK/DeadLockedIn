import React from 'react';

function ItemStats(props) {
	const { name, imageUrl, winRate, totalMatches } = props;

	const barStyle = {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: '12px 0',
		minHeight: '80px',
		borderBottom: '1px solid #333',
		background: '#222',
		color: '#fff',
		fontSize: '1em',
	};
	const imgStyle = {
		width: '60px',
		height: '60px',
		borderRadius: '10px',
		objectFit: 'cover',
		marginRight: '12px',
	};
	const cellStyle = {
		flex: 2,
		textAlign: 'center',
		padding: '0 8px',
	};

	return (
		<div style={barStyle}>
			<div style={cellStyle}>
				<img src={imageUrl} alt={name} style={imgStyle} />
			</div>
			<div style={cellStyle}>{name}</div>
			<div style={cellStyle}>{winRate || 'N/A'}</div>
			<div style={cellStyle}>{totalMatches || 'N/A'}</div>
		</div>
	);
}

export default ItemStats;
