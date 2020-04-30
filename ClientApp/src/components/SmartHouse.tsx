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

interface AppFnProps {
    getSwitchList(): void;
    updateSwitch(p: Device): void;
}

interface AppObjectProps {
    switchList: Array<Switchs>;
    isSwitchUpdated: boolean;
}

interface Props
    extends AppObjectProps,
    AppFnProps { }

interface State {
}

class SmartHouse extends React.Component<Props, State>{
    public socket: any;

    constructor(props: any) {
        super(props);

        this.state = {
        };
    };

    async componentDidMount() {
        await this.props.getSwitchList();
       
    }

    handleSetAlarm = (theSwitch : any) =>{
        theSwitch.smartHouseIsActivate = !theSwitch.smartHouseIsActivate;
        this.props.updateSwitch(theSwitch);
    }

    render() {
        console.log(this.props.switchList);
        let displayList = this.props.switchList.map((item, index) => (
            <tr key={index}>
                <td>{item.smartHouseId}</td>
                <td>{item.smartHouseName}</td>
                <td>{item.smartHouseDescription}</td>
                <td>
                    <Toggle style={{height:10}}
                        id='cheese-status'
                       defaultChecked={item.smartHouseIsActivate}
                       onChange={()=>this.handleSetAlarm(item)}
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
                            {this.props.isSwitchUpdated && <div style={{ float: "right", height: "32px", padding: "3px" }} className="alert alert-success" role="alert"> Switch updated and ready to be used!</div>}
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
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        getSwitchList: () => dispatch<any>(actionCreator.default.smartHouse.getSwitchList()),
        updateSwitch: (theSwitch: any) => dispatch<any>(actionCreator.default.smartHouse.updateSwitch(theSwitch)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withAuth(SmartHouse));