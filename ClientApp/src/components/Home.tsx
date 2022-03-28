import * as React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/actions';
import { Dispatch } from 'redux';
import { withAuth } from '@okta/okta-react';
import './css/Home.css';
import trackerUpImg from '../images/PCB_Front.jpg'
import trackerL80 from '../images/PCB_L80.png'
import trackerLora from '../images/PCB_Lora.png'
import cryptoPaymentStation from '../images/Crypto2CryptoReader.png'


interface AppFnProps {
  checkUserId(p: any): void;
}

interface AppObjectProps {
  auth?: any;
}

interface Props
  extends AppObjectProps,
  AppFnProps { }

interface State {
  token: any,
}

class Home extends React.Component<Props, State>{
  constructor(props: any) {
    super(props);

    this.state = {
      token: null
    }
  }

  async componentDidMount() {
    try {
      this.setState({
        token: await this.props.auth.getAccessToken()
      })
      if (this.state.token) {
        this.props.checkUserId(this.state.token);
      }
    } catch (err) {
      // handle error as needed
    }
  }

  componentDidUpdate(nextProps: any) {

    if (this.props !== nextProps) {
      this.componentDidMount();
    }
    }

  render() {
    return (
      <div style={{ marginRight: "0" }}>
        <section className="py-5 parallax-background " style={{ height: 600 }}>
          <div className="container">
            <h1 className="display-3" style={{ zIndex: 110, marginTop: 30, color: "gray" }} >IOT simless solution</h1>
            {!this.state.token ? <h3 style={{ color: "gray" }}>GPS tracker with motion detector </h3> : ""}
            {!this.state.token ? <h3 style={{ color: "gray" }}>Crypto money transfer system from wallet to wallet</h3> : ""}
            {this.state.token ? <h3 style={{ color: "orange" }}>Welcome to BTracker, register a new tracker or go to map page </h3> : ""}
            <p className="lead" style={{ color: "gray" }}> </p>
            <img src={trackerUpImg} className="col-2 img-thumbnail" style={{ marginTop: 80, padding: 2 }} alt="#" />
            <img src={trackerL80} className="col-2 img-thumbnail" style={{ marginTop: 80, padding: 2, marginLeft: 30 }} alt="#" />
            <img src={trackerLora} className="col-2 img-thumbnail" style={{ marginTop: 80, padding: 2, marginLeft: 30 }} alt="#" />
            <img src={cryptoPaymentStation} className="col-2 img-thumbnail" style={{ marginTop: 80, padding: 2, marginLeft: 30 }} alt="#" />
            
          </div>
        </section>
      </div>
    );
  }
}

//map the props of this class to the root redux state
const mapStateToProps = (state: any) => {
  return {
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    checkUserId: (p: any) => dispatch<any>(actions.default.user.checkUserId(p)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withAuth(Home));
