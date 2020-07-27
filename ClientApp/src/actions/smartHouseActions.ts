import axios from 'axios';
const apiUrl = '/api/smarthouse/';    

export const getDoorSwitch = () =>{
  return async (dispatch  :any) =>{
    try{
      //We are logged in the API so we don't need to pass again the userId
      const res = await axios.get<any>(apiUrl + "GetDoorSwitch/");
      return dispatch(doorSwitchSuccess(res.data));
    }
    catch (error) {
      throw (error)
    }
  }
 }
 
 export const doorSwitchSuccess = (data :any) => {
  return {
    type: "DOOR",
    payload: data
  }
 }

 export const openDoor = (user :any) =>{
  return async (dispatch  :any) =>{
    try{
      const res = await axios.post<any>(apiUrl + "OpenDoor/", user);
      return dispatch(openDoorSuccess(res.data));
    }
    catch (error) {
      throw (error)
    }
  }
}
 
 export const openDoorSuccess = (data :any) => {
  return {
    type: "OPEN_DOOR",
    payload: data
  }
 }

export const getSwitchList = () =>{
  return async (dispatch  :any) =>{
    try{
      //We are logged in the API so we don't need to pass again the userId
      const res = await axios.get<any>(apiUrl + "GetSwitchList/");
      return dispatch(switchListSuccess(res.data));
    }
    catch (error) {
      throw (error)
    }
  }
 }
 
 export const switchListSuccess = (data :any) => {
  return {
    type: "SWITCH_LIST",
    payload: data
  }
 }

export const updateSwitch = (theSwitch :any) =>{
  return async (dispatch  :any) =>{
    try{
      const res = await axios.post<any>(apiUrl + "UpdateSwitch/", theSwitch);
      dispatch(showUpdatedLabel());
      return dispatch(switchUpdatedSuccess(res.data));
    }
    catch (error) {
      throw (error)
    }
  }
}

export const switchUpdatedSuccess = (data :any) => {
  return {
    type: "SWITCH_UPDATED",
    payload: data
  }
 }

 export const showUpdatedLabel = () =>{
  return async (dispatch  :any) =>{
    setTimeout(() => {
        dispatch(hideUpdatedLabel());
    }, 3000);
  }
}

export const hideUpdatedLabel = () =>{
  return {
    type:"SWITCH_HIDE_UPDATED_LABEL"
  }
}

export const getUserList = (accessToken: any) =>{
  return async (dispatch  :any) =>{
    try{
      //We are logged in the API so we don't need to pass again the userId
      const res = await axios.get<any>(apiUrl + "GetUserList/", {headers: {Authorization: 'Bearer ' + accessToken}});
      return dispatch(getUserListSuccess(res.data));
    }
    catch (error) {
      throw (error)
    }
  }
 }
 
 export const getUserListSuccess = (data :any) => {
  return {
    type: "SMARTHOUSE_GET_USER_LIST",
    payload: data
  }
 }

 export const updateUser = (user :any, accessToken: any ) =>{
  return async (dispatch  :any) =>{
    try{
      //We are logged in the API so we don't need to pass again the userId
      const res = await axios.post<any>(apiUrl + "UpdateUser/",user, {headers: {Authorization: 'Bearer ' + accessToken}});
      return dispatch(updateUserSuccess(res.data));
    }
    catch (error) {
      throw (error)
    }
  }
 }
 
 export const updateUserSuccess = (data :any) => {
  return {
    type: "SMARTHOUSE_UPDATE_USER",
    payload: data
  }
 }

 export const checkCode = (accessToken: any, user :any) =>{
  return async (dispatch  :any) =>{
    try{
      const res = await axios.post<any>(apiUrl + "CheckCode/",user, {headers: {Authorization: 'Bearer ' + accessToken}});
      return dispatch(checkCodeSuccess(res.data));
    }
    catch (error) {
      throw (error)
    }
  }
 }
 
 export const checkCodeSuccess = (data :any) => {
  return {
    type: "SMARTHOUSE_CHECK_CODE",
    payload: data
  }
 }

 export const saveUser = (accessToken: any, user :any) =>{
  return async (dispatch  :any) =>{
    try{
      const res = await axios.post<any>(apiUrl + "SaveUser/",user, {headers: {Authorization: 'Bearer ' + accessToken}});
      return dispatch(saveUseruccess(res.data));
    }
    catch (error) {
      throw (error)
    }
  }
 }
 
 export const saveUseruccess = (data :any) => {
  return {
    type: "SMARTHOUSE_SAVE_USER",
    payload: data
  }
 }