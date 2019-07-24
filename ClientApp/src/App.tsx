import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Security, ImplicitCallback } from '@okta/okta-react';

import Home from './components/Home';
import Tracker from './components/Tracker';
import MapData from './components/MapData';
import NavMenu from './components/NavMenu';
import { NavCommand } from './components/NavMenu';

const config = {
  issuer: 'https://dev-792490.okta.com/oauth2/default',
  redirect_uri: window.location.origin + '/implicit/callback',
  client_id: '0oayfrvlemxp3hNnC356'
}

interface State {
  navCommands: Array<NavCommand>;
}

interface Props {
}

class App extends React.Component<Props, State>{
  constructor(props: any) {
    super(props);

    this.state = {
      navCommands: [
        { type: "NavLink", path: "/", text: "Home", isActive: false },
        { type: "NavLink", path: "/Tracker", text: "Tracker", isActive: false },
        { type: "NavLink", path: "/MapData", text: "MapData", isActive: false },
      ]
    }
  }

  render() {
    return (
      <BrowserRouter>
        <Security issuer={config.issuer} client_id={config.client_id} redirect_uri={config.redirect_uri}>
          <NavMenu commands={this.state.navCommands} />
          <div className="container">
          <Switch>
            <Route path='/' exact={true} component={Home} />
            <Route path='/Tracker' exact={true} component={Tracker} />} />
            <Route path='/MapData' exact={true} component={MapData} />} />
            <Route path='/implicit/callback' component={ImplicitCallback} />
          </Switch>
          </div>
        </Security>
      </BrowserRouter>
    );
  }
}

export default App;
