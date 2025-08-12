import React from 'react';
import HeroStats from '../heroes/HeroStats';
import axios from 'axios';

class Home extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      heroes:[{}]
  }
}

  render() {
    return (
      <div className="content-container" style={{ minHeight: '100vh', background: '#181818', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '80px' }}>
        <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '48px' }}>
          <img
            src="https://cdn.steamstatic.com/steam/apps/1422450/logo_2x.png?t=1724782459"
            alt="DeadlockedIn Logo"
            style={{ width: '180px', height: '180px', objectFit: 'contain', borderRadius: '24px', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}
          />
          <div>
            <h1
              style={{
                fontSize: '5rem',
                fontWeight: 300,
                letterSpacing: '0.08em',
                color: '#eaeaea',
                fontFamily: 'Orbitron, Impact, Arial Black, sans-serif',
                margin: 0,
                textShadow: '0 4px 24px #23272f, 0 1px 0 #444'
              }}
            >
              Deadlocked<span style={{ color: '#00eaff' }}>IN</span>
            </h1>
            <p style={{ color: '#bdbdbd', fontSize: '1.5rem', marginTop: '24px', fontFamily: 'Montserrat, Arial, sans-serif' }}>
              Welcome to the ultimate Deadlock stats agregator and community hub.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
}

export default Home;