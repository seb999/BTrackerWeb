import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as actionCreator from '../actions/actions';
import { withAuth } from '@okta/okta-react';
import './css/Tracker.css';
import { MyLookup } from '../class/Enums';
import Select from 'react-select';
import { Terminal } from '../class/Cr_terminal';
import { Transfer } from '../class/Cr_transfer';
import { Asset } from '../class/Cr_asset';
import { Transaction } from '../class/Cr_transaction';
import Toggle from 'react-toggle';
import moment from 'moment';
import ReactTooltip from 'react-tooltip';

interface AppFnProps {
    getTerminalList(token: any): void;
    getAssetList(token: any): void;
    getTransactionList(token: any): void;
    getTransferList(token: any): void;
    saveTransferAmount(token: any, p: Transfer): void;
    getLookupList(): any;

}

interface AppObjectProps {
    terminalList: Array<Terminal>;
    assetList: Array<Asset>;
    transactionList: Array<Transaction>;
    transferList: Array<Transfer>;
    auth?: any;
    symbolList: any;
    currencyList: any;
}

interface Props
    extends AppObjectProps,
    AppFnProps {
}

interface State {

    token: any;
    currencySelected: any;
    symbolSelected: any;
    amount: any;

}

class CryptoTransfer extends React.Component<Props, State>{
    private mykey: any = "";
    constructor(props: any) {
        super(props);

        this.state = {

            token: null,
            currencySelected: { value: 1, label: 'EURO' },
            symbolSelected: 0,
            amount: 0,
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
            else {
                this.props.getTerminalList(this.state.token);
                this.props.getAssetList(this.state.token);
                this.props.getTransactionList(this.state.token);
                this.props.getTransferList(this.state.token);
                this.props.getLookupList();
            }
        } catch (err) {
            // handle error as needed
        }

    }

    componentDidUpdate(prevProps: any) {
        if (this.props !== prevProps) {
            //this.props.getTransferList(this.state.token);
        }
      }

    symbolChange = (symbolSelected: any) => {
        this.setState({ symbolSelected });
    };

    currencyChange = (currencySelected: any) => {
        this.setState({ currencySelected });
        console.log(currencySelected);
    };

    setAmount = (theSwitch: any) => {
        if (theSwitch == 123) theSwitch = '.';
        this.mykey = this.mykey + theSwitch;
        this.setState({
            amount: this.mykey
        })
    }

    requestPayment = (e: any) => {
        e.preventDefault();
        var newTransfert: Transfer = ({
            terminalId: 1,
            transferAmount: this.state.amount,
            transferSymbol: this.state.currencySelected.label,
        });
        this.props.saveTransferAmount(this.state.token, newTransfert);
        this.mykey = "";
        this.props.getTransferList(this.state.token);
        this.setState({
            amount: this.mykey
        })
       
    }

    cancel = () => {
        this.mykey = "";
        this.setState({
            amount: this.mykey
        })
    }

