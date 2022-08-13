import axios from 'axios';
const apiUrl = '/api/crypto/';    

////////////////////////////////////////////////////////////////
//--------------GET TERMINAL LIST-----------------------------//
////////////////////////////////////////////////////////////////

export const terminalList = (accessToken : any) =>{
  return async (dispatch  :any) =>{
    try{
      //We are logged in the API so we don't need to pass again the userId
      const res = await axios.get<any>(apiUrl + "GetTerminalList/", {headers: {Authorization: 'Bearer ' + accessToken}});
      return dispatch(terminalListSuccess(res.data));
    }
    catch (error) {
      throw (error)
    }
  }
 }
 
 export const terminalListSuccess = (data :any) => {
  return {
    type: "TERMINAL_LIST",
    payload: data
  }
 }

 ///////////////////////////////////////////////////////////////
//--------------GET SYMBOL CURRENT PRICE----------------------//
////////////////////////////////////////////////////////////////
 export const symbolCurrentPrice = ( symbol: any) =>{
  return async (dispatch  :any) =>{
    try{
      //We are logged in the API so we don't need to pass again the userId
      const res = await axios.get<any>("https://api3.binance.com/api/v3/avgPrice?symbol=" + symbol);
      return dispatch(symbolCurrentPriceSuccess(res.data));
    }
    catch (error) {
      throw (error)
    }
  }
 }
 
 export const symbolCurrentPriceSuccess = (data :any) => {
  return {
    type: "BINANCE_SYMBOL_PRICE",
    payload: data
  }
 }

 ////////////////////////////////////////////////////////////////
//--------------GET ASSET BALANCE from BINANCE-----------------------------//
////////////////////////////////////////////////////////////////
export const binanceBalance = (accessToken : any) =>{
  return async (dispatch  :any) =>{
    try{
      //We are logged in the API so we don't need to pass again the userId
      const res = await axios.get<any>(apiUrl + "BinanceBalance/", {headers: {Authorization: 'Bearer ' + accessToken}});
      return dispatch(binanceBalanceSuccess(res.data));
    }
    catch (error) {
      throw (error)
    }
  }
 }
 
 export const binanceBalanceSuccess = (data :any) => {
  return {
    type: "BINANCE_BALANCE",
    payload: data
  }
 }

 ////////////////////////////////////////////////////////////////
//--------------GET TRANSACTION HISTORY from BINANCE-----------//
////////////////////////////////////////////////////////////////
export const binanceTransactionHistory = (accessToken : any) =>{
  return async (dispatch  :any) =>{
    try{
      //We are logged in the API so we don't need to pass again the userId
      const res = await axios.get<any>(apiUrl + "BinanceTransactionHistory/", {headers: {Authorization: 'Bearer ' + accessToken}});
      return dispatch(binanceTransactionHistorySuccess(res.data));
    }
    catch (error) {
      throw (error)
    }
  }
 }
 
 export const binanceTransactionHistorySuccess = (data :any) => {
  return {
    type: "BINANCE_TRANS_HISTORY",
    payload: data
  }
 }

///////////////////////////////////////////////////////////
//-------------SAVE NEW TRANSFER-------------------------//
///////////////////////////////////////////////////////////
export const SaveTransferAmount = (accessToken: any, requestTrans :any) =>{
  return async (dispatch  :any) =>{
    try{
      const res = await axios.post<any>(apiUrl + "SaveTransferAmount/",requestTrans, {headers: {Authorization: 'Bearer ' + accessToken}});
      return dispatch(saveTransfertSuccess(res.data));
    }
    catch (error) {
      throw (error)
    }
  }
 }
 
 export const saveTransfertSuccess = (data :any) => {
  return {
    type: "TRANSACTION_SAVED",
    payload: data
  }
 }

 ////////////////////////////////////////////////////////////////
//--------------GET TRANSFER LIST-----------------------------//
////////////////////////////////////////////////////////////////

export const transferList = (accessToken : any) =>{
  return async (dispatch  :any) =>{
    try{
      //We are logged in the API so we don't need to pass again the userId
      const res = await axios.get<any>(apiUrl + "GetTransferList/", {headers: {Authorization: 'Bearer ' + accessToken}});
      return dispatch(transferListSuccess(res.data));
    }
    catch (error) {
      throw (error)
    }
  }
 }
 
 export const transferListSuccess = (data :any) => {
  return {
    type: "TRANSFER_LIST",
    payload: data
  }
 }

  ////////////////////////////////////////////////////////////////
//--------------TEST EXECUTE TRANSAVCTION----------------------//
////////////////////////////////////////////////////////////////

export const TestExecuteTransaction = (accessToken : any, transactionId : number) =>{
  return async (dispatch  :any) =>{
    try{
      //We are logged in the API so we don't need to pass again the userId
      console.log(transactionId);
      const res = await axios.get<any>(apiUrl + "ArduinoExecTransfer/" + transactionId, {headers: {Authorization: 'Bearer ' + accessToken}});
      return dispatch(testExecuteTransactionSuccess(res.data));
    }
    catch (error) {
      throw (error)
    }
  }
 }
 
 export const testExecuteTransactionSuccess = (data :any) => {
  return {
    type: "TEST_EXEC_TRANS",
    payload: data
  }
 }

 ///////////////////////////////////////////////////////////
//-------------READ/UPDATE SETTING-----------------------//
///////////////////////////////////////////////////////////
export const GetAppMode = (accessToken: any) =>{
  return async (dispatch  :any) =>{
    try{
      const res = await axios.get<any>(apiUrl + "GetAppMode/", {headers: {Authorization: 'Bearer ' + accessToken}});
      return dispatch(GetAppModeSuccess(res.data));
    }
    catch (error) {
      throw (error)
    }
  }
 }
 
 export const GetAppModeSuccess = (data :any) => {
  return {
    type: "GET_APP_MODE",
    payload: data
  }
 }

export const UpdateAppMode = (accessToken: any) =>{
  return async (dispatch  :any) =>{
    try{
      const res = await axios.get<any>(apiUrl + "UpdateAppMode/", {headers: {Authorization: 'Bearer ' + accessToken}});
      return dispatch(setAppModeSuccess(res.data));
    }
    catch (error) {
      throw (error)
    }
  }
 }
 
 export const setAppModeSuccess = (data :any) => {
  return {
    type: "UPDATE_APP_MODE",
    payload: data
  }
 }

