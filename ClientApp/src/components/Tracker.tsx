import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actionCreator from '../actions/actions';
import TrackerPopup from "./popup/TrackerPopup";
import ConfirmPopup from "./popup/ConfirmPopup";
import { withAuth } from '@okta/okta-react';
import { Device } from '../class/Device';


interface AppFnProps {
    getTrackerList(token : any): void;
    deleteTracker(token : any, p :number) : void;
  }
  
interface AppObjectProps {
    auth? : any;
    history?: any;
    deviceList: Array<Device>;
    isSaved: boolean;
    isDeleted: boolean;
  }
  
interface Props
    extends AppObjectProps,
    AppFnProps { }

interface State {
    showAddTracker: boolean,
    showConfirmPopup: boolean,
    deviceId : number,
    token : any
}

class Tracker extends React.Component<Props, State>{
    constructor(props: any) {
        super(props);

        this.state = {
            showAddTracker: false,
            showConfirmPopup: false,
            deviceId : 0,
            token : null,
        };
    };

    async componentDidMount() {
        try {
             this.setState({
                token : await this.props.auth.getAccessToken()
             }) 
            !this.state.token ? this.props.auth.login('/') : this.props.getTrackerList(this.state.token);
          } catch (err) {
            // handle error as needed
          }
    }

    handleClose = () =>{
        this.setState({ showAddTracker: false });
    }

    handleShow = () => {
        this.setState({ showAddTracker: true });
    }

    handleDeleteTracker = (deviceId:number) =>{
        this.setState({ 
            deviceId:deviceId,
            showConfirmPopup: true });
    }

    handleConfirmDelete = (deleteTracker:boolean) =>{
        console.log(this.state.deviceId);
        if(deleteTracker) this.props.deleteTracker(this.state.token, this.state.deviceId)
        this.setState({ showConfirmPopup: false });
    }

    render() {
        let displayList = this.props.deviceList.map((item, index) => (
            <tr key={index}>
                <td>{item.deviceId}</td>
                <td>{item.deviceEUI}</td>
                <td>{item.deviceDescription}</td>
                <td>{item.userId}</td>
                <td><button className="btn my-2" onClick={() => this.handleDeleteTracker(item.deviceId)}><span style={{color:"red"}}><i className="far fa-trash-alt"></i></span></button></td>
            </tr>
        ));

        return (
            
            <div>
                 {!this.state.token ? <div></div> : 
                    <div>
                        <br ></br>
                        <div >
                            <button style={{ float: "left" }} type="button" className="btn btn-primary" onClick={this.handleShow}><span><i className="fas fa-edit"></i></span> Add new tracker</button>
                            {this.props.isSaved && <div style={{ float: "right", height:"40px", padding:"7px" }} className="alert alert-success" role="alert"> Saved!</div>}
                            {this.props.isDeleted && <div style={{ float: "right", height:"40px", padding:"7px" }} className="alert alert-success" role="alert"> Deleted!</div>}
                        </div>
                      
                        <br /><br />
                        <table className="table" >
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Device Id</th>
                                    <th scope="col">EUI</th>
                                    <th scope="col">Usage</th>
                                    <th scope="col">User Id</th>
                                    <th scope="col">delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayList}
                            </tbody>
                        </table>

                        <TrackerPopup show={this.state.showAddTracker} hide={this.handleClose} token={this.state.token} />

                        <ConfirmPopup show={this.state.showConfirmPopup} hide={this.handleConfirmDelete} title="Delete tracker" content="Do you really want to delete this tracker ?"/>
                    </div>}
                
            </div>)
    }
}

//map the props of this class to the root redux state
const mapStateToProps = (state: any) => {
    return {
        deviceList: state.deviceList,
        isSaved: state.isSaved,
        isDeleted: state.isDeleted,
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        getTrackerList: (token : any) => dispatch<any>(actionCreator.default.tracker.trackerList(token)),
        deleteTracker: (token: any, deviceId : number) => dispatch<any>(actionCreator.default.tracker.deleteTracker(token, deviceId)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withAuth(Tracker));