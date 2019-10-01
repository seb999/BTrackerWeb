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
    dispatch(saving());
    //let device = {DeviceEUI : data.deviceEui, DeviceDescription : data.deviceDescription}
    try{
      const res = await axios.post<any>(apiUrl + "SaveDevice/", device, {headers: {Authorization: 'Bearer ' + accessToken}});
      dispatch(saved());
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

 export const saving = () =>{
   return {
     type:"SAVING"
   }
 }

 export const saved = () =>{
  return async (dispatch  :any) =>{
    setTimeout(() => {
      dispatch(savedSuccess())
    }, 3000);
  }
}

export const savedSuccess = () =>{
  return {
    type:"SAVED"
  }
}

 export const deleteTracker = (accessToken: any, deviceId :number) =>{
  return async (dispatch  :any) =>{
    dispatch(deleting());
    try{
      const res = await axios.get<any>(apiUrl + "DeleteDevice/" + deviceId, {headers: {Authorization: 'Bearer ' + accessToken}});
      dispatch(deleted());
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

 export const deleting = () =>{
  return {
    type:"DELETING"
  }
}

export const deleted = () =>{
 return async (dispatch  :any) =>{
   setTimeout(() => {
     dispatch(deletedSuccess())
   }, 3000);
 }
}

export const deletedSuccess = () =>{
 return {
   type:"DELETED"
 }
}