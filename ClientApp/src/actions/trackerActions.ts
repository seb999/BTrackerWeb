import axios from 'axios';
const apiUrl = '/api/Device/';    

export const lookupList = (accessToken : any) =>{
  return async (dispatch  :any) =>{
    try{
      //We are logged in the API so we don't need to pass again the userId
      const res = await axios.get<any>(apiUrl + "Get/", {headers: {Authorization: 'Bearer ' + accessToken}});
      return dispatch(lookupListSuccess(res.data));
    }
    catch (error) {
      throw (error)
    }
  }
 }
 
 export const lookupListSuccess = (data :any) => {
  return {
    type: "TRACKER_LOOKUP_LIST",
    payload: data
  }
 }

export const trackerList = (accessToken : any) =>{
 return async (dispatch  :any) =>{
   try{
     //We are logged in the API so we don't need to pass again the userId
     const res = await axios.get<any>(apiUrl + "GetDeviceList/", {headers: {Authorization: 'Bearer ' + accessToken}});
     return dispatch(trackerListSuccess(res.data));
   }
   catch (error) {
     throw (error)
   }
 }
}

export const trackerListSuccess = (data :any) => {
 return {
   type: "TRACKER_LIST",
   payload: data
 }
}

export const saveNewTracker = (accessToken: any, device :any) =>{
  return async (dispatch  :any) =>{
    //let device = {DeviceEUI : data.deviceEui, DeviceDescription : data.deviceDescription}
    try{
      const res = await axios.post<any>(apiUrl + "SaveDevice/", device, {headers: {Authorization: 'Bearer ' + accessToken}});
      dispatch(showSavedLabel());
      return dispatch(trackerSavedSuccess(res.data));
    }
    catch (error) {
      throw (error)
    }
  }
}

export const trackerSavedSuccess = (data :any) => {
  return {
    type: "TRACKER_SAVED",
    payload: data
  }
 }

 export const showSavedLabel = () =>{
  return async (dispatch  :any) =>{
    setTimeout(() => {
        dispatch(hideSavedLabel());
    }, 3000);
  }
}

export const hideSavedLabel = () =>{
  return {
    type:"TRACKER_HIDE_SAVED_LABEL"
  }
}

 export const deleteTracker = (accessToken: any, deviceId? :number) =>{
  return async (dispatch  :any) =>{
    try{
      const res = await axios.get<any>(apiUrl + "DeleteDevice/" + deviceId, {headers: {Authorization: 'Bearer ' + accessToken}});
      dispatch(showDeletedLabel());
      return dispatch(trackerDeletedSuccess(res.data));
    }
    catch (error) {
      throw (error)
    }
  }
}

export const trackerDeletedSuccess = (data :any) => {
  return {
    type: "TRACKER_DELETED",
    payload: data
  }
 }

export const showDeletedLabel = () =>{
 return async (dispatch  :any) =>{
   setTimeout(() => {
     dispatch(deletedSuccess())
   }, 5000);
 }
}

export const deletedSuccess = () =>{
 return {
   type:"TRACKER_HIDE_DELETED_LABEL"
 }
}

export const updateTracker = (accessToken: any, device :any) =>{
  return async (dispatch  :any) =>{
    //let device = {DeviceEUI : data.deviceEui, DeviceDescription : data.deviceDescription}
    try{
      const res = await axios.post<any>(apiUrl + "UpdateDevice/", device, {headers: {Authorization: 'Bearer ' + accessToken}});
      dispatch(showUpdatedLabel());
      return dispatch(trackerUpdatedSuccess(res.data));
    }
    catch (error) {
      throw (error)
    }
  }
}

export const trackerUpdatedSuccess = (data :any) => {
  return {
    type: "TRACKER_UPDATED",
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
    type:"TRACKER_HIDE_UPDATED_LABEL"
  }
}