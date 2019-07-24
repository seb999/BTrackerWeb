import axios from 'axios';
const apiUrl = '/api/Loc/';    

export const getGpsDataList = (accessToken : any, deviceId  :any, maxData : any) =>{
 return async (dispatch  :any) =>{
   try{
     const res = await axios.get<any>(apiUrl + "GetGpsData/" + deviceId + "/" + maxData, {headers: {Authorization: 'Bearer ' + accessToken}});
     return dispatch(GetGpsDataSuccess(res.data));
   }
   catch (error) {
     throw (error)
   }
 }
}

export const GetGpsDataSuccess = (data :any) => {
 return {
   type: "GPS_POSITION_LIST",
   payload: data
 }
}