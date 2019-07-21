import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Security, ImplicitCallback } from '@okta/okta-react';
import Home from './components/Home';

const config = {
  issuer: 'https://dev-792490.okta.com/oauth2/default',
  redirect_uri: window.location.origin + '/implicit/callback',
  client_id: '0oayfrvlemxp3hNnC356'
}

interface State {
}

interface Props {
}

class App extends React.Component<Props, State>{
  constructor(props: any) {
    super(props);

    console.log(window.location.origin);
  }

  render() {
    return (
      <BrowserRouter>
        <Security issuer={config.issuer}
          client_id={config.client_id}
          redirect_uri={config.redirect_uri}
        >
           <Switch>
            <Route path='/' exact={true} component={Home} />
          <Route path='/implicit/callback' component={ImplicitCallback} />
          </Switch>
        </Security>
 
      </BrowserRouter>
    );
  }
}

export default App;
