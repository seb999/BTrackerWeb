import * as React from 'react';
import { Modal, Button } from "react-bootstrap";
import { connect } from 'react-redux';
import * as actionCreator from '../../actions/actions';
import { Dispatch } from 'redux';
import { Device } from '../../class/Device';
import socketIOClient from "socket.io-client";
import appsettings from '../../appsettings'
import { SmartHouseUser } from '../../class/SmartHouseUser';

interface State {
    userId: any;
    userName: any;
    userArrival: any;
    userCode: any;
    userEmail: any;
    userIsDesactivated:any;
    userLeave: any;
}

interface Props {
    popupTitle: string,
    user: SmartHouseUser,
    token: any,
    show: boolean,
    isDoorCodeValid: true,
    hide(error: string): void,
    saveTracker(token: any, p: Device): void;
    updateTracker(token: any, p: Device): void;
    checkCode(token: any, code: any) : void;
}

class SmartHouseUserPopup extends React.Component<Props, State>{
    private socket: any;

    constructor(props: any) {
        super(props)
        this.state = {
            userId: 0,
            userName: '',
            userArrival: '',
            userCode: '',
            userEmail: '',
            userIsDesactivated: '',
            userLeave:''

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
        console.log(e.target.value.length);
        this.setState({
            [e.target.id]: e.target.value
        } as any);

        if(e.target.id == 'userCode' && e.target.value.length == 4) {
            let newUser : SmartHouseUser;
            newUser = {smartHouseUserCode : e.target.value};
            this.props.checkCode(this.props.token, newUser);
         
    }
}

    handleSaveUser = (e: any) => {
        //  //Add new device to local db
        //  var myDevice: Device = ({
        //     deviceId: this.state.deviceId,
        //     deviceEUI: this.state.deviceEui,
        //     deviceDescription: this.state.deviceDescription,
        //     ttnDevID: ttnDevID,
        //     deviceTel : this.state.deviceTel,
        //     deviceIsAlarmOn : false,
        // });
        // this.props.saveTracker(this.props.token, myDevice);
        // this.props.hide("");
    }

    render() {
        return (
            <div>
                <Modal show={this.props.show} onHide={() => this.props.hide("")}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.props.popupTitle}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form id="newUserForm" className="form-signin" onSubmit={this.handleSaveUser}>

                            <input id="userId" value={this.state.userId} type="text" className="form-control" readOnly hidden></input>

                            <div className="form-label-group">
                                <label>Name</label>
                                <input id="userName" value={this.state.userName} type="text" className="form-control" placeholder="Name" required onChange={this.handleChange}></input>
                            </div>

                            <div className="form-label-group">
                                <label>Email</label>
                                <input id="userEmail" value={this.state.userEmail} type="text" className="form-control" placeholder="Email" required onChange={this.handleChange}></input>
                            </div>

                            <div className="form-label-group">
                                <label>Door code</label>  {!this.props.isDoorCodeValid && <div style={{ float: "right", height: "32px", padding: "3px" }} className="alert alert-danger" role="alert"> Code already used!</div>}
                                <input id="userCode" value={this.state.userCode} type="text" className="form-control" placeholder="Door code" required onChange={this.handleChange}></input>
                            </div>

                            <div className="form-label-group">
                                <label>Arrival date</label>
                                <input id="userArrival" value={this.state.userArrival} type="datetime-local" className="form-control" placeholder="Date" required onChange={this.handleChange}></input>
                            </div>

                            <div className="form-label-group">
                                <label>Departure date</label>
                                <input id="userLeave" value={this.state.userLeave} type="datetime-local" className="form-control" placeholder="Date" required onChange={this.handleChange}></input>
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.props.hide("")}>
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
        saveTracker: (token: any, device: any) => dispatch<any>(actionCreator.default.tracker.saveTracker(token, device)),
        updateTracker: (token: any, device: any) => dispatch<any>(actionCreator.default.tracker.updateTracker(token, device)),
        checkCode: (token: any, user: any) => dispatch<any>(actionCreator.default.smartHouse.checkCode(token, user)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SmartHouseUserPopup);