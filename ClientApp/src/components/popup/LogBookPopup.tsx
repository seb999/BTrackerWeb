import * as React from 'react';
import { Modal, Button } from "react-bootstrap";
import { connect } from 'react-redux';
import * as actionCreator from '../../actions/actions';
import { Dispatch } from 'redux';
import { Device } from '../../class/Device';
import { Log } from "../../class/Log";
import Select from 'react-select';
import { MyLookup } from '../../class/Enums';

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ];

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
    logBookDescription:any;
}

interface Props {
    popupTitle: string;
    log: Log;
    token: any;
    show: boolean;
    aircraftModelList : any;
    airportList : any;

    hide(): void;
    saveLog(token: any, user: any): void;
    updateLog(token: any, p: Device): void;
    getLookupList(): any;

}

class LogBookPopup extends React.Component<Props, State>{
    private socket: any;

    constructor(props: any) {
        super(props)
        this.state = {
            logBookId: 0,
            logBookDate: '',
            logBookAircraftModel: "",
            logBookAircraftRegistration: "",
            logBookDeparturePlace: "",
            logBookDepartureTime: "",
            logBookArrivalPlace: "",
            logBookArrivalTime: "",
            logBookTotalFlightTime: "",
            logBookDescription: "",

        };
    }

    componentDidMount(){
        this.props.getLookupList();
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

    handleChangeDeparture = (e: any) => {
        let totalTime = 0;
        if (e.target.value.length == 5) {

            let startTime = e.target.value.split(':');
            let endTime = this.state.logBookArrivalTime.split(':');
            if (this.state.logBookArrivalTime.length == 5) {
                let totalTime = (endTime[0] * 60 + endTime[1] * 1) - (startTime[0] * 60 + startTime[1] * 1);
            }

            this.setState({
                logBookDepartureTime: e.target.value,
                logBookTotalFlightTime: totalTime / 60,
            });
        }
    }

    handleAircraftChange = (logBookAircraftModel:any) => {
        this.setState({ logBookAircraftModel });
      };

      handleAirportDepartureChange = (logBookDeparturePlace:any) => {
        this.setState({ logBookDeparturePlace });
      };

      handleAirportArrivalChange = (logBookArrivalPlace:any) => {
        this.setState({ logBookArrivalPlace });
      };

    handleChangeArrival = (e: any) => {
        if (e.target.value.length == 5) {

            let endTime = e.target.value.split(':');
            let startTime = this.state.logBookDepartureTime.split(':');
            let totalTime = (endTime[0] * 60 + endTime[1] * 1) - (startTime[0] * 60 + startTime[1] * 1);

            this.setState({
                logBookArrivalTime: e.target.value,
                logBookTotalFlightTime: totalTime / 60,
            });
        }
    }

    handleSaveLog = (e: any) => {
        e.preventDefault();
        //Add new device to local db
        var myLog: Log = ({
            logBookDate: this.state.logBookDate,
            airportDepartureId : this.state.logBookDeparturePlace.value,
            airportArrivalId : this.state.logBookArrivalPlace.value,
            logBookAircraftRegistration: this.state.logBookAircraftRegistration,
            logBookDepartureTime: this.state.logBookDepartureTime,
            logBookArrivalTime: this.state.logBookArrivalTime,
            logBookTotalFlightTime: this.state.logBookTotalFlightTime,
            aircraftModelId : this.state.logBookAircraftModel.value,
            logBookDescription : this.state.logBookDescription,
        });
        this.props.saveLog(this.props.token, myLog);
        this.props.hide();
    }

    render() {
        console.log(this.props.aircraftModelList);
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
                                    <input id="logBookDate" value={this.state.logBookDate} type="date" className="form-control" placeholder="Date" required onChange={this.handleChange}></input>
                                </div>
                            </div>

                            <div className="mb-2 row">
                                <label className="col-sm-4 col-form-label">Model</label>
                                <div className="col-sm-8">
                                    <Select id="logBookAircraftModel" onChange={this.handleAircraftChange} options={this.props.aircraftModelList} placeholder="Aircraft model" value={this.state.logBookAircraftModel}/>
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
                                    <Select id="logBookDeparturePlace" onChange={this.handleAirportDepartureChange} options={this.props.airportList} placeholder="Airport departure" value={this.state.logBookDeparturePlace}/>
                                </div>
                            </div>

                            <div className="mb-2 row">
                                <label className="col-sm-4 col-form-label">Departure time</label>
                                <div className="col-sm-8">
                                    <input id="logBookDepartureTime" value={this.state.logBookDepartureTime} type="time" className="form-control" placeholder="Date" required onChange={this.handleChangeDeparture}></input>
                                </div>
                            </div>

                            <div className="mb-2 row">
                                <label className="col-sm-4 col-form-label">To</label>
                                <div className="col-sm-8">
                                    <Select id="logBookArrivalPlace" onChange={this.handleAirportArrivalChange} options={this.props.airportList} placeholder="Airport departure" value={this.state.logBookArrivalPlace}/>
                                </div>
                            </div>

                            <div className="mb-2 row">
                                <label className="col-sm-4 col-form-label">Arrival time</label>
                                <div className="col-sm-8">
                                    <input id="logBookArrivalTime" value={this.state.logBookArrivalTime} type="time" className="form-control" placeholder="Date" required onChange={this.handleChangeArrival}></input>
                                </div>
                            </div>

                            <div className="mb-2 row">
                                <label className="col-sm-4 col-form-label">Total time flight</label>
                                <div className="col-sm-8">
                                    <input id="logBookTotalFlightTime" value={this.state.logBookTotalFlightTime} type="text" className="form-control" placeholder="" required onChange={this.handleChange}></input>
                                </div>
                            </div>

                            <div className="mb-2 row">
                                <label className="col-sm-4 col-form-label">Note</label>
                                <div className="col-sm-8">
                                    <textarea id="logBookDescription" value={this.state.logBookDescription}  rows={3}  className="form-control" placeholder="" required onChange={this.handleChange}></textarea>
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
        airportList : state.lookupList[MyLookup.AirportList],
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