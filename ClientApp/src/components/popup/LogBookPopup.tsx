import * as React from 'react';
import { Modal, Button } from "react-bootstrap";
import { connect } from 'react-redux';
import * as actionCreator from '../../actions/actions';
import { Dispatch } from 'redux';
import { Device } from '../../class/Device';
import socketIOClient from "socket.io-client";
import appsettings from '../../appsettings';
import { Log } from "../../class/Log";
import { debug } from 'console';


interface State {
    logBookId: any;
    logBookDate: any;
    logBookAircraftModel: any;
    logBookAircraftRegistration: any;
    logBookDeparturePlace: any;
    logBookDepartureTime: any;
    logBookArrivalPlace: any;
    logBookArrivalTime: any;
    logBookTotalFlightTime: any;
}

interface Props {
    popupTitle: string,
    log: Log,
    token: any,
    show: boolean,
    hide(): void,
    saveLog(token: any, user: any): void;
    updateLog(token: any, p: Device): void;
}

class LogBookPopup extends React.Component<Props, State>{
    private socket: any;

    constructor(props: any) {
        super(props)
        this.state = {
            logBookId: 0,
            logBookDate: '',
            logBookAircraftModel:"",
            logBookAircraftRegistration: "",
            logBookDeparturePlace: "",
            logBookDepartureTime: "",
            logBookArrivalPlace: "",
            logBookArrivalTime: "",
            logBookTotalFlightTime: "",

        };
    }

    componentDidUpdate(nextProps: any) {
        //Detect if we update a user
        // if (this.props !== nextProps) {
        //     this.setState({
        //         userId: this.props.user.smartHouseUserId,
        //         userName: this.props.user.smartHouseUserName,
        //         userArrival: this.props.user.smartHouseUserArrival,
        //         userCode: this.props.user.smartHouseUserCode,
        //         userEmail: this.props.user.smartHouseUserEmail,
        //         userIsDesactivated: this.props.user.smartHouseUserIsDesactivated,
        //         userLeave: this.props.user.smartHouseUserLeave,
        //     })
        // }
    }

    handleChange = (e: any) => {
        this.setState({
            [e.target.id]: e.target.value
        } as any);

    }

    handleChangeArrivalDeparture = (e:any) =>{
        this.setState({
            [e.target.id]: e.target.value
        } as any);
        
        let startTime = this.state.logBookDepartureTime.split(':');
        let endTime = this.state.logBookArrivalTime.split(':');
        console.log(endTime[0]*60 + endTime[1]);
        let totalTime = endTime[0]*60 + endTime[1] - (startTime[0]*60 + startTime[1]);
        

        this.setState({
            logBookTotalFlightTime : totalTime,
        });
    }

    handleSaveLog = (e: any) => {
        e.preventDefault();
        //Add new device to local db
        var myLog: Log = ({
            logBookDate: this.state.logBookDate,
            logBookAircraftModel: this.state.logBookAircraftModel,
            logBookAircraftRegistration: this.state.logBookAircraftRegistration,
            logBookDeparturePlace: this.state.logBookDeparturePlace,
            logBookDepartureTime: this.state.logBookDepartureTime,
            logBookArrivalPlace: this.state.logBookArrivalPlace,
            logBookArrivalTime: this.state.logBookArrivalTime,
            
        });
        this.props.saveLog(this.props.token, myLog);
        this.props.hide();
    }

    render() {
        return (
            <div>
                <Modal show={this.props.show} onHide={() => this.props.hide()}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.props.popupTitle}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form id="newUserForm" className="form-signin" onSubmit={this.handleSaveLog}>

                            <input id="userId" value={this.state.logBookId} type="text" className="form-control" readOnly hidden></input>

                            <div className="mb-2 row">
                                <label className="col-sm-4 col-form-label">Date of flight</label>
                                <div className="col-sm-8">
                                    <input id="logBookDate" value={this.state.logBookDate} type="datetime-local" className="form-control" placeholder="Date" required onChange={this.handleChange}></input>
                                </div>
                            </div>

                            <div className="mb-2 row">
                                <label className="col-sm-4 col-form-label">Model</label>
                                <div className="col-sm-8">
                                    <input id="logBookAircraftModel" value={this.state.logBookAircraftModel} type="text" className="form-control" placeholder="Aircraft model" required onChange={this.handleChange}></input>
                                </div>
                            </div>

                            <div className="mb-2 row">
                                <label className="col-sm-4 col-form-label">Registration</label>
                                <div className="col-sm-8">
                                    <input id="logBookAircraftRegistration" value={this.state.logBookAircraftRegistration} type="text" className="form-control" placeholder="Aircraft registration" required onChange={this.handleChange}></input>
                                </div>
                            </div>

                            <div className="mb-2 row">
                                <label className="col-sm-4 col-form-label">From</label>
                                <div className="col-sm-8">
                                    <input id="logBookDeparturePlace" value={this.state.logBookDeparturePlace} type="text" className="form-control" placeholder="Airport departure" required onChange={this.handleChange}></input>
                                </div>
                            </div>

                            <div className="mb-2 row">
                                <label className="col-sm-4 col-form-label">Departure time</label>
                                <div className="col-sm-8">
                                <input id="logBookDepartureTime" value={this.state.logBookDepartureTime} type="time" className="form-control" placeholder="Date" required onChange={this.handleChangeArrivalDeparture}></input>
                                </div>
                            </div>

                            <div className="mb-2 row">
                                <label className="col-sm-4 col-form-label">To</label>
                                <div className="col-sm-8">
                                    <input id="logBookArrivalPlace" value={this.state.logBookArrivalPlace} type="text" className="form-control" placeholder="Airport arrival" required onChange={this.handleChange}></input>
                                </div>
                            </div>

                            <div className="mb-2 row">
                                <label className="col-sm-4 col-form-label">Arrival time</label>
                                <div className="col-sm-8">
                                <input id="logBookArrivalTime" value={this.state.logBookArrivalTime} type="time" className="form-control" placeholder="Date" required onChange={this.handleChangeArrivalDeparture}></input>
                                </div>
                            </div>

                            <div className="mb-2 row">
                                <label className="col-sm-4 col-form-label">Total time flight</label>
                                <div className="col-sm-8">
                                <input id="logBookTotalFlightTime" value={this.state.logBookTotalFlightTime} type="text" className="form-control" placeholder="" required onChange={this.handleChange}></input>
                                </div>
                            </div>

                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.props.hide()}>
                            Close
                                </Button>
                        <Button variant="primary" type="submit" form="newUserForm" >
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
        isDoorCodeValid: state.isNewDoorCodeValid
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        saveLog: (token: any, log: any) => dispatch<any>(actionCreator.default.logbook.addLog(token, log)),
        updateLog: (token: any, log: any) => dispatch<any>(actionCreator.default.logbook.updateLog(token, log)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LogBookPopup);