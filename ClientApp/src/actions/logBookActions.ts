import axios from 'axios';
const apiUrl = '/api/logbook/';    

// -------------Get logbook list ----------------
export const getLogList = (accessToken: any) =>{
  return async (dispatch  :any) =>{
    try{
      //We are logged in the API so we don't need to pass again the userId
      const res = await axios.get<any>(apiUrl + "GetLogBookList/", {headers: {Authorization: 'Bearer ' + accessToken}});
      return dispatch(getLogListSuccess(res.data));
    }
    catch (error) {
      throw (error)
    }
  }
 }
 
 export const getLogListSuccess = (data :any) => {
  return {
    type: "LOG_LIST",
    payload: data
  }
 }

//  UPDATE LOG---------------------------------------------
 export const updateLog = (accessToken: any, log: any ) =>{
  return async (dispatch  :any) =>{
    try{
      //We are logged in the API so we don't need to pass again the userId
      const res = await axios.post<any>(apiUrl + "UpdateLog/",log, {headers: {Authorization: 'Bearer ' + accessToken}});
      dispatch(showsUpdateLogLabel());
      return dispatch(updateLogSuccess(res.data));
    }
    catch (error) {
      throw (error)
    }
  }
 }
 
 export const updateLogSuccess = (data :any) => {
  return {
    type: "LOG_UPDATED",
    payload: data
  }
 }

 export const showsUpdateLogLabel = () =>{
  return async (dispatch  :any) =>{
    setTimeout(() => {
        dispatch(hideUpdateLogLabel());
    }, 3000);
  }
}

export const hideUpdateLogLabel = () =>{
  return {
    type:"LOG_UPDATED_HIDE_LABEL"
  }
}

//  ADD LOG----------------------------------------------
 export const addLog = (accessToken: any, log :any) =>{
  console.log("Action save me");
  return async (dispatch  :any) =>{
    try{
      const res = await axios.post<any>(apiUrl + "SaveLog/",log, {headers: {Authorization: 'Bearer ' + accessToken}});
      dispatch(showsSaveLogLabel());
      return dispatch(saveLogSuccess(res.data));
    }
    catch (error) {
      throw (error)
    }
  }
 }
 
 export const saveLogSuccess = (data :any) => {
  return {
    type: "LOG_SAVED",
    payload: data
  }
 }

 export const showsSaveLogLabel = () =>{
  return async (dispatch  :any) =>{
    setTimeout(() => {
        dispatch(hideSaveLogLabel());
    }, 3000);
  }
}

export const hideSaveLogLabel = () =>{
  return {
    type:"LOG_SAVED_HIDE_LABEL"
  }
}

// DELETE LOG-----------------------------------
export const deleteLog = (accessToken: any, logId? :number) =>{
  return async (dispatch  :any) =>{
    try{
      const res = await axios.get<any>(apiUrl + "DeleteLog/" + logId, {headers: {Authorization: 'Bearer ' + accessToken}});
      dispatch(showLDeletedLogLabel());
      return dispatch(logDeleteLogSuccess(res.data));
    }
    catch (error) {
      throw (error)
    }
  }
}

export const logDeleteLogSuccess = (data :any) => {
  return {
    type: "LOG_DELETED",
    payload: data
  }
 }

export const showLDeletedLogLabel = () =>{
 return async (dispatch  :any) =>{
   setTimeout(() => {
     dispatch(hideDeletedLogLabel())
   }, 5000);
 }
}

export const hideDeletedLogLabel = () =>{
 return {
   type:"LOG_DELETED_HIDE_LABEL"
 }
}