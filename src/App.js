import logo from './logo.svg';
import './App.css';
import React from 'react';
import TabContainer from './components/tab-navigator/TabContainer';
import { Outlet } from 'react-router';


class App extends React.Component {

  render() {
    return (
      <TabContainer >
        <Outlet />
      </TabContainer>
    );
  }
}

export default App;