import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as actionCreator from '../actions/actions';
import { withAuth } from '@okta/okta-react';
import * as moment from 'moment';  //Format date
import './css/Tracker.css';
import { Log } from "../class/Log";
import LogBookPopup from "./popup/LogBookPopup";
import MyPopover from "./element/MyPopover";
import ConfirmPopup from './popup/ConfirmPopup';

interface AppFnProps {
    getLogBookList(token: any): void;
    deleteLog(token: any, logId: any): void;
}

interface AppObjectProps {
    logBookList: Array<Log>;
    isLogSaved: boolean;
    isLogDeleted: boolean;
    auth?: any;
}

interface Props
    extends AppObjectProps,
    AppFnProps { }

interface State {
    selectedLog: Log,
    showPopupLog: boolean,
    token: any;
    popupTitle: string,
    isLogSaved: boolean,
    showConfirmPopup: boolean,
}

class LogBookAircraft extends React.Component<Props, State>{

    constructor(props: any) {
        super(props);

        this.state = {
            token: null,
            popupTitle: "",
            selectedLog: {},
            showPopupLog: false,
            isLogSaved: false,
            showConfirmPopup: false
        };
    };

    async componentDidMount() {
        try {
            this.setState({
                token: await this.props.auth.getAccessToken()
            })
            if (!this.state.token) {

                this.props.auth.login('/')
            }
            else {
                this.props.getLogBookList(this.state.token);
            }
        } catch (err) {
            // handle error as needed
        }
    }

    handleAddLog = (log: any) => {
        this.setState({
            popupTitle: "New Log",
            selectedLog: {},
            showPopupLog: true
        });
    }

    handleEditLog = (log: any) => {
        this.setState({
            popupTitle: "Edit Log",
            selectedLog: log,
            showPopupLog: true
        });
    }

    handleDeleteLog = (log: any) => {
        this.setState({
            selectedLog: log,
            showConfirmPopup: true
        });
    }

    handleConfirmDelete = (confirmDelete: boolean) => {
        if (confirmDelete) {
            this.setState({ showConfirmPopup: false });
            this.props.deleteLog(this.state.token, this.state.selectedLog.logBookId);
        }
        else {
            this.setState({
                showConfirmPopup: false,
            });
        }
    }

    handleCloseLogPopup = () => {
        this.setState({
            showPopupLog: false,
        });
    }

    render() {
        let totalFlightTime = 0;
        this.props.logBookList.map((item, index) => (
            totalFlightTime = totalFlightTime + (item.logBookTotalFlightTime != undefined ? item.logBookTotalFlightTime : 0))
        );
        totalFlightTime = Math.round(totalFlightTime * 100) / 100


        let displayList = this.props.logBookList.map((item, index) => (
            <tr key={index}>
                {item.logBookDescription != undefined
                    ?
                    <td>
                        <MyPopover content={item.logBookDescription}></MyPopover>
                        {moment.parseZone(item.logBookDate).format('DD/MM/YYYY')}
                    </td>
                    :
                    <td> {moment.parseZone(item.logBookDate).format('DD/MM/YYYY')}</td>
                }
                <td>{item.logBookAircraftRegistration}</td>
                <td>{item.aircraftModel == undefined ? "" : item.aircraftModel.aircraftModelName}</td>
                <td>{item.airportDeparture == undefined ? "" : item.airportDeparture.airportCode}</td>
                <td>{item.logBookDepartureTime}</td>
                <td>{item.airportArrival == undefined ? "" : item.airportArrival.airportCode}</td>
                <td>{item.logBookArrivalTime}</td>
                <td>{item.logBookTotalFlightTime == undefined ? "" : Math.round(item.logBookTotalFlightTime * 100) / 100}</td>
                <td>
                    {item.logBookIFR === true ? <i className="fas fa-check"></i> : <i></i>}
                </td>
                <td>
                    {item.logBookNight === true ? <i className="fas fa-check"></i> : <i></i>}
                </td>
                <td>
                    {item.logBookPIC === true ? <i className="fas fa-check"></i> : <i></i>}
                </td>
                <td>
                    {item.logBookCoPilot === true ? <i className="fas fa-check"></i> : <i></i>}
                </td>
                <td>
                    {item.logBookDual === true ? <i className="fas fa-check"></i> : <i></i>}
                </td>
                <td><button className="btn" onClick={() => this.handleEditLog(item)}><span style={{ color: "green" }}><i className="fas fa-edit"></i></span></button></td>
                <td><button className="btn" onClick={() => this.handleDeleteLog(item)}><span style={{ color: "red" }}><i className="far fa-trash-alt"></i></span></button></td>
            </tr>
        ));

        return (
            <div>
                <button type="button" className="btn btn-success btn-sm mt-2" onClick={this.handleAddLog}><span><i className="fas fa-edit"></i></span> New Log</button>

                <div style={{ float: "right", height: "32px", padding: "3px" }} className="alert alert-warning mt-2" role="alert"> Total flight time {totalFlightTime}</div>
                {this.props.isLogSaved && <div style={{ float: "right", height: "32px", padding: "3px" }} className="alert alert-success mt-2 mr-2" role="alert"> New log added!</div>}
                {this.props.isLogDeleted && <div style={{ float: "right", height: "32px", padding: "3px" }} className="alert alert-success mt-2 mr-2" role="alert"> Deleted!</div>}

                <table className="table table-sm table-bordered mt-2" >
                    <thead className="thead-light">
                        <tr>
                            <th scope="col">Date</th>
                            <th scope="col">Model</th>
                            <th scope="col">Registration</th>
                            <th scope="col">Departure</th>
                            <th scope="col">Time</th>
                            <th scope="col">Arrival</th>
                            <th scope="col">Time</th>
                            <th scope="col">Total</th>
                            <th scope="col">IFR</th>
                            <th scope="col">Night</th>
                            <th scope="col">PIC</th>
                            <th scope="col">Co-Pilot</th>
                            <th scope="col">Dual</th>
                            <th scope="col"></th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayList}
                    </tbody>
                </table>

                <LogBookPopup show={this.state.showPopupLog} popupTitle={this.state.popupTitle} log={this.state.selectedLog} hide={this.handleCloseLogPopup} token={this.state.token} />
                <ConfirmPopup show={this.state.showConfirmPopup} hide={this.handleConfirmDelete} title="Delete Log" content="Do you really want to delete this log from your logbook ?" />
            </div>)
    }
}

//map the props of this class to the root redux state
const mapStateToProps = (state: any) => {
    return {
        logBookList: state.logBookList,
        isLogSaved: state.isLogSaved,
        isLogDeleted: state.isLogDeleted,
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        getLogBookList: (token: any) => dispatch<any>(actionCreator.default.logbook.getLogList(token)),
        deleteLog: (token: any, logId: any) => dispatch<any>(actionCreator.default.logbook.deleteLog(token, logId)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withAuth(LogBookAircraft));