import React, { useState } from 'react';
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
import SignalRService from './../service/SignalRService';

interface AppFnProps {
    getTerminalList(token: any): void;
    getAssetList(token: any): void;
    getTransactionList(token: any): void;
    getTransferList(token: any): void;
    geSymbolCurrentPrice(symbol: any): void;
    saveTransferAmount(token: any, p: Transfer): void;
    getLookupList(): any;
    getAppMode(token: any): void;
    updateAppMode(token: any): void;
    testExecuteTransaction(token: any, transactionId: any): void;

}

interface AppObjectProps {
    terminalList: Array<Terminal>;
    assetList: Array<Asset>;
    transactionList: Array<Transaction>;
    transferList: Array<Transfer>;
    symbolCurrentPrice: number;
    auth?: any;
    symbolList: any;
    currencyList: any;
    testMode: any;
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
    isTransferExecuted: boolean;

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
            isTransferExecuted : false,
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
                this.props.geSymbolCurrentPrice("ADAEUR");
                this.props.getLookupList();
                this.props.getAppMode(this.state.token);
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

    setAmount = (key: any) => {
        if (key == 123) key = '.';
        this.mykey = this.mykey + key;
        this.setState({
            amount: this.mykey
        })
    }

    requestPayment = (e: any) => {
        this.props.geSymbolCurrentPrice("ADAEUR");
        e.preventDefault();
        var newTransfert: Transfer = ({
            terminalId: this.props.terminalList[0].terminalId,
            transferAmountRequested: this.state.amount,
            transferSymbol: this.state.currencySelected.label,
            transferAmount: this.state.amount / this.props.symbolCurrentPrice,
        });
        this.props.saveTransferAmount(this.state.token, newTransfert);
        this.mykey = "";
        this.props.getTransferList(this.state.token);
        this.setState({
            amount: this.mykey
        })
    }

    testBinanceTransfer = () => {
      
        this.props.transferList.map((item, index) => (
            this.props.testExecuteTransaction(this.state.token, item.transferId)
        ));
    }

    refresh = () => {
        this.setState({ isTransferExecuted: true,});
        setTimeout(() => {
            this.setState({
                isTransferExecuted: false,
            });
            this.props.getAssetList(this.state.token);
            this.props.getTransactionList(this.state.token);
            this.props.getTransferList(this.state.token);
        }, 3000);
    }

    cancel = () => {
        this.mykey = "";
        this.setState({
            amount: this.mykey
        })
    }

    updateAppMode = () => {
        this.props.updateAppMode(this.state.token);
    }

