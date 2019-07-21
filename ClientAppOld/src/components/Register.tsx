import * as React from 'react';
import { Dispatch } from 'redux'
import * as actionCreator from '../actions/actions'
import { connect } from 'react-redux'

interface Props {
    registerUser(event: any): void;
    history?: any;
    userId: ""
}

interface State {
    userLogin: string,
    password: string,
    confirmPassword: string,
    isCorrectPassword: boolean,
    errorMessage: string
}

class Register extends React.Component<Props, State>{

    constructor(props: any) {
        super(props)
        this.state = {
            userLogin: "",
            password: "",
            confirmPassword: "",
            isCorrectPassword: true,
            errorMessage: ""
        };
    }

    handleChange = (e: any) => {
        this.setState({
            [e.target.id]: e.target.value
        } as any)
    }

    handleSubmit = (e: any) => {
        e.preventDefault();

        if (this.state.password.length < 8) {
            this.setState({
                isCorrectPassword: false,
                errorMessage: "Password should be at least 8 caracters!"
            })
        }

        if(this.state.password != this.state.confirmPassword){
            this.setState({ 
                isCorrectPassword : false,
                errorMessage : "Confirm password is not corrsponding to password!"})
        }

        if(this.state.password == this.state.confirmPassword && this.state.password.length >= 8)
        {
            this.setState({
                isCorrectPassword: true
            })

            this.props.registerUser(this.state);   
        }
    }

    render() {
        { this.props.userId !== "" ? this.props.history.push("/home") : "" }

        return (
            <div>
                <div className="row">
                    {this.props.userId}
                    <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                        <div className="card card-signin my-5">
                            <div className="card-body">
                                <h5 className="card-title text-center">Register new user</h5>
                                <form className="form-signin" onSubmit={this.handleSubmit}>

                                    <div className="form-label-group">
                                        <input id="userLogin" type="email" className="form-control" placeholder="Email address" required onChange={this.handleChange}></input>
                                        <label>Email address</label>
                                    </div>

                                    <div className="form-label-group">
                                        <input id="password" type="password" className="form-control" placeholder="Password" required onChange={this.handleChange}></input>
                                        <label>Password</label>
                                    </div>

                                    <div className="form-label-group">
                                        <input id="confirmPassword" type="password" className="form-control" placeholder="Password" required onChange={this.handleChange}></input>
                                        <label>Confirm password</label>
                                    </div>

                                    <button className="btn btn-lg btn-primary btn-block text-uppercase" type="submit">Register</button>

                                </form>
                                {(!this.state.isCorrectPassword && this.props.userId == "") && <span className="badge badge-danger">{this.state.errorMessage}</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        registerUser: (user: any) => dispatch<any>(actionCreator.default.account.registerUserAsyn(user)).then((p: any) => { })

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

export default connect(mapStateToProps, mapDispatchToProps)(Register);