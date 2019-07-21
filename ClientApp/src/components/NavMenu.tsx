import * as React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/actions';
import { Dispatch } from 'redux';
import { withRouter } from 'react-router-dom'
import logo from '../images/Logo.png'
import './css/NavMenu.css';
import MyNavLink from './MyNavLink'
import { withAuth } from '@okta/okta-react';

export interface NavCommand {
  type: string,
  path: string,
  text: string,
  isActive: boolean,
}

interface AppFnProps {
}

interface AppObjectProps {
  history?: any;
  commands: NavCommand[];
  auth? : any;
}

interface Props
  extends AppObjectProps,
  AppFnProps { }

export interface State { 
  authenticated : any;
  userProfile : any;
}

class NavMenu extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);

    this.state = { 
      authenticated: null,
      userProfile : ""
    };
    this.checkAuthentication = this.checkAuthentication.bind(this);
    this.checkAuthentication();
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidUpdate() {
    this.checkAuthentication();
  }

  async checkAuthentication() {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated !== this.state.authenticated) {
      this.setState({ authenticated });

      //Get user email
      const userProfile = await this.props.auth.getUser();
      this.setState({ userProfile :  userProfile});
    }
  }

  async login() {
    this.props.auth.login('/');
  }

  async logout() {
    this.props.auth.logout('/');
  }

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="/"><img src={logo} className="logo" /></a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            {this.props.commands.map((link, i) => {
              if (link.type === "NavLink") {
                return (
                  <MyNavLink key={i}
                    path={link.path}
                    text={link.text}
                    isActive={link.isActive}
                  />
                );
              }
              return (<div key={i}></div>)
            })}
          </ul>
          {this.state.userProfile !== undefined ? this.state.userProfile.email : ""}&nbsp;
          {this.state.authenticated ? 
          <button className="btn btn-success" onClick={this.logout}>Logout</button> :
          <button className="btn btn-success" onClick={this.login}>Login</button>}
        </div>

        
      </nav>
    )
  }
}



export default withAuth(NavMenu);
