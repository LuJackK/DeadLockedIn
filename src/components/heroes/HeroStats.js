import React from 'react';
import NavigatorHOC from '../shared/NavigatorHOC';

function HeroStats(props) {
    const { name, imageUrl, winRate, pickRate, kda, totalMatches, navigate } = props;


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
        textDecoration: 'none',
        cursor: 'pointer',
    };
    const imgStyle = {
        width: '64px',
        height: '64px',
        borderRadius: '15px',
        objectFit: 'cover',
        marginRight: '12px',
        border: '2px solid #444',
        background: '#23272f',
    };
    const cellStyle = {
        flex: 2,
        textAlign: 'center',
        padding: '0 8px',
    };


   
    const appEndpoint = name ? `/heroes/${name.replace(/\s+/g, '_').toLowerCase()}` : null;

    const handleClick = () => {
        if (appEndpoint) {
            navigate(appEndpoint);
        }
    };

    return (
        <div style={barStyle} onClick={appEndpoint ? handleClick : undefined}>
            <div style={cellStyle}>
                <img src={imageUrl} alt={name || 'Hero'} style={imgStyle} />
            </div>
            <div style={cellStyle}>{name || 'Unknown Hero'}</div>
            <div style={cellStyle}>{winRate || 'N/A'}</div>
            <div style={cellStyle}>{pickRate || 'N/A'}</div>
            <div style={cellStyle}>{kda || 'N/A'}</div>
            <div style={cellStyle}>{totalMatches || 'N/A'}</div>
        </div>
    );
}

export default NavigatorHOC(HeroStats);