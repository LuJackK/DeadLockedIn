import React from 'react';

function TabNavigator({ activeTab, setActiveTab }) {
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
		<div style={tabSwitcherContainerStyle}>
			<div style={tabListStyle}>
				<button style={tabButtonStyle(activeTab === 'about')} onClick={() => setActiveTab('about')}>About</button>
				<button style={tabButtonStyle(activeTab === 'blog')} onClick={() => setActiveTab('blog')}>Blog Posts</button>
			</div>
		</div>
	);
}

export default TabNavigator;
