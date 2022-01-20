import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Security, ImplicitCallback } from '@okta/okta-react';

import Home from './components/Home';
import Tracker from './components/Tracker';
import Map from './components/Map';
import Footer from './components/Footer';
import NavMenu from './components/NavMenu';
import { NavCommand } from './components/NavMenu';
import appsettings from './appsettings'
import SmartHouse from './components/SmartHouse';
import SmartHouseUser from './components/SmartHouseAdmin';
import SmartHouseAdmin from './components/SmartHouseAdmin';
import LogBook from './components/LogBook';
import PlanNavigation from './components/PlanNavigation';
import CryptoTransfer from './components/CryptoTransfer';



const config = {
  issuer: 'https://dev-792490.okta.com/oauth2/default',
  redirect_uri: window.location.origin + '/implicit/callback',
  client_id: appsettings.oktaClientId
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
        { type: "NavLink", path: "/", text: "Home", isActive: true },
        { type: "NavLink", path: "/Tracker", text: "Tracker", isActive: true },
        { type: "NavLink", path: "/Map", text: "Map", isActive: true },
        { type: "NavLink", path: "/SmartHouse", text: "My house", isActive: true },
        { type: "NavLink", path: "/SmartHouseAdmin", text: "Admin", isActive: false },
        { type: "NavLink", path: "/LogBook", text: "LogBook", isActive: false },
        { type: "NavLink", path: "/PlanNavigation", text: "Navigation", isActive: false },
        { type: "NavLink", path: "/CryptoTransfer", text: "Crypto Transfer", isActive: false },
      ]
    }

    console.log(config.redirect_uri);
  }

  render() {
    return (
      <BrowserRouter>
       <div className="main-container">
        <Security issuer={config.issuer} client_id={config.client_id} redirect_uri={config.redirect_uri}>
          <NavMenu commands={this.state.navCommands} />
          <div className="container-fluid">
          <Switch>
            <Route path='/' exact={true} component={Home} />
            <Route path='/Home' exact={true} component={Home} />
            <Route path='/Tracker' exact={true} component={Tracker} /> 
            <Route path='/SmartHouse' exact={true} component={SmartHouse} />
            <Route path='/SmartHouseAdmin' exact={true} component={SmartHouseAdmin} />
            <Route path='/LogBook' exact={true} component={LogBook} />
            <Route path='/PlanNavigation' exact={true} component={PlanNavigation} />
            <Route path='/Map' exact={true} component={Map} />
            <Route path='/CryptoTransfer' exact={true} component={CryptoTransfer} />
            <Route path='/implicit/callback' component={ImplicitCallback} />
          </Switch>
          </div>
          <Footer />
        </Security>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
