import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions/actions';
import { withAuth } from '@okta/okta-react';
import DropDown from './element/DropDown';
import * as moment from 'moment';

import * as ol from 'ol';
import * as proj from 'ol/proj';
import * as geom from 'ol/geom';
import * as layer from 'ol/layer';
import * as source from 'ol/source';
import * as style from 'ol/style';
import { GpsPosition } from '../class/GpsPosition';
import { LookupItem } from '../class/LookupItem';
import { Device } from '../class/Device';

import socketIOClient from "socket.io-client";


interface AppFnProps {
  getGpsPosition(token: any, deviceId: number, maxData: number): void;
  getTrackerList(token: any): void;
  getTrackerLookupList(token: any): void;
  hideShowGpsPosition(position: any): void;
  deleteGpsData(token: any, id: any): void;
}

interface AppObjectProps {
  auth?: any;
  gpsPositionList: Array<GpsPosition>;
  lookupTrackerList: Array<LookupItem>;
  trackerList: Array<Device>;
}

interface Props
  extends AppObjectProps,
  AppFnProps { }

interface State {
  token: any,
  deviceSelected: LookupItem;
  gpsMaxList: Array<LookupItem>;
  gpsMaxSelected: LookupItem;
  loraMessageEndpoint: string;
  alertDeviceEUI: any;
}

