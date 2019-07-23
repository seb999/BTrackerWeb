import * as React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/actions';
import { Dispatch } from 'redux';
import { withAuth } from '@okta/okta-react';

interface AppFnProps {
  getLocalUserId(p:any): void;
}

interface AppObjectProps {
  auth? : any;
}

interface Props
  extends AppObjectProps,
  AppFnProps { }

interface State {
}

class Home extends React.Component<Props, State>{
  constructor(props: any) {
    super(props);
  }

  async componentDidMount() {
    try {
      var token = await this.props.auth.getAccessToken();
      this.props.getLocalUserId(token);
    } catch (err) {
      // handle error as needed
    }
  }

  render() {
    return (
      <div>This is the home page</div>
    );

  }
}

//map the props of this class to the root redux state
const mapStateToProps = (state: any) => {
  return {
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
      //getSymbolList: (p: string) => dispatch<any>(binanceActionCreator.binanceActions.GetSymbolList(p)),
      getLocalUserId: (p : any) => dispatch<any>(actions.default.account.checkUserLocalId(p)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withAuth(Home));
