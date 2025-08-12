import React from 'react';

const tabItemStyle = {
    width: '100%',
    padding: '12px 0',
    margin: '8px 0',
    borderRadius: '12px',
    background: '#23272f',
    color: '#eaeaea',
    textAlign: 'center',
    fontWeight: 500,
    fontSize: '1.1em',
    cursor: 'pointer',
    transition: 'background 0.2s, color 0.2s',
    boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
};

const tabItemHoverStyle = {
    background: '#181a20',
    color: '#61dafb',
};

function TabItem({ text, url }) {
    const [hover, setHover] = React.useState(false);
    return (
        <div
            style={hover ? { ...tabItemStyle, ...tabItemHoverStyle } : tabItemStyle}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <a href={url} style={{ color: 'inherit', textDecoration: 'none', width: '100%', display: 'block' }}>{text}</a>
        </div>
    );
}

export default TabItem;
// ...existing code...