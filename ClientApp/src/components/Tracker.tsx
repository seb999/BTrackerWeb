import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as actionCreator from '../actions/actions';
import TrackerPopup from "./popup/TrackerPopup";
import ConfirmPopup from "./popup/ConfirmPopup";
import { withAuth } from '@okta/okta-react';
import { Device } from '../class/Device';
import * as moment from 'moment';  //Format date
import appsettings from '../appsettings';
import socketIOClient from "socket.io-client";

interface AppFnProps {
    getTrackerList(token: any): void;
    deleteTracker(token: any, deviceId?: number): void;
}

interface AppObjectProps {
    auth?: any;
    trackerList: Array<Device>;
    isTrackerSaved: boolean;
    isTrackerDeleted: boolean;
    isTrackerUpdated: boolean;
    socketIO: any;
}

interface Props
    extends AppObjectProps,
    AppFnProps { }

interface State {
    selectedTracker: Device,
    showPopupTracker: boolean,
    showConfirmPopup: boolean,
    token: any,
    popupTitle: string,
    isTrackerNotSaved: boolean;
    errorMessage: string;
}

class Tracker extends React.Component<Props, State>{
    public socket: any;

    constructor(props: any) {
        super(props);

        this.state = {
            showPopupTracker: false,
            showConfirmPopup: false,
            token: null,
            popupTitle: "",
            selectedTracker: {},
            isTrackerNotSaved: false,
            errorMessage: "",
        };
    };

    async componentDidMount() {
        try {
            this.setState({
                token: await this.props.auth.getAccessToken()
            })
            if (!this.state.token) { this.props.auth.login('/') }
            else {
                this.props.getTrackerList(this.state.token);
               // this.connectToMqtt();
            }
        } catch (err) {
            // handle error as needed
        }
    }

    ////////////////////////////////////////////////////////////////
    ///This part of the code subscribe to TTN callback functions ///
    ////////////////////////////////////////////////////////////////
    connectToMqtt = () => {
        this.socket = socketIOClient(appsettings.loraMessageEndpoint, { autoConnect: false, reconnectionAttempts: 5 });

        this.socket.on("ttnUpdateSucceeded", (devId:any) => {
            //add device to local db
            console.log("added from local db");
            //this.props.(this.state.token, this.state.selectedTracker.deviceId)

           this.disconnectFromMqtt();
        });

        this.socket.on("ttnDeleteSucceeded", () => {
            //Delete from local db
            console.log("delete from local db");
           // this.props.deleteTracker(this.state.token, this.state.selectedTracker.deviceId)

           this.disconnectFromMqtt();
        });

        this.socket.on("connect", () => {
            //Delete from local db
            console.log("Connected");
        });

        this.socket.on("disconnect", () => {
            //Delete from local db
            console.log("Disconnected");
        });

        this.socket.open();
    };

    disconnectFromMqtt = () => {
        this.socket.disconnect();
    }

    handleClose = (data: string) => {
        if (data === "grpc: error unmarshalling request: ttn/core: Invalid length for EUI64") {
            this.setState({
                showPopupTracker: false,
                errorMessage: "Invalid EUI, try again",
                isTrackerNotSaved: true,
            });
        }

        if (data === "Device with AppEUI and DevEUI already exists") {
            this.setState({
                showPopupTracker: false,
                errorMessage: "A device with same EUI already exists",
                isTrackerNotSaved: true,
            });
        }

        setTimeout(() => {
            this.setState({
                errorMessage: "",
                isTrackerNotSaved: false,
            });
        }, 5000);

        this.setState({
            showPopupTracker: false,
        });
    }

    handleAddTracker = () => {
        this.setState({
            popupTitle: "Add New Tracker",
            selectedTracker: { deviceDescription: '', deviceEUI: '', deviceId: 0 },
            showPopupTracker: true
        });
    }

    handleEditTracker = (tracker: any) => {
        this.setState({
            popupTitle: "Edit Tracker",
            selectedTracker: tracker,
            showPopupTracker: true
        });
    }

    handleDeleteTracker = (tracker: any) => {
        this.setState({
            selectedTracker: tracker,
            showConfirmPopup: true
        });
    }

    handleConfirmDelete = (deleteTracker: boolean) => {
        if (deleteTracker) {
            //1 - connect to mqtt
            this.connectToMqtt();
           
            //2 -Delete from TTN, it will fire ttnDeleteSucceeded
            this.socket.emit("ttnDeleteDevice", this.state.selectedTracker.ttnDevID);
        }
        this.setState({ showConfirmPopup: false });
    }

    render() {
        let displayList = this.props.trackerList.map((item, index) => (
            <tr key={index}>
                <td>{item.deviceEUI}</td>
                <td>{item.ttnDevID}</td>
                <td>{item.deviceDescription}</td>
                <td>{moment.utc(item.dateAdded).format('YYYY-MM-DD HH:MM')}</td>
                <td><button className="btn" onClick={() => this.handleEditTracker(item)}><span style={{ color: "green" }}><i className="fas fa-edit"></i></span></button></td>
                <td><button className="btn" onClick={() => this.handleDeleteTracker(item)}><span style={{ color: "red" }}><i className="far fa-trash-alt"></i></span></button></td>
            </tr>
        ));

        return (

            <div>
                {!this.state.token ? <div></div> :
                    <div>
                        <br ></br>
                        <div >
                            <button style={{ float: "left" }} type="button" className="btn btn-success btn-sm" onClick={this.handleAddTracker}><span><i className="fas fa-edit"></i></span> Add new tracker</button>
                            {this.props.isTrackerSaved && <div style={{ float: "right", height: "32px", padding: "3px" }} className="alert alert-success" role="alert"> New tracker saved and ready to be used!</div>}
                            {this.props.isTrackerDeleted && <div style={{ float: "right", height: "32px", padding: "3px" }} className="alert alert-danger" role="alert"> Tracker deleted!</div>}
                            {this.props.isTrackerUpdated && <div style={{ float: "right", height: "32px", padding: "3px" }} className="alert alert-success" role="alert"> Tracker updated and ready to be used!</div>}
                            {this.state.isTrackerNotSaved && <div style={{ float: "right", height: "32px", padding: "3px" }} className="alert alert-danger alert-sm" role="alert"> {this.state.errorMessage}</div>}
                        </div>

                        <br /><br />
                        <table className="table table-sm table-bordered" >
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">EUI</th>
                                    <th scope="col">TheThingNetwork ID</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Added date</th>
                                    <th scope="col">Edit</th>
                                    <th scope="col">delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayList}
                            </tbody>
                        </table>

                        <TrackerPopup show={this.state.showPopupTracker} popupTitle={this.state.popupTitle} device={this.state.selectedTracker} hide={this.handleClose} token={this.state.token} />

                        <ConfirmPopup show={this.state.showConfirmPopup} hide={this.handleConfirmDelete} title="Delete tracker" content="Do you really want to delete this tracker ?" />
                    </div>}

            </div>)
    }
}

//map the props of this class to the root redux state
const mapStateToProps = (state: any) => {
    return {
        trackerList: state.trackerList,
        isTrackerSaved: state.isTrackerSaved,
        isTrackerDeleted: state.isTrackerDeleted,
        isTrackerUpdated: state.isTrackerUpdated,
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        getTrackerList: (token: any) => dispatch<any>(actionCreator.default.tracker.trackerList(token)),
        deleteTracker: (token: any, deviceId?: number) => dispatch<any>(actionCreator.default.tracker.deleteTracker(token, deviceId)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withAuth(Tracker));