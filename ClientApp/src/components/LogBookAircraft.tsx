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
import { isTemplateExpression } from 'typescript';
import DropDown from './element/DropDown';
import { LookupItem } from './../class/LookupItem';
import { lookup } from 'dns';
import { FlyTime } from '../class/flyTime';

const yearList: LookupItem[] = [];
const currentYear = new Date().getFullYear();
for (let i = currentYear; i > currentYear - 10; i--) {
    let item = { label: (i).toString(), value: i }
    yearList.push(item);
}

interface AppFnProps {
    getLogBookList(token: any, year: number): void;
    getTotalFlyTime(token: any): void;
    deleteLog(token: any, logId: any): void;
}

interface AppObjectProps {
    logBookList: Array<Log>;
    flyTime: FlyTime;
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
    selectedYear: any,
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
            showConfirmPopup: false,
            selectedYear: { label: new Date().getFullYear().toString(), value: new Date().getFullYear() },
        };
    };

    async componentDidMount() {
        console.log(yearList);
        try {
            this.setState({
                token: await this.props.auth.getAccessToken()
            })
            if (!this.state.token) {

                this.props.auth.login('/')
            }
            else {
                this.props.getLogBookList(this.state.token, this.state.selectedYear.value);
                this.props.getTotalFlyTime(this.state.token);
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

    handleChangeYear = (year: any) => {
        this.setState({
            selectedYear: year,
        })
        this.props.getLogBookList(this.state.token, year.value);
    }

    render() {
        let flightTime = 0;
        let soloTime = 0;
        let landing = 0;
        let totalFlightTime = 0;
        let totalSoloTime = 0;
        let totalLanding = 0;

        this.props.logBookList.forEach(item => {
            landing = landing + (item.logBookLanding !== undefined ? item.logBookLanding : 0);
            flightTime = flightTime + (item.logBookTotalFlightTime !== undefined ? item.logBookTotalFlightTime : 0);

            if (!item.logBookDual) {
                soloTime = soloTime + (item.logBookTotalFlightTime !== undefined ? item.logBookTotalFlightTime : 0)
            }
        })
        soloTime = Math.round(soloTime * 100) / 100;
        flightTime = Math.round(flightTime * 100) / 100;


        let displayList = this.props.logBookList.map((item, index) => (
            <tr key={index}>
                {item.logBookDescription !== undefined
                    ?
                    <td>
                        <MyPopover content={item.logBookDescription}></MyPopover>
                        {moment.parseZone(item.logBookDate).format('DD/MM/YYYY')}
                    </td>
                    :
                    <td> {moment.parseZone(item.logBookDate).format('DD/MM/YYYY')}</td>
                }
                <td>{item.logBookAircraftRegistration}</td>
                <td>{item.aircraftModel === undefined ? "" : item.aircraftModel.aircraftModelName}</td>
                <td>{item.airportDeparture === undefined ? "" : item.airportDeparture.airportCode}</td>
                <td>{item.logBookDepartureTime}</td>
                <td>{item.airportArrival === undefined ? "" : item.airportArrival.airportCode}</td>
                <td>{item.logBookArrivalTime}</td>
                <td>{item.logBookTotalFlightTime === undefined ? "" : Math.round(item.logBookTotalFlightTime * 100) / 100}</td>
                {/* <td>
                    {item.logBookIFR === true ? <i className="fas fa-check"></i> : <i></i>}
                </td>*/}
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
                <td>{item.logBookLanding}</td>
                <td><button className="btn" onClick={() => this.handleEditLog(item)}><span style={{ color: "green" }}><i className="fas fa-edit"></i></span></button></td>
                <td><button className="btn" onClick={() => this.handleDeleteLog(item)}><span style={{ color: "red" }}><i className="far fa-trash-alt"></i></span></button></td>
            </tr>
        ));
        //---------------------
        //-------UI-----------
        //--------------------
        return (
            <div>
                <div style={{ float: 'left' }} >
                    <button type="button" className="btn btn-success btn-sm mt-2" onClick={this.handleAddLog}><span><i className="fas fa-edit"></i></span> New Log</button>
                    <div style={{ float: 'left' }} className='mt-1 mr-2'><DropDown lookupList={yearList} onClick={this.handleChangeYear} selectedItem={this.state.selectedYear}></DropDown></div>
                </div>

                <div className="card bg-light mb-2 p-0 mt-1" style={{float: "right", padding: "3px"}} >
                    <div className="card-body p-1">
                        Flight time <b className="card-text mr-3">{flightTime}/{this.props.flyTime.totalFlyTime}</b>
                        Solo <b className="card-text mr-3">{soloTime}/{this.props.flyTime.totalSolo}</b>
                        Landing<b className="card-text mr-3">{landing}/{this.props.flyTime.totalLanding}</b>
                    </div>
                </div>

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
                            {/* <th scope="col">IFR</th> */}
                            <th scope="col">Night</th>
                            <th scope="col">PIC</th>
                            <th scope="col">Co-Pilot</th>
                            <th scope="col">Dual</th>
                            <th scope="col">Landing</th>
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
        flyTime: state.flyTime,
        isLogSaved: state.isLogSaved,
        isLogDeleted: state.isLogDeleted,

    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        getLogBookList: (token: any, year: number) => dispatch<any>(actionCreator.default.logbook.getLogList(token, year)),
        deleteLog: (token: any, logId: any) => dispatch<any>(actionCreator.default.logbook.deleteLog(token, logId)),
        getTotalFlyTime: (token: any) => dispatch<any>(actionCreator.default.logbook.getTotalFlyTime(token)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withAuth(LogBookAircraft));