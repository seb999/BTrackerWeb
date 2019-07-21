import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Router, Switch } from 'react-router-dom'
import { Security, ImplicitCallback } from '@okta/okta-react';

const config = {
  issuer: 'https://https://dev-792490.okta.com/oauth2/default',
  redirect_uri: window.location.origin + '/implicit/callback',
  client_id: '0oayd0jtiCu9SZ3Kd356'
}

const App: React.FC = () => {
  return (
    <Router>
    <Security issuer={config.issuer}
              client_id={config.client_id}
              redirect_uri={config.redirect_uri}
    >
      <Route path='/' exact={true} component={Home}/>
      <Route path='/implicit/callback' component={ImplicitCallback}/>
    </Security>
  </Router>
  );
}

export default App;
