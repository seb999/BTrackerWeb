import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions/actions';
import { withAuth } from '@okta/okta-react';

interface AppFnProps {
  getGpsPosition(token: any, deviceId: any, maxData: any): void;
}

interface AppObjectProps {
  auth?: any;
  gpsPositionList: Array<any>;
}

interface Props
  extends AppObjectProps,
  AppFnProps { }

interface State {
  token: any
}

class Navigation111 extends React.Component<Props, State>{
  constructor(props: any) {
    super(props);

    this.state = {
      token: null
    };
  };

  async componentDidMount() {
    try {
      this.setState({
        token: await this.props.auth.getAccessToken()
      })
      // !this.state.token ? this.props.auth.login('/') : this.props.getGpsPosition(this.state.token, 2, 20);
    } catch (err) {
    }
  }

  render() {

    let displayList = this.props.gpsPositionList.map((item, index) => (
      <tr key={index}>
        <td>{item.gpsPositionLongitude}</td>
        <td>{item.gpsPositionLatitude}</td>
      </tr>
    ));


    return (
      <div>
        {!this.state.token ? <div>map page</div> :
          <div>
            <br >coucou</br>
            <table className="table" >
              <thead className="thead-dark">
                <tr>
                  <th scope="col">Longitude</th>
                  <th scope="col">Latitude</th>
                </tr>
              </thead>
              <tbody>
                {displayList}
              </tbody>
            </table>
          </div>}

      </div>
    );
  }
}

//map the props of this class to the root redux state
const mapStateToProps = (state: any) => {
  return {
    gpsPositionList: state.gpsPositionList,
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    getGpsPosition: (token: any, deviceId: any, maxData: any) => dispatch<any>(actions.default.gps.getGpsDataList(token, deviceId, maxData)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withAuth(Navigation111));
