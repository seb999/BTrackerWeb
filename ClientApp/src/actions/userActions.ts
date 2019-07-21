import axios from 'axios';
const apiUrl = '/api/User/';    

export const checkUserLocalId = (accessToken : any) =>{
 
  var header123 = {Authorization: 'Bearer ' + accessToken};

  console.log(header123);

 return async (dispatch  :any) =>{
   try{
     const res = await axios.get<any>(apiUrl + "CheckLocalUserId/", {headers: {header123}});
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
