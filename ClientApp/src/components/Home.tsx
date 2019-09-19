import * as React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/actions';
import { Dispatch } from 'redux';
import { withAuth } from '@okta/okta-react';
import './css/Home.css';
import trackerUpImg from '../images/trackerUp.png'
import trackerDownImg from '../images/trackerDown.png'


interface AppFnProps {
  checkLocalUserId(p: any): void;
}

interface AppObjectProps {
  auth?: any;
}

interface Props
  extends AppObjectProps,
  AppFnProps { }

interface State {
}

class Home extends React.Component<Props, State>{
  constructor(props: any) {
    super(props);
  }

  async componentDidMount() {
    try {
      var token = await this.props.auth.getAccessToken();
      this.props.checkLocalUserId(token);
    } catch (err) {
      // handle error as needed
    }
  }

  render() {
    return (
      <div style={{marginRight:"0"}}>



        <section className="py-5 parallax-background " style={{height:600}}>
          <div className="container">
            <h1 className="display-4" style={{ zIndex: 110, marginTop: 30, color: "gray" }} >IOT simless solution</h1>
            <p className="lead" style={{ color: "gray" }}>GPS tracker with motion detector that help you to protect your bike </p>
            <img src={trackerUpImg} className="col-2 img-thumbnail" style={{ marginTop:100, padding:2 }} />
            <img src={trackerDownImg} className="col-2 img-thumbnail" style={{ marginTop:100, padding:2, marginLeft:30 }} />
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
    //getSymbolList: (p: string) => dispatch<any>(binanceActionCreator.binanceActions.GetSymbolList(p)),
    getLocalUserId: (p: any) => dispatch<any>(actions.default.account.checkLocalUserId(p)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withAuth(Home));
