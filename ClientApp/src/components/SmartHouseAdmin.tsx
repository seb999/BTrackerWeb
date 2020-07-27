import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as actionCreator from '../actions/actions';
import UserPopup from "./popup/SmartHouseUserPopup";
import { withAuth } from '@okta/okta-react';
import { Device } from '../class/Device';
import * as moment from 'moment';  //Format date
import appsettings from '../appsettings';
import Toggle from 'react-toggle';
import { SmartHouseUser } from '../class/SmartHouseUser';

interface AppFnProps {
    getUserList(token: any): void;
    updateUser(user: any, token: any): void; 
}

interface AppObjectProps {
    auth?: any;
    userList: Array<SmartHouseUser>;
}

interface Props
    extends AppObjectProps,
    AppFnProps { }

interface State {
    selectedUser: SmartHouseUser,
    showPopupUser: boolean,
    token: any,
    popupTitle: string,
    isTrackerNotSaved: boolean;
    errorMessage: string;
    isUserSaved: boolean;
    isUserUpdated: boolean;
    tokenUser: any,
}

class SmartHouseAdmin extends React.Component<Props, State>{
    public socket: any;

    constructor(props: any) {
        super(props);

        this.state = {
            showPopupUser: false,
            token: null,
            tokenUser: null,
            popupTitle: "",
            selectedUser: {},
            isTrackerNotSaved: false,
            errorMessage: "",
            isUserSaved: false,
            isUserUpdated : false,
        };
    };

    async componentDidMount() {
        try {
            this.setState({
                token: await this.props.auth.getAccessToken(),
                tokenUser: await this.props.auth.getUser()
            })
            if (!this.state.token) {

                this.props.auth.login('/')
            }
            if (this.state.tokenUser.preferred_username == "sebastien.dubos@gmail.com" && this.state.token) {
                this.props.getUserList(this.state.token);
            }
        } catch (err) {
            // handle error as needed
        }
    }

    handleAddUser = () => {
        this.setState({
            popupTitle: "Add New User",
            selectedUser: { smartHouseUserName: '', smartHouseUserEmail: '', smartHouseUserId: 0,smartHouseUserCode:'', smartHouseUserIsDesactivated: false },
            showPopupUser: true
        });
    }

    handleEditUser = (tracker: any) => {
        this.setState({
            popupTitle: "Edit Tracker",
            selectedUser: tracker,
            showPopupUser: true
        });
    }

    handleDesactivateUser = (user: SmartHouseUser) => {
        user.smartHouseUserIsDesactivated = !user.smartHouseUserIsDesactivated;
        this.props.updateUser(user, this.state.token);
        this.setState({ isUserUpdated: true,});

        setTimeout(() => {
            this.setState({
                isUserUpdated: false,
            });
        }, 3000);
    }

    handleClose = (data: string) => {
        this.setState({
            showPopupUser: false,
        });

        setTimeout(() => {
            this.setState({
                errorMessage: "",
                isTrackerNotSaved: false,
            });
        }, 5000);
    }

    render() {
        let displayList = this.props.userList.map((item, index) => (
            <tr key={index}>
                <td>{item.smartHouseUserName}</td>
                <td>{item.smartHouseUserEmail}</td>
                <td>{item.smartHouseUserPhone}</td>
                <td>{item.smartHouseUserCode}</td>
                <td>{moment.parseZone(item.smartHouseUserArrival).format('DD/MM/YYYY HH:mm')}</td>
                <td>{moment.parseZone(item.smartHouseUserLeave).format('DD/MM/YYYY HH:mm')}</td>
                <td>{item.smartHouseUserAmout}</td>
                <td><button className="btn" onClick={() => this.handleEditUser(item)}><span style={{ color: "green" }}><i className="fas fa-edit"></i></span></button></td>
                <td>
                    <Toggle style={{height:10}}
                        id='cheese-status'
                       defaultChecked={!item.smartHouseUserIsDesactivated}
                       onChange={()=>this.handleDesactivateUser(item)}
                    />
                </td>

            </tr>
        ));

        return (

            <div>
                {!this.state.token ? <div></div> :
                    <div>
                        <br ></br>
                        <div >
                            <button style={{ float: "left" }} type="button" className="btn btn-success btn-sm" onClick={this.handleAddUser}><span><i className="fas fa-edit"></i></span> Add new User</button>
                            {this.state.isUserSaved && <div style={{ float: "right", height: "32px", padding: "3px" }} className="alert alert-success" role="alert"> New used added!</div>}
                            {this.state.isUserUpdated && <div style={{ float: "right", height: "32px", padding: "3px" }} className="alert alert-success" role="alert"> User updated!</div>}
                            {/* {this.state.isUserNotSaved && <div style={{ float: "right", height: "32px", padding: "3px" }} className="alert alert-danger alert-sm" role="alert"> {this.state.errorMessage}</div>} */}
                        </div>

                        <br /><br />
                        <table className="table table-sm table-bordered" >
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Phone</th>
                                    <th scope="col">Code</th>
                                    <th scope="col">Arrival date</th>
                                    <th scope="col">Leave date</th>
                                    <th scope="col">Amount</th>
                                    <th scope="col">Edit</th>
                                    <th scope="col">Activated</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayList}
                            </tbody>
                        </table>

                        <UserPopup show={this.state.showPopupUser} popupTitle={this.state.popupTitle} user={this.state.selectedUser} hide={this.handleClose} token={this.state.token} />

                    </div>}

            </div>)
    }
}

//map the props of this class to the root redux state
const mapStateToProps = (state: any) => {
    return {
        userList: state.userList,
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        getUserList: (token: any) => dispatch<any>(actionCreator.default.smartHouse.getUserList(token)),
        updateUser: (user: any, token: any) => dispatch<any>(actionCreator.default.smartHouse.updateUser(user, token)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withAuth(SmartHouseAdmin));