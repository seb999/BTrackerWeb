import * as React from 'react';
import { withRouter } from 'react-router-dom'
import logo from '../images/Logo.png'
import './NavMenu.css';
import MyNavLink from './MyNavLink'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import * as actionCreator from '../actions/actions'

export interface NavCommand {
  type: string,
  path: string,
  text: string,
  isActive: boolean,
}

export interface Props {
  history?: any;
  commands: NavCommand[];
  userEmail: string;
  isLogged: string;
  logoutUser(): void;
}

export interface State { }

class NavMenu extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
  }

  login = () => {
    this.props.history.push("/Login");
  }

  register = () => {
    this.props.history.push("/Register");
  }

  logout = () => {
    this.props.logoutUser();
    this.props.history.push("/Home");
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

          Hello {this.props.userEmail}! {this.props.isLogged}
          {/* {this.props.commands.map((link, i) => {
            if (link.type === "Button") {
              return (

                <button key={i} className={link.isActive ? "btn btn-outline-success my-2 my-sm-0" : "btn btn-outline-success my-2 my-sm-0 d-none"}
                  onClick={link.text == 'Login' ? this.login : this.logout}>{link.text}
                </button>

              )
            }
            return (<div key={i}></div>)
          })} */}

          <button className={!this.props.isLogged ? "btn btn-outline-success my-2 my-sm-0 mr-1" : "btn btn-outline-success my-2 my-sm-0 d-none"}
            onClick={this.register}>Register
          </button>

          <button className={this.props.isLogged ? "btn btn-secondary my-2 my-sm-0" : "btn btn-outline-success my-2 my-sm-0 d-none"}
            onClick={this.logout}>Logout
          </button>

          <button className={!this.props.isLogged ? "btn btn-success my-2 my-sm-0" : "btn btn-outline-success my-2 my-sm-0 d-none"}
            onClick={this.login}>Login
          </button>
        </div>
      </nav>
    )
  }
}

//map the props of this class to the root redux state
const mapStateToProps = (state: any) => {
  return {
    userId: state.userId,
    userEmail: state.userEmail,
    isLogged: state.isLogged,
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    //we add this function to our props
    logoutUser: () => dispatch<any>(actionCreator.default.account.logoutUser())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NavMenu));