class Map extends React.Component<Props, State>{
  constructor(props: any) {
    super(props);

    this.state = {
      token: null,
      gpsMaxList: [{ id: 1, value: '10' }, { id: 2, value: "25" }, { id: 3, value: "50" }, { id: 4, value: "100" }],
      gpsMaxSelected: { id: 1, value: '10' },
      deviceSelected: { id: 0, value: "Filter device" },
      //loraMessageEndpoint: "http://localhost:4001", //Dev
      loraMessageEndpoint: "http://dspx.eu:1884",   //Prod - port 1884 was opened to EC2 for BTrackerMQTT app
      alertDeviceEUI: 0
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
        await this.props.getGpsPosition(this.state.token, this.state.deviceSelected.id, parseInt(this.state.gpsMaxSelected.value));
        await this.props.getTrackerList(this.state.token);
        await this.props.getTrackerLookupList(this.state.token);
        this.initMap();
        this.setupMap();
        this.initLoraListener();
      }
    } catch (err) {
    }
  }

  componentDidUpdate(nextProps: any) {
    if (this.props !== nextProps) {
      this.ClearMap();
      this.setupMap();
    }
  }

  initLoraListener = () => {
    const socket = socketIOClient(this.state.loraMessageEndpoint, this.state.alertDeviceEUI);
    socket.on("FromLoraTracker", (data: any) => {

      this.setState({ alertDeviceEUI: data });
      setTimeout(() => {
        this.setState({ alertDeviceEUI: 0 });
        this.props.getGpsPosition(this.state.token, this.state.deviceSelected.id, parseInt(this.state.gpsMaxSelected.value));
      }, 5000);
    }
    );
  }

  initMap = () => {
    //We remove alert plot (no latitude, no longitude)
    let initGpsList = this.props.gpsPositionList.filter(item => item.gpsPositionLatitude !== 0)
    //We build the map
    let baseMapLayer = new layer.Tile({
      source: new source.OSM()
    });
    this.map = new ol.Map({
      target: 'map',
      layers: [baseMapLayer],
      view: new ol.View({
        center: this.props.gpsPositionList.length === 0 ? proj.fromLonLat([-1.5, 54]) : proj.fromLonLat([initGpsList[0].gpsPositionLongitude, initGpsList[0].gpsPositionLatitude]),
        zoom: 16
      })
    });
  }

  setupMap = () => {
    if (this.map === undefined) return;
    //Array with all waypoint
    var navigationWayPoint = [] as any;
    //Build way point list  
    this.props.gpsPositionList.forEach(item => {
      if (!item.display) return;
      if (item.gpsPositionLatitude === 0) return;
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
          src: item.gpsPositionIsGateway ? require("./../images/Tower.png") : require("./../images/marker.png"),
        }))
      }));
      navigationWayPoint.push(marker);
    })

    this.vectorSource = new source.Vector({
      features: navigationWayPoint
    });

    this.markerVectorLayer = new layer.Vector({
      source: this.vectorSource,
    });

    this.map.addLayer(this.markerVectorLayer);

  }

  ClearMap = () => {
    if (this.vectorSource === undefined) return;
    this.vectorSource.clear();
    this.map.removeLayer(this.markerVectorLayer);
  }

  handleChangeDevice = (device: any) => {
    console.log("change device")
    this.setState({
      deviceSelected: device,
    })
    this.props.getGpsPosition(this.state.token, device.id, parseInt(this.state.gpsMaxSelected.value));
  }

  handleChangeMaxGps = (lookupItem: LookupItem) => {
    console.log("change number of point")
    this.setState({
      gpsMaxSelected: lookupItem,
    })
    this.props.getGpsPosition(this.state.token, this.state.deviceSelected.id, parseInt(lookupItem.value));
  }

  handleShowHideSpot = (p: any) => {
    if (p === null) {
      this.props.gpsPositionList.forEach(item => {
        this.props.hideShowGpsPosition(item);
      })
    }
    else {
      this.props.hideShowGpsPosition(p);
    }
  }

  async handleDeleteGpsData(item: any) {
    console.log("delete gps point")
    if (item != null) {
      await this.props.deleteGpsData(this.state.token, item.gpsPositionId);
      await this.props.getGpsPosition(this.state.token, this.state.deviceSelected.id, parseInt(this.state.gpsMaxSelected.value));
      //this.props.gpsPositionList = this.props.gpsPositionList.slice(this.props.gpsPositionList.indexOf(item),1);
    }
  }

  render() {


    let displayList = this.props.gpsPositionList.map((item, index) => (
      <tr key={index}>
        <td><button className="btn" onClick={() => this.handleDeleteGpsData(item)}><span style={{ color: "red" }}><i className="far fa-trash-alt"></i></span></button></td>
        <td>{moment.utc(item.gpsPositionDate).format('YYYY-MM-DD HH:MM')}</td>
        <td>{item.gpsPositionLongitude}</td>
        <td>{item.gpsPositionLatitude}</td>
        <td>{item.device.deviceDescription}</td>
        {!item.gpsPositionIsGateway ?
          <td><button className="btn" onClick={() => this.handleShowHideSpot(item)}>{item.display ? <span style={{ color: "green" }}><i className="fas fa-map-marker-alt"></i></span> : <span style={{ color: "gray" }}><i className="fas fa-map-marker-alt"></i></span>}</button></td>
          :
          <td><button className="btn" onClick={() => this.handleShowHideSpot(item)}>{item.display ? <span style={{ color: "orange" }}><i className="fas fa-broadcast-tower"></i></span> : <span style={{ color: "gray" }}><i className="fas fa-broadcast-tower"></i></span>}</button></td>
        }
      </tr>
    ));

    return (

      <div>

        {!this.state.token ? <div></div> :
          <div>
            <br ></br>
            <div className="mb-1">

              <div className="float-left mr-1"><DropDown lookupList={this.props.lookupTrackerList} onClick={this.handleChangeDevice} selectedItem={this.state.deviceSelected}></DropDown> </div>

              <div className="float-left"> <DropDown lookupList={this.state.gpsMaxList} onClick={this.handleChangeMaxGps} selectedItem={this.state.gpsMaxSelected}></DropDown></div>

              {this.state.alertDeviceEUI !== 0 && <div style={{ float: "right", height: "40px", padding: "7px" }} className="alert alert-danger" role="alert"> Alert on tracker: {this.props.trackerList.filter(p => p.deviceEUI == this.state.alertDeviceEUI)[0].deviceDescription} (EUI : {this.state.alertDeviceEUI})</div>}

              <div style={{ clear: "both" }}></div>
            </div>
            <div className="row float-none">
              <div className="col-md-6">
                <table className="table" >
                  <thead className="thead-light">
                    <tr>
                      <th scope="col"></th>
                      <th scope="col">Date</th>
                      <th scope="col">Longitude</th>
                      <th scope="col">Latitude</th>
                      <th scope="col">Tracker</th>
                      <th scope="col"><button className="btn" onClick={() => this.handleShowHideSpot(null)}><span style={{ color: "green" }}><i className="fas fa-map-marker-alt"></i></span></button></th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayList}
                  </tbody>
                </table>
              </div>
              <div className="col-md-6">
                <div id="map" className="map" style={{ height: 700 }}><div id="popup"></div></div>
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
    lookupTrackerList: state.lookupTrackerList,
    trackerList: state.trackerList,
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    getTrackerLookupList: (token: any) => dispatch<any>(actions.default.tracker.lookupList(token)),
    getTrackerList: (token: any) => dispatch<any>(actions.default.tracker.trackerList(token)),
    getGpsPosition: (token: any, deviceId: any, maxData: any) => dispatch<any>(actions.default.gps.getGpsDataList(token, deviceId, maxData)),
    hideShowGpsPosition: (position: any) => dispatch<any>(actions.default.gps.hideShowGpsPosition(position)),
    deleteGpsData: (token: any, id: any) => dispatch<any>(actions.default.gps.deleteGpsData(token, id)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withAuth(Map));