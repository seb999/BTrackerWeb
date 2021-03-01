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
import LogBookAircraft from './LogBookAircraft';

interface AppFnProps {}

interface AppObjectProps {
    auth?: any;
}

interface Props
    extends AppObjectProps,
    AppFnProps { }

interface State {
     token: any;
}

class LogBook extends React.Component<Props, State>{
    constructor(props: any) {
        super(props);

        this.state = {
             token: null,
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
        } catch (err) {
            // handle error as needed
        }
    }

    render() {
        return (
            <div>
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
                        <LogBookAircraft />
                    </div>
                    <div className="tab-pane fade" id="glider" role="tabpanel" aria-labelledby="glider-tab">
                        {/* <LogBookAircraft />   */}
                    </div>
                </div>
            </div>)
    }
}

//map the props of this class to the root redux state
const mapStateToProps = (state: any) => {
    return {
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withAuth(LogBook));