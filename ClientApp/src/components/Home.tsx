import * as React from 'react';
import { withAuth } from '@okta/okta-react';
// import {connect} from 'react-redux'

interface Props {
   auth : any;
}

interface State { 
  authenticated : any;
}

class Home extends React.Component<Props, State>{
  constructor(props:any){
    super(props);
    this.state = { authenticated: null };
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
    }
  }

  async login() {
    this.props.auth.login('/');
  }

  async logout() {
    this.props.auth.logout('/');
  }
  
  render(){
    if (this.state.authenticated === null) return null;
    return this.state.authenticated ?
      <button onClick={this.logout}>Logout</button> :
      <button onClick={this.login}>Login</button>;
    };
}

// //map the props of this class to the root redux state
//   const mapStateToProps = (state:any) =>{
//     return {
//       userId: state.userId,
//       isLogged : state.isLogged,
//     }
//   }
  
//   export default connect(mapStateToProps)(Home);

  export default withAuth(Home);
