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
      dispatch(showsSaveTransfertLabel());
      return dispatch(saveTransfertSuccess(res.data));
    }
    catch (error) {
      throw (error)
    }
  }
 }
 
 export const saveTransfertSuccess = (data :any) => {
  return {
    type: "CR_TRANS_SAVED",
    payload: data
  }
 }

 export const showsSaveTransfertLabel = () =>{
  return async (dispatch  :any) =>{
    setTimeout(() => {
        dispatch(hideSaveLogLabel());
    }, 3000);
  }
}

export const hideSaveLogLabel = () =>{
  return {
    type:"CR_TRANS_SAVED_HIDE_LABEL"
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

