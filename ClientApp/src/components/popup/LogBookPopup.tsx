import * as React from 'react';
import { Modal, Button } from "react-bootstrap";
import { connect } from 'react-redux';
import * as actionCreator from '../../actions/actions';
import { Dispatch } from 'redux';
import { Log } from "../../class/Log";
import Select from 'react-select';
import { MyLookup } from '../../class/Enums';
import moment from 'moment';

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
    logBookDescription: any;
    logBookIFR: any;
    logBookPIC: any;
    logBookNight: any;
    logBookDual: any;
    logBookCoPilot: any;
    logBookLanding: number;
}

interface Props {
    popupTitle: string;
    log: Log;
    token: any;
    show: boolean;
    aircraftModelList: any;
    airportList: any;

    hide(): void;
    saveLog(token: any, p: Log): void;
    updateLog(token: any, p: Log): void;
    getLookupList(): any;
}

class LogBookPopup extends React.Component<Props, State>{
    private socket: any;

    constructor(props: any) {
        super(props)
        this.state = {
            logBookId: 0,
            logBookDate: "",
            logBookAircraftModel: "",
            logBookAircraftRegistration: "",
            logBookDeparturePlace: "",
            logBookDepartureTime: "",
            logBookArrivalPlace: "",
            logBookArrivalTime: "",
            logBookTotalFlightTime: "",
            logBookDescription: "",
            logBookIFR: null,
            logBookPIC: null,
            logBookNight: null,
            logBookDual: null,
            logBookCoPilot: null,
            logBookLanding: 0,
        };
    }

    componentDidMount() {
        this.props.getLookupList();
    }

    componentDidUpdate(nextProps: any) {
        let aircraftLabel = this.props.log.aircraftModel != undefined ? this.props.log.aircraftModel.aircraftModelName : null;
        let aircraftValue = this.props.log.aircraftModel != undefined ? this.props.log.aircraftModel.aircraftModelId : null;
        let airportDepartureLabel = this.props.log.airportDeparture != undefined ? this.props.log.airportDeparture.airportName + " | " + this.props.log.airportDeparture.airportCode : null;
        let airportArrivalLabel = this.props.log.airportArrival != undefined ? this.props.log.airportArrival.airportName + " | " + this.props.log.airportArrival.airportCode : null;
        let airportDepartureValue = this.props.log.airportDeparture != undefined ? this.props.log.airportDeparture.airportId : null;
        let airportArrivalValue = this.props.log.airportArrival != undefined ? this.props.log.airportArrival.airportId : null;

        //Edit selected logbook
        if (this.props !== nextProps) {
            console.log(this.props.log);
            this.setState({
                logBookId: this.props.log.logBookId,
                logBookDate: moment.parseZone(this.props.log.logBookDate).format('YYYY-MM-DD'),
                logBookAircraftModel: { label: aircraftLabel, value: aircraftValue },
                logBookAircraftRegistration: this.props.log.logBookAircraftRegistration,
                logBookDeparturePlace: { label: airportDepartureLabel, value: airportDepartureValue },
                logBookDepartureTime: this.props.log.logBookDepartureTime,
                logBookArrivalPlace: { label: airportArrivalLabel, value: airportArrivalValue },
                logBookArrivalTime: this.props.log.logBookArrivalTime,
                logBookTotalFlightTime: this.props.log.logBookTotalFlightTime,
                logBookDescription: this.props.log.logBookDescription,
                logBookIFR: this.props.log.logBookIFR != null ? this.props.log.logBookIFR : false,
                logBookPIC: this.props.log.logBookPIC != null ? this.props.log.logBookPIC : false,
                logBookCoPilot: this.props.log.logBookCoPilot != null ? this.props.log.logBookCoPilot : false,
                logBookDual: this.props.log.logBookDual != null ? this.props.log.logBookDual : false,
                logBookNight: this.props.log.logBookNight != null ? this.props.log.logBookNight : false,
                logBookLanding: this.props.log.logBookLanding != undefined ? this.props.log.logBookLanding : 0,
            })
        }
    }