    render() {
        let terminalList = this.props.terminalList.map((item, index) => (
            <tr key={index}>
                <td>{item.terminalDescription}</td>
                <td><img src={`/CoinIcon/${item.terminalWalletSymbol}.png`} width="40px" height="40px" data-tip={item.terminalWalletGuid} />
                    <ReactTooltip place="right" type="dark" effect="solid" />  </td>
                <td>{item.terminalWalletSymbol}</td>
                <td><button className="btn" onClick={() => ''}><span style={{ color: "green" }}><i className="fas fa-edit"></i></span></button></td>
                <td><button className="btn" onClick={() => ''}><span style={{ color: "red" }}><i className="far fa-trash-alt"></i></span></button></td>
                <td>
                    {/* <Toggle style={{ height: 10 }}
                        id='cheese-status'
                        defaultChecked={true}
                        onChange={() => ''}
                    /> */}
                </td>
            </tr>
        ));

        let assetList = this.props.assetList.map((item, index) => (
            <tr key={index}>
                <td>{item.asset}</td>
                <td>{item.free}</td>
                <td>{item.btcValuation}</td>
            </tr>
        ));

        let transactionList = this.props.transactionList.map((item, index) => (
            <tr key={index}>
                <td>Terminal {item.asset}</td>
                <td>{item.amount}</td>
                <td>{item.trandId}</td>
            </tr>
        ));

        let transferList = this.props.transferList.map((item, index) => (
            <tr key={index}>
                <td>Terminal {item.terminalId}</td>
                <td>{item.transferAmount}</td>
                <td>{item.transferSymbol}</td>
                <td><button className="btn" onClick={() => ''}><span style={{ color: "green" }}><i className="fas fa-edit"></i></span></button></td>
                <td><button className="btn" onClick={() => ''}><span style={{ color: "red" }}><i className="far fa-trash-alt"></i></span></button></td>
            </tr>
        ));

        return (
            <div className='row' style={{ marginTop: 30 }}>
                <div className='col-sm-6'>

                    <div className="row d-flex justify-content-center" >
                        <div className="btn-group" role="group" aria-label="Basic example">
                            <button type="button" className="btn btn-lg btn-outline-info rounded-0" style={{ height: 100, width: 100 }} onClick={() => this.setAmount(1)}>1</button>
                            <button type="button" className="btn btn-lg btn-outline-info rounded-0" style={{ height: 100, width: 100 }} onClick={() => this.setAmount(2)}>2</button>
                            <button type="button" className="btn btn-lg btn-outline-info rounded-0" style={{ height: 100, width: 100 }} onClick={() => this.setAmount(3)}>3</button>
                        </div>
                    </div>
                    <div className="row d-flex justify-content-center">
                        <div className="btn-group" role="group" aria-label="Basic example">
                            <button type="button" className="btn btn-lg btn-outline-info rounded-0" style={{ height: 100, width: 100 }} onClick={() => this.setAmount(4)}>4</button>
                            <button type="button" className="btn btn-lg btn-outline-info rounded-0" style={{ height: 100, width: 100 }} onClick={() => this.setAmount(5)}>5</button>
                            <button type="button" className="btn btn-lg btn-outline-info rounded-0" style={{ height: 100, width: 100 }} onClick={() => this.setAmount(6)}>6</button>
                        </div>
                    </div>
                    <div className="row d-flex justify-content-center" >
                        <div className="btn-group" role="group" aria-label="Basic example">
                            <button type="button" className="btn btn-lg btn-outline-info rounded-0" style={{ height: 100, width: 100 }} onClick={() => this.setAmount(7)}>7</button>
                            <button type="button" className="btn btn-lg btn-outline-info rounded-0" style={{ height: 100, width: 100 }} onClick={() => this.setAmount(8)}>8</button>
                            <button type="button" className="btn btn-lg btn-outline-info rounded-0" style={{ height: 100, width: 100 }} onClick={() => this.setAmount(9)}>9</button>
                        </div>
                    </div>
                    <div className="row d-flex justify-content-center" >
                        <div className="btn-group" role="group" aria-label="Basic example">
                            <button type="button" className="btn btn-lg btn-outline-info rounded-0" style={{ height: 100, width: 100 }} onClick={() => this.setAmount(7)}>X</button>
                            <button type="button" className="btn btn-lg btn-outline-info rounded-0" style={{ height: 100, width: 100 }} onClick={() => this.setAmount(0)}>0</button>
                            <button type="button" className="btn btn-lg btn-outline-info rounded-0" style={{ height: 100, width: 100 }} onClick={() => this.setAmount(123)}>.</button>
                        </div>
                    </div>

                    <form id="newUserForm" onSubmit={this.requestPayment}>
                        <div className='row justify-content-center' style={{ marginTop: 30 }}>
                            <div className='col-sm-3' style={{ padding: 0 }}>
                                <input id="amount" value={this.state.amount || ''} type="text" className="form-control" placeholder="" required></input>
                            </div>
                            <div className='col-sm-2' style={{ padding: 0 }}>
                                <Select id="currency" options={this.props.currencyList} value={this.state.currencySelected} onChange={this.currencyChange} />
                            </div>
                        </div>
                        <div className='row justify-content-center' style={{ marginTop: 30 }}>
                            <button type="submit" className="btn btn-warning rounded-0 mr-2" form="newUserForm">Request Payment</button>
                            <button type="button" className="btn btn-danger rounded-0" onClick={() => this.cancel()}>Cancel</button>
                        </div>
                    </form>

                </div>
                <div className='col-sm-6'>
                    <h1>Terminal</h1>
                    <table className="table table-sm" >
                        <tbody>
                            {terminalList}
                        </tbody>
                    </table>
                    <br />
                    <h1>Balance</h1>
                    <table className="table table-sm" >
                        <tbody>
                            {assetList}
                        </tbody>
                    </table>
                    <br />
                    <h1>Transaction history</h1>
                    <table className="table table-sm" >
                        <tbody>
                            {transactionList}
                        </tbody>
                    </table>
                    <br />
                    <h1>Payment</h1>
                    <table className="table table-sm" >
                        <tbody>
                            {transferList}
                        </tbody>
                    </table>
                    <hr></hr>
                </div>
            </div>)
    }
}

//map the props of this class to the root redux state
const mapStateToProps = (state: any) => {
    return {

        currencyList: state.lookupList[MyLookup.CurrencyList],
        symbolList: state.lookupList[MyLookup.SymbolList],
        terminalList: state.terminalList,
        assetList : state.assetList,
        transactionList: state.transactionList,
        transferList: state.transferList,
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        getTerminalList: (token: any) => dispatch<any>(actionCreator.default.crypto.terminalList(token)),
        getAssetList: (token: any) => dispatch<any>(actionCreator.default.crypto.binanceBalance(token)),
        getTransactionList: (token: any) => dispatch<any>(actionCreator.default.crypto.binanceTransactionHistory(token)),
        getTransferList: (token: any) => dispatch<any>(actionCreator.default.crypto.transferList(token)),
        getLookupList: () => dispatch<any>(actionCreator.default.lookup.getLookupList()),
        saveTransferAmount: (token: any, requestTrans: any) => dispatch<any>(actionCreator.default.crypto.SaveTransferAmount(token, requestTrans)),
        //getTransferAmount: (token: any, requestTrans: any) => dispatch<any>(actionCreator.default.crypto.SaveTransferAmount(token, requestTrans)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withAuth(CryptoTransfer));