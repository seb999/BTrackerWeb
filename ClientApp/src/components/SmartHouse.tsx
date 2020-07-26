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
import Toggle from 'react-toggle';
import './css/Tracker.css';
import { Switchs } from '../class/Switch';
import { SmartHouseUser } from '../class/SmartHouseUser';

interface AppFnProps {
    getSwitchList(): void;
    updateSwitch(p: Switchs): void;
    getDoorSwitch() : Switchs;
    openDoor(p:SmartHouseUser):void;
}

interface AppObjectProps {
    switchList: Array<Switchs>;
    doorSwitch: Switchs;
    isSwitchUpdated: boolean;
}

interface Props
    extends AppObjectProps,
    AppFnProps { }

interface State {
    showWrongCodeAlert: boolean;
    icon1: boolean;
    icon2: boolean;
    icon3: boolean;
    icon4: boolean
}

class SmartHouse extends React.Component<Props, State>{
    public socket: any;
    private counter: number = 0;
    private mykey: any = "";

    constructor(props: any) {
        super(props);

        this.state = {
            showWrongCodeAlert: false,
            icon1: false,
            icon2: false,
            icon3: false,
            icon4: false
        };
    };

    async componentDidMount() {
        await this.props.getSwitchList();
        await this.props.getDoorSwitch();

    }

    handleSetAlarm = (theSwitch: any) => {
        theSwitch.smartHouseIsActivate = !theSwitch.smartHouseIsActivate;
        this.props.updateSwitch(theSwitch);
    }

    handleCloseDoor = () =>{
        this.props.doorSwitch.smartHouseIsClosed = true;
        this.props.updateSwitch(this.props.doorSwitch);
    }

    handleOpenDoor = (theSwitch: any) => {
        if (this.counter == 0) {
            this.mykey = "";
        }

        this.counter++;
        this.mykey = this.mykey + theSwitch;

        if (this.counter == 1) {
            this.setState({ icon1: true });
        }

        if (this.counter == 2) {
            this.setState({ icon2: true });
        }

        if (this.counter == 3) {
            this.setState({ icon3: true });
        }

        if (this.counter == 4) {
            this.setState({ icon4: true });
            let user = new SmartHouseUser();
            user.smartHouseUserCode =  this.mykey;
            this.props.openDoor(user);

            setTimeout(() => {
                this.setState({ showWrongCodeAlert: true });
            }, 500);
            setTimeout(() => {
                this.setState({ icon1: false, icon2: false, icon3: false, icon4: false, showWrongCodeAlert: false });
                this.counter = 0;
            }, 1500);
        }
    }

    render() {
        let displayList = this.props.switchList.map((item, index) => (
            <tr key={index}>
                <td>{item.smartHouseId}</td>
                <td>{item.smartHouseName}</td>
                <td>{item.smartHouseDescription}</td>
                <td>
                    <Toggle style={{ height: 10 }}
                        id='cheese-status'
                        defaultChecked={item.smartHouseIsClosed}
                        onChange={() => this.handleSetAlarm(item)}
                    />
                </td>
            </tr>
        )
        );

        return (


            <div>
                <div>
                    <br ></br>
                    <div >
                        {/* {this.props.isSwitchUpdated && <div style={{ float: "right", height: "32px", padding: "3px" }} className="alert alert-success" role="alert"> Switch updated and ready to be used!</div>} */}
                        {this.props.doorSwitch.smartHouseIsClosed && <div style={{ float: "left", height: "32px", padding: "3px" }} className="alert alert-danger" role="alert"><i className="fa fa-lock"></i> Door locked!</div>}
                        {!this.props.doorSwitch.smartHouseIsClosed && <div style={{ float: "left", height: "32px", padding: "3px" }} className="alert alert-success" role="alert"><i className="fa fa-unlock"></i> Door opened!</div>}
                    </div>
                    <br /><br />

                    {this.state.icon1 ? <i className="fa fa-star" style={{ color: '#CC6600' }} ></i> : null}
                    {this.state.icon2 ? <i className="fa fa-star" style={{ color: '#CC6600' }} ></i> : null}
                    {this.state.icon3 ? <i className="fa fa-star" style={{ color: '#CC6600' }} ></i> : null}
                    {this.state.icon4 ? <i className="fa fa-star" style={{ color: '#CC6600' }} ></i> : null}
                    {this.state.showWrongCodeAlert && this.props.doorSwitch.smartHouseIsClosed && <div style={{ float: "left", height: "32px", padding: "3px" }} className="alert alert-danger" role="alert"> Wrong code!</div>}

                    <br /><br />
                    <div className="row" >
                        <div className="btn-group" role="group" aria-label="Basic example">
                            <button type="button" className="btn btn-lg btn-outline-primary rounded-0" onClick={() => this.handleOpenDoor(1)}>1</button>
                            <button type="button" className="btn btn-lg btn-outline-primary rounded-0" onClick={() => this.handleOpenDoor(2)}>2</button>
                            <button type="button" className="btn btn-lg btn-outline-primary rounded-0" onClick={() => this.handleOpenDoor(3)}>3</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="btn-group" role="group" aria-label="Basic example">
                            <button type="button" className="btn btn-lg btn-outline-primary rounded-0" onClick={() => this.handleOpenDoor(4)}>4</button>
                            <button type="button" className="btn btn-lg btn-outline-primary rounded-0" onClick={() => this.handleOpenDoor(5)}>5</button>
                            <button type="button" className="btn btn-lg btn-outline-primary rounded-0" onClick={() => this.handleOpenDoor(6)}>6</button>
                        </div>
                    </div>
                    <div className="row" >
                        <div className="btn-group" role="group" aria-label="Basic example">
                            <button type="button" className="btn btn-lg btn-outline-primary rounded-0" onClick={() => this.handleOpenDoor(7)}>7</button>
                            <button type="button" className="btn btn-lg btn-outline-primary rounded-0" onClick={() => this.handleOpenDoor(8)}>8</button>
                            <button type="button" className="btn btn-lg btn-outline-primary rounded-0" onClick={() => this.handleOpenDoor(9)}>9</button>
                        </div>
                    </div>

                    <div className="row" style={{marginTop: 10 }}> <button type="button" className="btn btn-warning rounded-0" onClick={() => this.handleCloseDoor()}>Lock door</button>
                    </div>

                    <br /><br />
                    <table className="table table-sm table-bordered" >
                        <thead className="thead-light">
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Name</th>
                                <th scope="col">Description</th>
                                <th scope="col">Activate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayList}
                        </tbody>
                    </table>
                </div>

            </div>)
    }
}

//map the props of this class to the root redux state
const mapStateToProps = (state: any) => {
    return {
        switchList: state.switchList,
        isSwitchUpdated: state.isSwitchUpdated,
        doorSwitch: state.doorSwitch,
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        getSwitchList: () => dispatch<any>(actionCreator.default.smartHouse.getSwitchList()),
        updateSwitch: (theSwitch: any) => dispatch<any>(actionCreator.default.smartHouse.updateSwitch(theSwitch)),
        getDoorSwitch: () => dispatch<any>(actionCreator.default.smartHouse.getDoorSwitch()),
        openDoor: (user:any) => dispatch<any>(actionCreator.default.smartHouse.openDoor(user)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withAuth(SmartHouse));