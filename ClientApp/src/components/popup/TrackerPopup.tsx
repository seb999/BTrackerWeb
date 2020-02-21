import * as React from 'react';
import { Modal, Button } from "react-bootstrap";
import { connect } from 'react-redux';
import * as actionCreator from '../../actions/actions';
import { Dispatch } from 'redux';
import { Device } from '../../class/Device';
import socketIOClient from "socket.io-client";
import appsettings from '../../appsettings'

interface State {
    deviceId: any;
    deviceEui: any;
    deviceDescription: any;
    ttnDevID: any;
    loraMessageEndpoint: string;
}

interface Props {
    popupTitle: string,
    device: Device,
    token: any,
    show: boolean,
    hide(error: string): void,
    saveTracker(token: any, p: Device): void;
    updateTracker(token: any, p: Device): void;
}

class TrackerPopup extends React.Component<Props, State>{
    private socket: any;

    constructor(props: any) {
        super(props)
        this.state = {
            deviceId: 0,
            deviceEui: '',
            deviceDescription: '',
            ttnDevID: '',
            loraMessageEndpoint: appsettings.loraMessageEndpoint,
        };
    }

    componentDidUpdate(nextProps: any) {
        //Detect if we update a tracker
        if (this.props !== nextProps) {
            this.setState({
                deviceId: this.props.device.deviceId,
                deviceEui: this.props.device.deviceEUI,
                deviceDescription: this.props.device.deviceDescription,
                ttnDevID: this.props.device.ttnDevID,
            })
        }
    }

    ///////////////////////////////////////////////////////////////////////
    //This part of the code subscribe to TTN callback functions          //
    //When we delete / add/ update a tracker, we get a callback from TTN //
    //and then we update the localDB                                     //
    ///////////////////////////////////////////////////////////////////////
    connectToMqtt = () => {
        this.socket = socketIOClient(appsettings.loraMessageEndpoint, { autoConnect: false, reconnectionAttempts: 5 });

        this.socket.on("connect", () => {
            console.log("Connected");
        });

        this.socket.on("disconnect", () => {
            console.log("Disconnected");
        });

        //Callback TTN save succeeded
        this.socket.on("ttnAddSucceeded", (ttnDevID: string) => {
            console.log("device eui", this.state.deviceEui);

            //Add new device to local db
            var myDevice: Device = ({
                deviceId: this.state.deviceId,
                deviceEUI: this.state.deviceEui,
                deviceDescription: this.state.deviceDescription,
                ttnDevID: ttnDevID,
            });
            this.props.saveTracker(this.props.token, myDevice);
            this.props.hide("");
            this.disconnectFromMqtt();
        })

        //Callback TTN save fail
        this.socket.on("ttnAddFail", (error: any) => {
            this.props.hide(error);
            this.disconnectFromMqtt();
        });

        this.socket.on("ttnUpdateSucceeded", () => {
            //Add new device to local db
            var myDevice: Device = ({
                deviceId: this.state.deviceId,
                deviceEUI: this.state.deviceEui,
                deviceDescription: this.state.deviceDescription,
                ttnDevID: this.state.ttnDevID,
            });
            this.props.updateTracker(this.props.token, myDevice);
            this.props.hide("");
            this.disconnectFromMqtt();
        })

        //Callback TTN update fail
        this.socket.on("ttnUpdateFail", (error: any) => {
            this.props.hide(error);
            this.disconnectFromMqtt();
        });

        this.socket.open();
    };

    disconnectFromMqtt = () => {
        this.socket.disconnect();
    }

    handleChange = (e: any) => {
        this.setState({
            [e.target.id]: e.target.value
        } as any)
    }

    handleSaveDevice = (e: any) => {
        e.preventDefault();
         //1 - connect to mqtt
         this.connectToMqtt();

        if (this.state.deviceId === 0) {
            //Add new tracker to TTN
            let payload = { EUI: this.state.deviceEui, Description: this.state.deviceDescription }
            this.socket.emit("ttnAddDevice", payload);
        }
        else {
            //Update existing tracker on TTN
            let payload = { EUI: this.state.deviceEui, Description: this.state.deviceDescription, devID: this.state.ttnDevID }
            this.socket.emit("ttnUpdateDevice", payload);
        }
    }

    render() {
        return (
            <div>
                <Modal show={this.props.show} onHide={() => this.props.hide("")}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.props.popupTitle}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form id="newTrackerForm" className="form-signin" onSubmit={this.handleSaveDevice}>

                            <input id="deviceId" value={this.state.deviceId} type="text" className="form-control" placeholder="device Id" readOnly hidden></input>

                            <div className="form-label-group">
                                <label>EUI</label>
                                <input id="deviceEui" value={this.state.deviceEui} type="text" className="form-control" placeholder="EUI code" required onChange={this.handleChange}></input>
                            </div>

                            <div className="form-label-group">
                                <label>Add a description for your tracker</label>
                                <input id="deviceDescription" value={this.state.deviceDescription} type="text" className="form-control" placeholder="Description" required onChange={this.handleChange}></input>
                            </div>

                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.props.hide("")}>
                            Close
                                </Button>
                        <Button variant="primary" type="submit" form="newTrackerForm" >
                            Save Changes
                                </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

//map the props of this class to the root redux state
const mapStateToProps = (state: any) => {
    return {
        userId: state.userId,
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        saveTracker: (token: any, device: any) => dispatch<any>(actionCreator.default.tracker.saveTracker(token, device)),
        updateTracker: (token: any, device: any) => dispatch<any>(actionCreator.default.tracker.updateTracker(token, device)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TrackerPopup);