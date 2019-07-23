import axios from 'axios';
const apiUrl = '/api/User/';    

export const checkUserLocalId = (accessToken : any) =>{

 return async (dispatch  :any) =>{
   try{
     const res = await axios.get<any>(apiUrl + "CheckLocalUserId/", {headers: {Authorization: 'Bearer ' + accessToken}});
     return dispatch(checkLocalUserSuccess(res.data));
   }
   catch (error) {
     throw (error)
   }
 }
}

export const checkLocalUserSuccess = (data :any) => {
 return {
   type: "USER_CHECK_LOCAL",
   payload: data
 }
}
