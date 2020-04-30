import axios from 'axios';
const apiUrl = '/api/smarthouse/';    

export const getSwitchList = () =>{
  return async (dispatch  :any) =>{
    try{
      //We are logged in the API so we don't need to pass again the userId
      console.log("dsfsdfsdf");
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