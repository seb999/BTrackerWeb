import * as React from 'react';
import './../css/NavMenu.css';
import {  NavLink } from 'react-router-dom'

export interface Props {
    isActive : boolean,
    path : string,
    text : string,
}

class MyNavLink extends React.Component<Props> {
    // constructor(props :any){
    //     super(props);
    // }

    render() {

        var navLink = this.props.isActive 
            ? <li className={"nav-item "}><NavLink className="nav-link" to={this.props.path}>{this.props.text}</NavLink></li>  
            : "" 
        

        return (
          navLink
        );
    }
  }

  export default MyNavLink