import axios from 'axios';
const apiUrl = '/api/Loc/';    

export const getGpsDataList = (accessToken : any, deviceId  :any, maxData : any) =>{
  console.log("redux get map data");
 return async (dispatch  :any) =>{
   try{
     const res = await axios.get<any>(apiUrl + "GetGpsData/" + deviceId + "/" + maxData, {headers: {Authorization: 'Bearer ' + accessToken}});
     return dispatch(getGpsDataSuccess(res.data));
   }
   catch (error) {
     throw (error)
   }
 }
}

export const getGpsDataSuccess = (data :any) => {
 return {
   type: "GPS_POSITION_LIST",
   payload: data
 }
}

export const deleteGpsData = (accessToken : any, id  :any) =>{
  return async (dispatch  :any) =>{
    try{
      const res = await axios.get<any>(apiUrl + "deleteData/" + id, {headers: {Authorization: 'Bearer ' + accessToken}});
      return dispatch(deleteGpsDataSuccess(res.data));
    }
    catch (error) {
      throw (error)
    }
  }
 }
 
 export const deleteGpsDataSuccess = (data :any) => {
  return {
    type: "GPS_DELETE_DATA",
    payload: data
  }
 }

export const hideShowGpsPosition = (data : any) => {
  return {
    type: "GPS_POSITION_HIDE",
    payload: data.gpsPositionId
  }
}