    render() {
        let testMode = this.props.testMode;

        let terminalList = this.props.terminalList.map((item, index) => (
            <tr key={index}>
                <td>{item.terminalDescription}</td>
                <td><img src={`/CoinIcon/${item.terminalWalletSymbol}.png`} width="40px" height="40px" data-tip={item.terminalWalletGuid} />
                    <ReactTooltip place="right" type="dark" effect="solid" />  </td>
                <td>{item.terminalWalletSymbol}</td>
                <td><button className="btn" onClick={() => ''}><span style={{ color: "green" }}><i className="fas fa-edit"></i></span></button></td>
                <td><button className="btn" onClick={() => ''}><span style={{ color: "red" }}><i className="far fa-trash-alt"></i></span></button></td>
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
                <td>{item.asset}</td>
                <td>{item.amount}</td>
                <td>{item.tranId}</td>
            </tr>
        ));

        let transferList = this.props.transferList.map((item, index) => (

            <div key={index} className='row justify-content-center' style={{ marginTop: 30 }}>
                <div className="card text-white bg-warning mb-3"></div>
                <div className="card-body">
                    <h5 className="card-title">Pending payment Terminal {item.terminalId}</h5>
                    <p className="card-text">Amount {item.transferAmountRequested}€ </p>
                    <p className="card-text"> ({item.transferAmount} Ada) </p>
                </div>
            </div>
        ));


        return (
            <div style={{ marginTop: 10 }}>
                <div className='row justify-content-end'>

                    <div className="col-sm-4">
                        {this.state.isTransferExecuted && <div style={{ height: "28px", padding: "1px" }} className="alert alert-danger" role="alert"> Payment executed!</div>}
                    </div>

                    <div className="col-sm-1">
                        <Select id="currency" options={this.props.currencyList} value={this.state.currencySelected} onChange={this.currencyChange} className="input-sm" />
                    </div>

                    <div className="col-sm-1">
                        <Toggle style={{ height: 10 }}
                            id='cheese-status'
                            checked={!testMode}
                            onChange={() => this.updateAppMode()} />
                    </div>
                    <div className="col-sm-1">
                    <button type="button" className="btn btn-secondary rounded-0 mr-2" form="newUserForm" onClick={() => this.testBinanceTransfer()}>Test</button>
                    </div>
                </div>

                <div className='row'>
                    <div className='col-sm-6'>
                        <div className="row d-flex justify-content-center" >
                            <div className="btn-group" role="group" aria-label="Basic example">
                                <button type="button" className="btn btn-lg btn-outline-info rounded-0" style={{ height: 90, width: 90 }} onClick={() => this.setAmount(1)}>1</button>
                                <button type="button" className="btn btn-lg btn-outline-info rounded-0" style={{ height: 90, width: 90 }} onClick={() => this.setAmount(2)}>2</button>
                                <button type="button" className="btn btn-lg btn-outline-info rounded-0" style={{ height: 90, width: 90 }} onClick={() => this.setAmount(3)}>3</button>
                            </div>
                        </div>
                        <div className="row d-flex justify-content-center">
                            <div className="btn-group" role="group" aria-label="Basic example">
                                <button type="button" className="btn btn-lg btn-outline-info rounded-0" style={{ height: 90, width: 90 }} onClick={() => this.setAmount(4)}>4</button>
                                <button type="button" className="btn btn-lg btn-outline-info rounded-0" style={{ height: 90, width: 90 }} onClick={() => this.setAmount(5)}>5</button>
                                <button type="button" className="btn btn-lg btn-outline-info rounded-0" style={{ height: 90, width: 90 }} onClick={() => this.setAmount(6)}>6</button>
                            </div>
                        </div>
                        <div className="row d-flex justify-content-center" >
                            <div className="btn-group" role="group" aria-label="Basic example">
                                <button type="button" className="btn btn-lg btn-outline-info rounded-0" style={{ height: 90, width: 90 }} onClick={() => this.setAmount(7)}>7</button>
                                <button type="button" className="btn btn-lg btn-outline-info rounded-0" style={{ height: 90, width: 90 }} onClick={() => this.setAmount(8)}>8</button>
                                <button type="button" className="btn btn-lg btn-outline-info rounded-0" style={{ height: 90, width: 90 }} onClick={() => this.setAmount(9)}>9</button>
                            </div>
                        </div>
                        <div className="row d-flex justify-content-center" >
                            <div className="btn-group" role="group" aria-label="Basic example">
                                <button type="button" className="btn btn-lg btn-outline-info rounded-0" style={{ height: 90, width: 90 }} onClick={() => this.cancel()}>Cancel</button>
                                <button type="button" className="btn btn-lg btn-outline-info rounded-0" style={{ height: 90, width: 90 }} onClick={() => this.setAmount(0)}>0</button>
                                <button type="button" className="btn btn-lg btn-outline-info rounded-0" style={{ height: 90, width: 90 }} onClick={() => this.setAmount(123)}>.</button>
                            </div>
                        </div>

                        <form id="newUserForm" onSubmit={this.requestPayment}>
                            <div className='row justify-content-center' style={{ marginTop: 30, marginLeft : 30 }}>
                                <div className='col-sm-2' style={{ padding: 0 }}>
                                    <input id="amount" defaultValue={this.state.amount || ''} type="text" className="form-control" placeholder="" required></input>
                                </div>
                                <div className='col-sm-4'>
                                    <button type="submit" className="btn btn-warning rounded-0 mr-2" form="newUserForm">Request Payment</button>
                                </div>
                            </div>
                        </form>

                        <div className='row justify-content-center' >
                            {transferList}
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <h2>Terminal</h2>
                        <table className="table table-sm" >
                            <tbody>
                                {terminalList}
                            </tbody>
                        </table>
                        <br />
                        <h2>Balance</h2>
                        <table className="table table-sm" >
                            <tbody>
                                {assetList}
                            </tbody>
                        </table>
                        <br />
                        <h2>Transaction history</h2>
                        <table className="table table-sm" >
                            <tbody>
                                {transactionList}
                            </tbody>
                        </table>
                    </div>
                </div>
                <SignalRService onChange={() => { this.refresh() }} />
            </div>)
    }
}

//map the props of this class to the root redux state
const mapStateToProps = (state: any) => {
    return {
        currencyList: state.lookupList[MyLookup.CurrencyList],
        symbolList: state.lookupList[MyLookup.SymbolList],
        terminalList: state.terminalList,
        assetList: state.assetList,
        transactionList: state.transactionList,
        transferList: state.transferList,
        symbolCurrentPrice: state.symbolCurrentPrice,
        testMode: state.testMode,
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        getTerminalList: (token: any) => dispatch<any>(actionCreator.default.crypto.terminalList(token)),
        getAssetList: (token: any) => dispatch<any>(actionCreator.default.crypto.binanceBalance(token)),
        getTransactionList: (token: any) => dispatch<any>(actionCreator.default.crypto.binanceTransactionHistory(token)),
        getTransferList: (token: any) => dispatch<any>(actionCreator.default.crypto.transferList(token)),
        geSymbolCurrentPrice: (symbol: any) => dispatch<any>(actionCreator.default.crypto.symbolCurrentPrice(symbol)),
        getLookupList: () => dispatch<any>(actionCreator.default.lookup.getLookupList()),
        saveTransferAmount: (token: any, requestTrans: any) => dispatch<any>(actionCreator.default.crypto.SaveTransferAmount(token, requestTrans)),
        getAppMode: (token: any) => dispatch<any>(actionCreator.default.crypto.GetAppMode(token)),
        updateAppMode: (token: any) => dispatch<any>(actionCreator.default.crypto.UpdateAppMode(token)),
        testExecuteTransaction: (token: any, transactionId : any) => dispatch<any>(actionCreator.default.crypto.TestExecuteTransaction(token, transactionId)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withAuth(CryptoTransfer));