import * as React from 'react';
import './css/Footer.css';
import loraWanImg from '../images/LoRaWAN.png'
import oktaImg from '../images/okta-cloud.png'
import networkImg from '../images/TheThingNetwork.svg'
import awsImg from '../images/Amazon-EC2-Instance.png'

class Footer extends React.Component {

    render() {
        return (
            <footer className="page-footer footer">
                <div>
                    <div className="float-left"><h4 className="brand">BTracker 3.0</h4></div>
                    <div className="container">
                    <img src={awsImg} className="brand" />
                        <img src={oktaImg} style={{ height: 40 }} />
                        <img src={networkImg} className="brand" />
                        <img src={loraWanImg} className="brand" />
                    </div>
                    <div className="float-right copyright">© Copyright 2019 BTracker. All Rights Reserved</div>
                </div>
                <div ></div>
            </footer>
        )
    }

}

export default Footer