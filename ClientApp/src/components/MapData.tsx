import * as React from 'react';
import ReactDOM from 'react-dom';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions/actions';
import { withAuth } from '@okta/okta-react';
import { any } from 'prop-types';
import DropDownDevice from './element/DropDownDevice';

import * as ol from 'ol';
import * as proj from 'ol/proj';
import * as geom from 'ol/geom';
import * as layer from 'ol/layer';
import * as source from 'ol/source';
import * as style from 'ol/style';
import { Device } from '../class/Device';
import { GpsPosition } from '../class/GpsPosition';

interface AppFnProps {
  getGpsPosition(token: any, deviceId: number, maxData: number): void;
  getTrackerList(token: any): void;
}

interface AppObjectProps {
  auth?: any;
  gpsPositionList: Array<GpsPosition>;
  deviceList: Array<Device>;
}

interface Props
  extends AppObjectProps,
  AppFnProps { }

interface State {
  token: any,
  deviceSelected: Device,
}

class MapData extends React.Component<Props, State>{
  constructor(props: any) {
    super(props);

    this.state = {
      token: null,
      deviceSelected: { deviceId: 0, deviceEUI: "", deviceDescription: "Filter device", userId: "" },
    };
  };

  private markerVectorLayer: any;
  private vectorSource: any;
  private map: any;

  async componentDidMount() {
    try {
      this.setState({
        token: await this.props.auth.getAccessToken()
      })
      if (!this.state.token) { this.props.auth.login('/') } else {
        await this.props.getGpsPosition(this.state.token, this.state.deviceSelected.deviceId, 20);
        await this.props.getTrackerList(this.state.token);
        this.initMap();
        this.setupMap();
      }
    } catch (err) {
    }
  }

  componentDidUpdate(nextProps: any) {
    if (this.props != nextProps) {

      this.ClearMap();
      this.setupMap();
    }
}

  initMap = () => {
    //We build the map
    let baseMapLayer = new layer.Tile({
      source: new source.OSM()
    });
    this.map = new ol.Map({
      target: 'map',
      layers: [baseMapLayer],
      view: new ol.View({
        center: this.props.gpsPositionList.length == 0 ? proj.fromLonLat([-1.5, 54]) : proj.fromLonLat([this.props.gpsPositionList[0].gpsPositionLongitude, this.props.gpsPositionList[0].gpsPositionLatitude]),
        zoom: 5
      })
    });
  }

  setupMap = () => {
    if(this.map == undefined) return;
    console.log(this.props.gpsPositionList);
    //Array with all waypoint
    var navigationWayPoint = [] as any;
    //Build way point list  
    this.props.gpsPositionList.map(item => {
      //Adding a marker on the map
      var marker = new ol.Feature({
        geometry: new geom.Point(
          proj.fromLonLat([item.gpsPositionLongitude, item.gpsPositionLatitude])
        ),
      });
      marker.setStyle(new style.Style({
        image: new style.Icon(({
          color: '#ffcd46',
          crossOrigin: 'anonymous',
          src: require("./../images/marker.png"),
        }))
      }));
      navigationWayPoint.push(marker);
    })

    console.log(navigationWayPoint);

    this.vectorSource = new source.Vector({
      features: navigationWayPoint
    });

    this.markerVectorLayer = new layer.Vector({
      source: this.vectorSource,
    });

    this.map.addLayer(this.markerVectorLayer);
  }

  ClearMap = () => {
    if(this.vectorSource == undefined) return;
    this.vectorSource.clear();
    this.map.removeLayer(this.markerVectorLayer);
  }

  handleChangeDevice = (device: any) => {
    this.setState({
      deviceSelected: device,
    })
    this.props.getGpsPosition(this.state.token, device.deviceId, 20);
  }

  handleShowHideSpot = (positionList: any) => {

  }



  render() {
    let displayList = this.props.gpsPositionList.map((item, index) => (
      <tr key={index}>
        <td>{item.gpsPositionDate}</td>
        <td>{item.gpsPositionLongitude}</td>
        <td>{item.gpsPositionLatitude}</td>
        <td>{item.device.deviceDescription}</td>
        <td><button className="btn" onClick={() => this.handleShowHideSpot(item)}><span style={{ color: "green" }}><i className="fas fa-map-marker-alt"></i></span></button></td>
      </tr>
    ));


    return (
      <div>
        {!this.state.token ? <div></div> :
          <div>
            <br ></br>
            <div className="mb-1">
              <DropDownDevice itemList={this.props.deviceList} onClick={this.handleChangeDevice} selectedItem={this.state.deviceSelected}></DropDownDevice>
            </div>
            <div className="row">
              <div className="col-md-6">
                <table className="table" >
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col">Date</th>
                      <th scope="col">Longitude</th>
                      <th scope="col">Latitude</th>
                      <th scope="col">Tracker</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayList}
                  </tbody>
                </table>
              </div>
              <div className="col-md-6">
                <div id="map" className="map"><div id="popup"></div>
                </div>
              </div>

            </div>
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
    getTrackerList: (token: any) => dispatch<any>(actions.default.tracker.trackerList(token)),
    getGpsPosition: (token: any, deviceId: any, maxData: any) => dispatch<any>(actions.default.gps.getGpsDataList(token, deviceId, maxData)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withAuth(MapData));