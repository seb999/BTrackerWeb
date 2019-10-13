import axios from 'axios';
const apiUrl = '/api/User/';    


export const checkUserId = (accessToken : any) =>{
 return async (dispatch  :any) =>{
   try{
     const res = await axios.get<any>(apiUrl + "CheckUserId/", {headers: {Authorization: 'Bearer ' + accessToken}});
     return dispatch(checkUserIdSuccess(res.data));
   }
   catch (error) {
     throw (error)
   }
 }
}

export const checkUserIdSuccess = (data :any) => {
 return {
   type: "USER_CHECK_LOCAL",
   payload: data
 }
}
