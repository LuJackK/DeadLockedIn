
import TabItem from './TabItem';

const tabContainerStyle = {
    width: '80%',
    background: 'rgba(35,39,47,0.95)',
    borderRadius: '32px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
    color: '#eaeaea',
    padding: '10px 24px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '18px',
    margin: '32px auto 32px auto',
    border: '1.5px solid #353a45',
};

// ...existing code...
function TabContainer({ children }) {
    return (
        <div className='tab-navigator'>
            <div className='tab-container' style={tabContainerStyle}>
                {getTabs().map(({ text, url }) => (
                    <TabItem key={text} text={text} url={url} />
                ))}
            </div>
            {children}
        </div>
    );
}

const getTabs = () => {
    return [
        {
            text: 'Heroes',
            url: '/heroes',
        },
        {
            text: 'Items',
            url: '/items',
        },
        {
            text:'Leaderboard',
            url: '/leaderboard',
        },
        {
            text: 'Community',
            url: '/blog',
        },
        {
            text: 'Account',
            url: '/login',
        },
    ]
}

export default TabContainer;