import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as actionCreator from '../actions/actions';
import { withAuth } from '@okta/okta-react';
import * as moment from 'moment';  //Format date
import './css/Tracker.css';
import { Log } from "../class/Log";
import LogBookPopup from "./popup/LogBookPopup"

interface AppFnProps {
    getLogBookList(token: any): void;
}

interface AppObjectProps {
    logBookList: Array<Log>;
    isLogSaved: boolean;
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
    isLogSaved: boolean
}

class LogBook extends React.Component<Props, State>{

    constructor(props: any) {
        super(props);

        this.state = {
            token: null,
            popupTitle: "",
            selectedLog: {},
            showPopupLog : false,
            isLogSaved : false,
        };
    };

    async componentDidMount() {
        console.log(Date.now());
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
            popupTitle: "Add New Log",
           // selectedLog: {},
           showPopupLog: true
        });
    }

    handleEditLog = (log: any) => {
        // this.setState({
        //     popupTitle: "Edit Tracker",
        //     selectedTracker: tracker,
        //     showPopupTracker: true
        // });
    }

    handleDeleteLog = (log: any) => {
        // this.setState({
        //     selectedTracker: tracker,
        //     showConfirmPopup: true
        // });
    }

    handleCloseLogPopup = () => {
        this.setState({
            showPopupLog: false,
        });
    }


    render() {
        let displayList = this.props.logBookList.map((item, index) => (
            <tr key={index}>
                <td>{moment.parseZone(item.logBookDate).format('DD/MM/YYYY')}</td>
                <td>{item.logBookAircraftRegistration}</td>
                <td>{item.logBookAircraftModel}</td>
                <td>{item.logBookDeparturePlace}</td>
                <td>{item.logBookDepartureTime}</td>
                <td>{item.logBookArrivalPlace}</td>
                <td>{item.logBookArrivalTime}</td>
                <td>{item.logBookTotalFlightTime}</td>
                <td>{item.logBookIFR}</td>
                <td>{item.logBookNight}</td>
                <td>{item.logBookPIC}</td>
                <td>{item.logBookCoPilot}</td>
                <td>{item.logBookDual}</td>
                <td><button className="btn" onClick={() => this.handleEditLog(item)}><span style={{ color: "green" }}><i className="fas fa-edit"></i></span></button></td>
                <td><button className="btn" onClick={() => this.handleDeleteLog(item)}><span style={{ color: "red" }}><i className="far fa-trash-alt"></i></span></button></td>
            </tr>
        ));

        return (
            <div>
                <div className="mt-3">
                    {this.props.isLogSaved && <div style={{ float: "right", height: "32px", padding: "3px" }} className="alert alert-success" role="alert"> New log added!</div>}
                    {/* {this.state.isUserUpdated && <div style={{ float: "right", height: "32px", padding: "3px" }} className="alert alert-success" role="alert"> User updated!</div>} */}
                </div>

                <ul className="nav nav-tabs mt-3" id="myTab" role="tablist">
                    <li className="nav-item waves-effect waves-light">
                        <a className="nav-link active" id="engine-tab" data-toggle="tab" href="#engine" role="tab" aria-controls="Engine plane" aria-selected="false">Airplane</a>
                    </li>
                    <li className="nav-item waves-effect waves-light">
                        <a className="nav-link" id="glider-tab" data-toggle="tab" href="#glider" role="tab" aria-controls="Glider" aria-selected="false">Glider</a>
                    </li>
                </ul>
                <div className="tab-content" id="myTabContent">
                    <div className="tab-pane fade active show" id="engine" role="tabpanel" aria-labelledby="engine-tab">

                    <button type="button" className="btn btn-success btn-sm mt-2" onClick={this.handleAddLog}><span><i className="fas fa-edit"></i></span> Add new Log</button>

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

                    </div>
                    <div className="tab-pane fade" id="glider" role="tabpanel" aria-labelledby="glider-tab">Food truck fixie
                    locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog
                    sartorial PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee. Qui photo
                    booth letterpress, commodo enim craft beer mlkshk aliquip jean shorts ullamco ad vinyl cillum PBR. Homo
                    nostrud organic, assumenda labore aesthetic magna delectus mollit. Keytar helvetica VHS salvia yr, vero
                    magna velit sapiente labore stumptown. Vegan fanny pack odio cillum wes anderson 8-bit, sustainable jean
                    shorts beard ut DIY ethical culpa terry richardson biodiesel. Art party scenester stumptown, tumblr butcher
                  vero sint qui sapiente accusamus tattooed echo park.</div>
                </div>

                <LogBookPopup show={this.state.showPopupLog} popupTitle={this.state.popupTitle} log={this.state.selectedLog} hide={this.handleCloseLogPopup} token={this.state.token} />

            </div>)


    }
}

//map the props of this class to the root redux state
const mapStateToProps = (state: any) => {
    return {
        logBookList: state.logBookList,
        isLogSaved: state.isLogSaved,
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        getLogBookList: (token: any) => dispatch<any>(actionCreator.default.logbook.getLogList(token)),
        // updateSwitch: (theSwitch: any) => dispatch<any>(actionCreator.default.smartHouse.updateSwitch(theSwitch)),
        // getDoorSwitch: () => dispatch<any>(actionCreator.default.smartHouse.getDoorSwitch()),
        // openDoor: (user: any) => dispatch<any>(actionCreator.default.smartHouse.openDoor(user)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withAuth(LogBook));