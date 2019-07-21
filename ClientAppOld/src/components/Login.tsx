import * as React from 'react';
import { Dispatch } from 'redux'
import * as actionCreator from '../actions/actions'
import { connect } from 'react-redux'

interface Props {
    logUser(event: any): void;
    history?: any;
    userId : any;
    isLogged? : boolean;
    isFirstRender  :boolean
 }

interface State {
    userLogin : string,
    userPassword : string,
    rememberMe : boolean,
}

class Login extends React.Component<Props, State>{

    constructor(props: any) {
        super(props)
        this.state = {
             userLogin : "", 
             userPassword: "",
             rememberMe:false};
      }

    handleChange = (e:any) => {
        this.setState({
            [e.target.id] : e.target.value
        } as any)
    }

    handleRememberMe = () => {
        this.setState({
            rememberMe : !this.state.rememberMe
        } as any)
    }
    
    handleSubmit = (e :any) => {
        e.preventDefault();     
        this.props.logUser(this.state); //from redux       
    }

    render(){
        {this.props.userId !== "" ? this.props.history.push("/home") : ""}

        return (
            <div>
                <div className="row">
                {this.props.userId}
                    <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                        <div className="card card-signin my-5">
                            <div className="card-body">
                                <h5 className="card-title text-center">Sign In</h5>
                                <form className="form-signin" onSubmit={this.handleSubmit}>
                                
                                    <div className="form-label-group">
                                        <input id="userLogin" type="email" className="form-control" placeholder="Email address" required onChange={this.handleChange}></input>
                                        <label>Email address</label>
                                    </div>

                                    <div className="form-label-group">
                                        <input id="userPassword" type="password" className="form-control" placeholder="Password" required onChange={this.handleChange}></input>
                                        <label>Password</label>
                                    </div>

                                    <div className="mb-3">
                                        <input type="checkbox" onClick={this.handleRememberMe}></input>
                                        <label>Remember password</label>
                                    </div>
                                    <button className="btn btn-md btn-primary btn-block text-uppercase" type="submit">Sign in</button>

                                    <hr className="my-4" ></hr>

                                 
                                    <button className="btn btn-md btn-google btn-block" style={{color : 'white', backgroundColor: '#ea4335'}} ><i className="fab fa-google mr-2"></i> Sign in with Google</button>
                                    <button className="btn btn-md btn-facebook btn-block" style={{color : 'white', backgroundColor: '#3b5998'}}><i className="fab fa-facebook-f mr-2"></i> Sign in with Facebook</button>


                                </form>
                                {(!this.props.isFirstRender && this.props.userId=="") && <Child />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const Child = () =>(
     <span className="badge badge-danger">Invalide user or password!</span>
)

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
      logUser: (user: any) => dispatch<any>(actionCreator.default.account.logUser(user)).then((p:any)=>{})
    }
  }
  
  //map the props of this class to the root redux state
  const mapStateToProps = (state: any) => {
    return {
      isLogged: state.isLogged,
      userId: state.userId,
      isFirstRender: state.isFirstRender,
    }
  }

  export default connect(mapStateToProps, mapDispatchToProps)(Login);