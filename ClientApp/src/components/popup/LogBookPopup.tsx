import * as React from 'react';
import { Modal, Button } from "react-bootstrap";
import { connect } from 'react-redux';
import * as actionCreator from '../../actions/actions';
import { Dispatch } from 'redux';
import { Device } from '../../class/Device';
import socketIOClient from "socket.io-client";
import appsettings from '../../appsettings';
import { Log } from "../../class/Log";


interface State {
    logBookId: any;
    logBookDate: any;
    userArrival: any;
    userCode: any;
    userEmail: any;
    userIsDesactivated: any;
    userLeave: any;
}

interface Props {
    popupTitle: string,
    log: Log,
    token: any,
    show: boolean,
    hide(error: string): void,
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
            userArrival: '',
            userCode: '',
            userEmail: '',
            userIsDesactivated: '',
            userLeave: ''

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

    }

    handleSaveLog = (e: any) => {
        //Add new device to local db
        var myLog: Log = ({
            logBookDate : this.state.logBookDate
            // smartHouseUserArrival: this.state.userArrival,
            // smartHouseUserCode: this.state.userCode,
            // smartHouseUserEmail: this.state.userEmail,
            // smartHouseUserIsDesactivated: false,
            // smartHouseUserLeave: this.state.userLeave,
            // smartHouseUserName: this.state.logBookDate
        });
        this.props.saveLog(this.props.token, myLog);
        this.props.hide("");
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
                        <form id="newUserForm" className="form-signin" onSubmit={this.handleSaveLog}>

                            <input id="userId" value={this.state.logBookId} type="text" className="form-control" readOnly hidden></input>

                            <div className="form-label-group">
                                <label>Date of flight</label>
                                <input id="logBookDate" value={this.state.logBookDate} type="datetime-local" className="form-control" placeholder="Date" required onChange={this.handleChange}></input>
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
        saveLog: (token: any, log: any) => dispatch<any>(actionCreator.default.logbook.addLog(token, log)),
        updateLog: (token: any, log: any) => dispatch<any>(actionCreator.default.logbook.updateLog(token, log)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LogBookPopup);