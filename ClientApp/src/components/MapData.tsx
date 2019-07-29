import * as React from 'react';
import ReactDOM from 'react-dom';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions/actions';
import { withAuth } from '@okta/okta-react';
import { any } from 'prop-types';
import DropDown from './element/DropDown'

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';


interface AppFnProps {
  getGpsPosition(token: any, deviceId: any, maxData: any): void;
  getTrackerList(token : any): void;
}

interface AppObjectProps {
  auth?: any;
  gpsPositionList: Array<any>;
  deviceList: Array<any>;
}

interface Props
  extends AppObjectProps,
  AppFnProps { }

interface State {
  token: any,
  marketSelected :any
}

class MapData extends React.Component<Props, State>{
  constructor(props: any) {
    super(props);

    this.state = {
      token: null,
      marketSelected : "",
    };
  };

  async componentDidMount() {
    try {
      this.setState({
        token: await this.props.auth.getAccessToken()
      })
      if(!this.state.token){ this.props.auth.login('/') } else {
        this.props.getGpsPosition(this.state.token, 2, 20);
        this.props.getTrackerList(this.state.token);
      }
    } catch (err) {
    }

    var ttt = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          })
        })
      ],
      view: new View({
        center: [37.41,  8.82],
        zoom: 2,
      }),  
    });
  }

  handleChangeDevice = (p: any) => {
    this.setState({})
    //this.props.getSymbolList(p);
}

  render() {
console.log(this.props.deviceList);
    let displayList = this.props.gpsPositionList.map((item, index) => (
      <tr key={index}>
        <td>{item.gpsPositionLongitude}</td>
        <td>{item.gpsPositionLatitude}</td>
      </tr>
    )); 


    return (
      <div>
        {!this.state.token ? <div></div> :
          <div>
            <br ></br>
            <div className="float-md-left mb-1">
                    <DropDown itemList={this.props.deviceList} onClick={this.handleChangeDevice} selectedItem={this.state.marketSelected}></DropDown>
                </div>

            <div id="map" className="map"></div>

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
    deviceList: state.deviceList,
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    getTrackerList: (token : any) => dispatch<any>(actions.default.tracker.trackerList(token)),
    getGpsPosition: (token: any, deviceId: any, maxData: any) => dispatch<any>(actions.default.gps.getGpsDataList(token, deviceId, maxData)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withAuth(MapData));
