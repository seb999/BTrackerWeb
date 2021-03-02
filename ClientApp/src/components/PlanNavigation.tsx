import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { withAuth } from '@okta/okta-react';



import * as ol from 'ol';
import * as proj from 'ol/proj';
import * as geom from 'ol/geom';
import * as layer from 'ol/layer';
import * as source from 'ol/source';
import * as style from 'ol/style';
import { textSpanIntersectsWithPosition } from 'typescript';

interface AppFnProps { }

interface AppObjectProps {
    auth?: any;
}

interface Props
    extends AppObjectProps,
    AppFnProps { }

interface State {
    token: any;
}

class PlanNavigation extends React.Component<Props, State>{
    constructor(props: any) {
        super(props);

        this.state = {
            token: null,
        };
    };

    private markerVectorLayer: any;
    private vectorSource: any;
    private map: any;
    private navigationWayPointMarker = [] as any;
    private navigationWayPointLine = [] as any;
    private item = [] as any;

    async componentDidMount() {
        try {
            this.setState({
                token: await this.props.auth.getAccessToken()
            })
            if (!this.state.token) {

                this.props.auth.login('/')
            } else {
                this.initMap();
            }
        } catch (err) {
            // handle error as needed
        }
    }

    initMap = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            let currentPosition = position;

            let baseMapLayer = new layer.Tile({
                source: new source.OSM()
            });
            this.map = new ol.Map({
                target: 'map',
                layers: [baseMapLayer],
                view: new ol.View({
                    center: proj.fromLonLat([currentPosition.coords.longitude, currentPosition.coords.latitude]),
                    zoom: 15
                })
            });

            //Le click sur la carte
            this.map.on('singleclick', (evt: any) => {

                this.handleMapClick(evt);
            });
        });
    }


    handleMapClick = (evt: any) => {

        // Read selected point / convert coordinate to EPSG-4326
        var clickedPosition = proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');

        this.navigationWayPointLine.push(proj.fromLonLat([clickedPosition[0], clickedPosition[1]]));

        //Save here new point in db
        
        //Adding a marker on the map-Call this on component did update
        this.handleMapAddMarker(clickedPosition[0], clickedPosition[1]);
        if (this.navigationWayPointLine.length > 1) {
            this.handleMapAddLine();
        }
    }

    handleMapAddMarker = (lon: any, lat: any) => {
        var marker = new ol.Feature({
            geometry: new geom.Point(
                proj.fromLonLat([lon, lat])
            ),

        });
        marker.setStyle(new style.Style({
            image: new style.Icon(({
                color: '#ffcd46',
                crossOrigin: 'anonymous',
                src: require("./../images/gps_marker2.png"),
            }))
        }));
        this.navigationWayPointMarker.push(marker);

        this.vectorSource = new source.Vector({ features: this.navigationWayPointMarker });
        this.markerVectorLayer = new layer.Vector({ source: this.vectorSource, });
        this.map.addLayer(this.markerVectorLayer);
    }

    handleMapAddLine = () => {
        var myLine = new layer.Vector({
            source: new source.Vector({
                features: [new ol.Feature({
                    geometry: new geom.LineString([this.navigationWayPointLine[this.navigationWayPointLine.length - 2], this.navigationWayPointLine[this.navigationWayPointLine.length - 1]]),
                    name: 'Line',
                })]
            })
        });

        var myStyle = [
            // linestring
            new style.Style({
                stroke: new style.Stroke({
                    color: '#FF4500',
                    width: 2
                })
            })
        ];

        myLine.setStyle(myStyle);
        this.map.addLayer(myLine);
    }


    render() {
        return (
            <div>
                <ul className="nav nav-tabs mt-3" id="myTab" role="tablist">
                    <li className="nav-item waves-effect waves-light">
                        <a className="nav-link active" id="engine-tab" data-toggle="tab" href="#engine" role="tab" aria-controls="Engine plane" aria-selected="false">Way point / Map</a>
                    </li>
                    <li className="nav-item waves-effect waves-light">
                        <a className="nav-link" id="glider-tab" data-toggle="tab" href="#glider" role="tab" aria-controls="Glider" aria-selected="false">Navigation data</a>
                    </li>
                </ul>
                <div className="tab-content" id="myTabContent">

                    <div className="tab-pane fade active show" id="engine" role="tabpanel" aria-labelledby="engine-tab">
                    <button type="button" className="btn btn-success btn-sm mt-2 mb-2 float-right"><span><i className="fas fa-undo"></i></span> Remove last way point</button>
                       <div id="map" className="map" style={{ height: 500 }}><div id="popup"></div></div>
                    </div>
                    <div className="tab-pane fade" id="glider" role="tabpanel" aria-labelledby="glider-tab">

                    </div>
                </div>
            </div>)
    }
}

//map the props of this class to the root redux state
const mapStateToProps = (state: any) => {
    return {
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withAuth(PlanNavigation));