    handleChange = (e: any) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        this.setState({
            [e.target.id]: value
        } as any);
    }

    handleAircraftChange = (logBookAircraftModel: any) => {
        this.setState({ logBookAircraftModel });
    };

    handleAirportDepartureChange = (logBookDeparturePlace: any) => {
        this.setState({ logBookDeparturePlace });
    };

    handleAirportArrivalChange = (logBookArrivalPlace: any) => {
        this.setState({ logBookArrivalPlace });
    };

    handleDepartureChange = (e: any) => {
        this.setState({
            logBookDepartureTime: e.target.value,
        });
        if (this.state.logBookArrivalTime != undefined) {
            this.calculateFlightTime(e.target.value, this.state.logBookArrivalTime);
        }
    }

    handleArrivalChange = (e: any) => {
        this.setState({
            logBookArrivalTime: e.target.value,
        });
        if (this.state.logBookDepartureTime != undefined) {
            this.calculateFlightTime(this.state.logBookDepartureTime, e.target.value);
        }
    }

    calculateFlightTime = (depart: any, arrival: any) => {
        let totalTime = 0;
        let startTime = depart.split(':');
        let endTime = arrival.split(':');
        totalTime = (endTime[0] * 60 + endTime[1] * 1) - (startTime[0] * 60 + startTime[1] * 1);
        this.setState({
            logBookTotalFlightTime: totalTime / 60,
        });
    }

    handleSaveLog = (e: any) => {
        e.preventDefault();
        var myLog: Log = ({
            logBookId: this.state.logBookId,
            logBookDate: this.state.logBookDate,
            airportDepartureId: this.state.logBookDeparturePlace.value,
            airportArrivalId: this.state.logBookArrivalPlace.value,
            logBookAircraftRegistration: this.state.logBookAircraftRegistration,
            logBookDepartureTime: this.state.logBookDepartureTime,
            logBookArrivalTime: this.state.logBookArrivalTime,
            logBookTotalFlightTime: this.state.logBookTotalFlightTime,
            aircraftModelId: this.state.logBookAircraftModel.value,
            logBookDescription: this.state.logBookDescription,
            logBookCoPilot:this.state.logBookCoPilot,
            logBookNight:this.state.logBookNight,
            logBookDual:this.state.logBookDual,
            logBookIFR:this.state.logBookIFR,
            logBookPIC:this.state.logBookPIC,
            logBookLanding:this.state.logBookLanding,
        });
        console.log(myLog);
        
        if (myLog.logBookId != undefined) {
            this.props.updateLog(this.props.token, myLog);
        }
        else {
            this.props.saveLog(this.props.token, myLog);
        }

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

                            <input id="logBookId" value={this.state.logBookId || ''} type="text" className="form-control" readOnly hidden></input>

                            <div className="row mb-2">
                                <div className="col-sm-2">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" checked={this.state.logBookIFR } id="logBookIFR"  onClick={this.handleChange}></input>
                                        <label className="form-check-label" >IFR</label>
                                    </div>
                                </div>
                                <div className="col-sm-2">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" checked={this.state.logBookNight} id="logBookNight" onClick={this.handleChange}></input>
                                        <label className="form-check-label" >Night</label>
                                    </div>
                                </div>
                                <div className="col-sm-2">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" checked={this.state.logBookPIC} id="logBookPIC" onClick={this.handleChange}></input>
                                        <label className="form-check-label" >PIC</label>
                                    </div>
                                </div>
                                <div className="col-sm-3">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" checked={this.state.logBookCoPilot} id="logBookCoPilot" onClick={this.handleChange}></input>
                                        <label className="form-check-label" >Co-Pilot</label>
                                    </div>
                                </div>
                                <div className="col-sm-2">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" checked={this.state.logBookDual} id="logBookDual" onClick={this.handleChange}></input>
                                        <label className="form-check-label" >Dual</label>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-2 row">
                                <label className="col-sm-4 col-form-label">Date of flight</label>
                                <div className="col-sm-8">
                                    <input id="logBookDate" value={this.state.logBookDate} type="date" className="form-control" placeholder="Date" required onChange={this.handleChange}></input>
                                </div>
                            </div>

                            <div className="mb-2 row">
                                <label className="col-sm-4 col-form-label">Model</label>
                                <div className="col-sm-8">
                                    <Select id="logBookAircraftModel" onChange={this.handleAircraftChange} options={this.props.aircraftModelList} placeholder="Aircraft model" value={this.state.logBookAircraftModel} />
                                </div>
                            </div>

                            <div className="mb-2 row">
                                <label className="col-sm-4 col-form-label">Registration</label>
                                <div className="col-sm-8">
                                    <input id="logBookAircraftRegistration" value={this.state.logBookAircraftRegistration || ''} type="text" className="form-control" placeholder="Aircraft registration" required onChange={this.handleChange}></input>
                                </div>
                            </div>

                            <div className="mb-2 row">
                                <label className="col-sm-4 col-form-label">From</label>
                                <div className="col-sm-8">
                                    <Select id="logBookDeparturePlace" onChange={this.handleAirportDepartureChange} options={this.props.airportList} placeholder="Airport departure" value={this.state.logBookDeparturePlace} />
                                </div>
                            </div>

                            <div className="mb-2 row">
                                <label className="col-sm-4 col-form-label">Departure time</label>
                                <div className="col-sm-8">
                                    <input id="logBookDepartureTime" value={this.state.logBookDepartureTime || ''} type="time" className="form-control" placeholder="Date" required onChange={this.handleDepartureChange}></input>
                                </div>
                            </div>

                            <div className="mb-2 row">
                                <label className="col-sm-4 col-form-label">To</label>
                                <div className="col-sm-8">
                                    <Select id="logBookArrivalPlace" onChange={this.handleAirportArrivalChange} options={this.props.airportList} placeholder="Airport departure" value={this.state.logBookArrivalPlace} />
                                </div>
                            </div>

                            <div className="mb-2 row">
                                <label className="col-sm-4 col-form-label">Arrival time</label>
                                <div className="col-sm-8">
                                    <input id="logBookArrivalTime" value={this.state.logBookArrivalTime || ''} type="time" className="form-control" placeholder="Date" required onChange={this.handleArrivalChange}></input>
                                </div>
                            </div>

                            <div className="mb-2 row">
                                <label className="col-sm-4 col-form-label">Total time flight</label>
                                <div className="col-sm-8">
                                    <input id="logBookTotalFlightTime" value={this.state.logBookTotalFlightTime || ''} type="text" className="form-control" placeholder="" required onChange={this.handleChange}></input>
                                </div>
                            </div>

                            <div className="mb-2 row">
                                <label className="col-sm-4 col-form-label">Landings</label>
                                <div className="col-sm-8">
                                    <input id="logBookLanding" value={this.state.logBookLanding || ''} type="text" className="form-control" placeholder="" required onChange={this.handleChange}></input>
                                </div>
                            </div>

                            <div className="mb-2 row">
                                <label className="col-sm-4 col-form-label">Note</label>
                                <div className="col-sm-8">
                                    <textarea id="logBookDescription" value={this.state.logBookDescription} rows={3} className="form-control" placeholder="" required onChange={this.handleChange}></textarea>
                                </div>
                            </div>

                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.props.hide()}>
                            Close
                                </Button>
                        <Button variant="warning" type="submit" form="newUserForm" >
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
        isDoorCodeValid: state.isNewDoorCodeValid,
        aircraftModelList: state.lookupList[MyLookup.AircraftList],
        airportList: state.lookupList[MyLookup.AirportList],
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        saveLog: (token: any, log: any) => dispatch<any>(actionCreator.default.logbook.addLog(token, log)),
        updateLog: (token: any, log: any) => dispatch<any>(actionCreator.default.logbook.updateLog(token, log)),
        getLookupList: () => dispatch<any>(actionCreator.default.lookup.getLookupList()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LogBookPopup);