import * as React from 'react';
import { Modal, Button } from "react-bootstrap";
import { connect } from 'react-redux';
import * as actionCreator from '../../actions/actions';
import { Dispatch } from 'redux';
import {Device} from '../../class/Device'

interface State { 
    deviceEui  : string;
    deviceDescription : string;
}

interface Props {
    token : any,
    show: boolean,
    hide() : void,
    saveTracker(token : any, p : Device) : void;
}

class TrackerPopup extends React.Component<Props, State>{
    // constructor(props: any) {
    //     super(props)
    // }

    handleChange = (e:any) => {
        this.setState({
            [e.target.id] : e.target.value
        } as any)
    }

    handleSaveDevice = (e:any) =>{
        e.preventDefault(); 
        var newDevice : Device = ({deviceId : 0, deviceEUI : this.state.deviceEui, deviceDescription : this.state.deviceDescription});
        console.log(newDevice);
        this.props.saveTracker(this.props.token, newDevice);
        this.props.hide();
    }

    render() {
        return (
            <div>  
                 <Modal show={this.props.show} onHide={this.props.hide}>
                            <Modal.Header closeButton>
                                <Modal.Title>Add new device</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form id="newTrackerForm" className="form-signin" onSubmit={this.handleSaveDevice}>

                                    <div className="form-label-group">
                                        <label>EUI</label>
                                        <input id="deviceEui" type="text" className="form-control" placeholder="EUI code" required onChange={this.handleChange}></input>
                                    </div>

                                    <div className="form-label-group">
                                        <label>Add a description for your tracker</label>
                                        <input id="deviceDescription" type="text" className="form-control" placeholder="Description" required onChange={this.handleChange}></input>
                                    </div>

                                    {/* <div className="form-label-group">
                                        <label>User ID</label>
                                        <input id="userPassword" type="text" className="form-control" placeholder="userId" disabled value={this.props.user}></input>
                                    </div> */}

                                </form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={this.props.hide}>
                                    Close
                                </Button>
                                <Button variant="primary" type="submit" form="newTrackerForm" >
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
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        //we add this function to our props
        saveTracker: (token: any, device:any) => dispatch<any>(actionCreator.default.tracker.saveNewTracker(token, device))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TrackerPopup);